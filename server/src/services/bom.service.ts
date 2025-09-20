import { Types } from "mongoose";
import { BOM } from "../models/bom.model";
import { FilterQuery } from "../types";
import { Product } from "../models/product.model";

export class BOMService {
  async create(data: any) {
    // Validate product exists
    const product = await Product.findById(data.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Validate component products exist
    for (const item of data.items) {
      const componentProduct = await Product.findById(item.componentId);
      if (!componentProduct) {
        throw new Error(`Component product ${item.componentId} not found`);
      }
    }

    const bom = new BOM(data);
    await bom.save();
    return bom;
  }

  async list(query: FilterQuery = {}) {
    const {
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
      ...filters
    } = query;

    const filter: any = { ...filters };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { version: { $regex: search, $options: "i" } },
      ];
    }

    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [boms, total] = await Promise.all([
      BOM.find(filter)
        .populate("productId", "name code")
        .populate("items.componentId", "name sku")
        .sort(sort as any)
        .skip(skip)
        .limit(Number(limit)),
      BOM.countDocuments(filter),
    ]);

    return {
      data: boms,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid BOM ID");
    }

    const bom = await BOM.findById(id)
      .populate("productId", "name code")
      .populate("items.componentId", "name sku");

    return bom;
  }

  async update(id: string, data: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid BOM ID");
    }

    // Validate product if changed
    if (data.productId) {
      const product = await Product.findById(data.productId);
      if (!product) {
        throw new Error("Product not found");
      }
    }

    // Validate component products if changed
    if (data.items) {
      for (const item of data.items) {
        const componentProduct = await Product.findById(item.componentId);
        if (!componentProduct) {
          throw new Error(`Component product ${item.componentId} not found`);
        }
      }
    }

    const bom = await BOM.findByIdAndUpdate(id, data, { new: true })
      .populate("productId", "name code")
      .populate("items.componentId", "name sku");

    if (!bom) {
      throw new Error("BOM not found");
    }

    return bom;
  }

  async toggleActive(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid BOM ID");
    }

    const bom = await BOM.findById(id);
    if (!bom) {
      throw new Error("BOM not found");
    }

    // If activating, deactivate other BOMs for the same product
    if (!bom.isActive) {
      await BOM.updateMany(
        {
          productId: bom.productId,
          _id: { $ne: id },
          isActive: true,
        },
        { isActive: false }
      );
    }

    // Toggle active status
    bom.isActive = !bom.isActive;
    await bom.save();

    return bom.populate(["productId", "items.componentId"]);
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid BOM ID");
    }

    const result = await BOM.findByIdAndDelete(id);
    return !!result;
  }

  async calculateCost(id: string): Promise<{
    id: Types.ObjectId;
    product: Types.ObjectId;
    version: string;
    totalCost: number;
    items: Array<{
      component: {
        id: Types.ObjectId;
        name: string;
        sku: string;
      };
      qtyPerUnit: number;
      unitCost: number;
      totalCost: number;
    }>;
    operations: Array<{
      name: string;
      workCenterId: Types.ObjectId;
      duration: number;
    }>;
  }> {
    const bom = await BOM.findById(id)
      .populate({
        path: "items.componentId",
        select: "name sku cost",
      })
      .populate("productId", "name code");

    if (!bom) {
      throw new Error("BOM not found");
    }

    let totalCost = 0;
    const itemCosts = [];

    for (const item of bom.items) {
      const component = item.componentId as any;
      const itemCost = component.cost * item.qtyPerUnit;
      totalCost += itemCost;

      itemCosts.push({
        component: {
          id: component._id,
          name: component.name,
          sku: component.sku,
        },
        qtyPerUnit: item.qtyPerUnit,
        unitCost: component.cost,
        totalCost: itemCost,
      });
    }

    return {
      id: bom._id as Types.ObjectId,
      product: bom.productId,
      version: bom.version,
      totalCost,
      items: itemCosts,
      operations: bom.operations,
    };
  }

  async getUsage(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const boms = await BOM.find({
      "items.componentId": productId,
    })
      .populate("productId", "name code")
      .populate("items.componentId", "name sku");

    return boms.map((bom) => ({
      id: bom._id,
      product: bom.productId,
      version: bom.version,
      items: bom.items
        .filter((item) => item.componentId.toString() === productId)
        .map((item) => ({
          qtyPerUnit: item.qtyPerUnit,
        })),
    }));
  }
}
