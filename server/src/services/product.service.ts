import { Types, SortOrder } from "mongoose";
import { Product } from "../models/product.model";
import { FilterQuery } from "../types";

export class ProductService {
  async createProduct(data: any) {
    const product = new Product(data);
    await product.save();
    return product;
  }

  async listProducts(query: FilterQuery = {}) {
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
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sort: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return {
      data: products,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getProductById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }
    const product = await Product.findById(id);
    return product;
  }

  async updateProduct(id: string, data: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async deleteProduct(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}
