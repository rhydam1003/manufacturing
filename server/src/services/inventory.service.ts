import { Types } from "mongoose";
import { StockTransaction } from "../models/stock-transaction.model";
import { InventoryItem } from "../models/inventory-item.model";
import { FilterQuery } from "../types";
import { Product } from "../models/product.model";
import { Warehouse } from "../models/warehouse.model";

export class InventoryService {
  async getStock(query: FilterQuery = {}) {
    const {
      productId,
      warehouseId,
      minQuantity,
      maxQuantity,
      sortBy = "quantity",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    if (productId) filter.productId = productId;
    if (warehouseId) filter.warehouseId = warehouseId;
    if (minQuantity) filter.quantity = { $gte: Number(minQuantity) };
    if (maxQuantity)
      filter.quantity = { ...filter.quantity, $lte: Number(maxQuantity) };

    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      InventoryItem.find(filter)
        .populate("productId", "name code")
        .populate("warehouseId", "name code")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      InventoryItem.countDocuments(filter),
    ]);

    return {
      data: items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async adjustStock(data: any, userId: string) {
    const { productId, warehouseId, quantity, type, reason } = data;

    // Validate references
    const [product, warehouse] = await Promise.all([
      Product.findById(productId),
      Warehouse.findById(warehouseId),
    ]);

    if (!product) throw new Error("Product not found");
    if (!warehouse) throw new Error("Warehouse not found");

    // Create or update inventory item
    const inventoryItem = await InventoryItem.findOneAndUpdate(
      { productId, warehouseId },
      {
        $inc: { quantity: type === "increase" ? quantity : -quantity },
        $setOnInsert: { productId, warehouseId },
      },
      { new: true, upsert: true }
    );

    // Create transaction record
    const transaction = new StockTransaction({
      productId,
      warehouseId,
      quantity: Math.abs(quantity),
      type,
      reason,
      userId,
      balanceAfter: inventoryItem.quantity,
    });

    await transaction.save();

    return {
      inventoryItem,
      transaction,
    };
  }

  async transferStock(data: any, userId: string) {
    const {
      productId,
      sourceWarehouseId,
      targetWarehouseId,
      quantity,
      reason,
    } = data;

    // Validate references
    const [product, sourceWarehouse, targetWarehouse] = await Promise.all([
      Product.findById(productId),
      Warehouse.findById(sourceWarehouseId),
      Warehouse.findById(targetWarehouseId),
    ]);

    if (!product) throw new Error("Product not found");
    if (!sourceWarehouse) throw new Error("Source warehouse not found");
    if (!targetWarehouse) throw new Error("Target warehouse not found");

    // Check source stock
    const sourceStock = await InventoryItem.findOne({
      productId,
      warehouseId: sourceWarehouseId,
    });

    if (!sourceStock || sourceStock.quantity < quantity) {
      throw new Error("Insufficient stock in source warehouse");
    }

    // Perform transfer
    const [updatedSource, updatedTarget] = await Promise.all([
      // Decrease source stock
      InventoryItem.findOneAndUpdate(
        { productId, warehouseId: sourceWarehouseId },
        { $inc: { quantity: -quantity } },
        { new: true }
      ),
      // Increase target stock
      InventoryItem.findOneAndUpdate(
        { productId, warehouseId: targetWarehouseId },
        {
          $inc: { quantity: quantity },
          $setOnInsert: { productId, warehouseId: targetWarehouseId },
        },
        { new: true, upsert: true }
      ),
    ]);

    // Create transaction records
    const transactions = await Promise.all([
      // Source transaction
      new StockTransaction({
        productId,
        warehouseId: sourceWarehouseId,
        quantity,
        type: "decrease",
        reason: `Transfer to ${targetWarehouse.name}: ${reason}`,
        userId,
        balanceAfter: updatedSource.quantity,
        relatedWarehouseId: targetWarehouseId,
      }).save(),
      // Target transaction
      new StockTransaction({
        productId,
        warehouseId: targetWarehouseId,
        quantity,
        type: "increase",
        reason: `Transfer from ${sourceWarehouse.name}: ${reason}`,
        userId,
        balanceAfter: updatedTarget.quantity,
        relatedWarehouseId: sourceWarehouseId,
      }).save(),
    ]);

    return {
      sourceStock: updatedSource,
      targetStock: updatedTarget,
      transactions,
    };
  }

  async getLedger(query: FilterQuery = {}) {
    const {
      productId,
      warehouseId,
      startDate,
      endDate,
      type,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    if (productId) filter.productId = productId;
    if (warehouseId) filter.warehouseId = warehouseId;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      StockTransaction.find(filter)
        .populate("productId", "name code")
        .populate("warehouseId", "name code")
        .populate("userId", "name")
        .populate("relatedWarehouseId", "name code")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      StockTransaction.countDocuments(filter),
    ]);

    return {
      data: transactions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }
}
