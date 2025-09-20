import { Types } from "mongoose";
import { Product } from "../models/product.model";
import { BOM } from "../models/bom.model";

export const createTestProduct = async (data: any = {}) => {
  const uniqueSuffix = Date.now().toString().slice(-4);
  const defaultProduct = {
    name: "Test Product",
    sku: `TP${uniqueSuffix}`,
    unitOfMeasure: "pcs",
    type: "Finished",
    defaultWarehouseId: new Types.ObjectId(),
    description: "Test product description",
    cost: 100,
    price: 150,
    ...data,
  };

  return await Product.create(defaultProduct);
};

export const createTestBOM = async (data: any = {}) => {
  const product = await createTestProduct();
  const component = await createTestProduct({
    name: "Component",
    sku: `CP${Date.now().toString().slice(-4)}`,
    cost: 50,
    type: "Raw",
  });

  const defaultBOM = {
    productId: product._id,
    version: 1,
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
