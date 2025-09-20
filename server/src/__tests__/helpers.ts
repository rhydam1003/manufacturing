import { Types } from "mongoose";
import { Product } from "../models/product.model";
import { BOM } from "../models/bom.model";

export const createTestProduct = async (data: any = {}) => {
  const uniqueSuffix = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  const defaultProduct = {
    name: "Test Product",
    sku: `TP${uniqueSuffix}`,
    unit: "pcs",
    type: "Finished",
    defaultWarehouseId: new Types.ObjectId(),
    ...data,
  };

  return await Product.create(defaultProduct);
};

export const createTestBOM = async (data: any = {}) => {
  const product = await createTestProduct();
  const component = await createTestProduct({
    name: "Component",
    sku: `CP${Date.now().toString() + Math.random().toString(36).substr(2, 5)}`,
    type: "Raw",
    cost: 50,
  });

  const defaultBOM = {
    productId: product._id,
    name: "Test BOM",
    version: "1.0.0",
    isActive: true,
    items: [
      {
        componentId: component._id,
        qtyPerUnit: 2,
      },
    ],
    operations: [
      {
        name: "Assembly",
        workCenterId: new Types.ObjectId(),
        duration: 30,
      },
    ],
    ...data,
  };

  return {
    bom: await BOM.create(defaultBOM),
    product,
    component,
  };
};

export const generateMongoId = () => new Types.ObjectId().toString();
