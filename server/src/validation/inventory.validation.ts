import { body } from "express-validator";

export const adjustInventoryValidator = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("warehouseId").isMongoId().withMessage("Valid warehouse ID is required"),
  body("quantity").isNumeric().withMessage("Quantity must be a number"),
  body("type")
    .isIn(["increase", "decrease"])
    .withMessage("Type must be either increase or decrease"),
  body("reason").isString().notEmpty().withMessage("Reason is required"),
];

export const transferStockValidator = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("sourceWarehouseId")
    .isMongoId()
    .withMessage("Valid source warehouse ID is required"),
  body("targetWarehouseId")
    .isMongoId()
    .withMessage("Valid target warehouse ID is required")
    .custom((value, { req }) => {
      if (value === req.body.sourceWarehouseId) {
        throw new Error("Source and target warehouses must be different");
      }
      return true;
    }),
  body("quantity")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Quantity must be greater than 0");
      }
      return true;
    }),
  body("reason").isString().notEmpty().withMessage("Reason is required"),
];
