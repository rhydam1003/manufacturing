import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const product = await this.service.createProduct(data);
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === "Product with this SKU already exists") {
        return res.status(409).json({
          success: false,
          error: "Product with this SKU already exists",
        });
      }
      throw error;
    }
  }

  async list(req: Request, res: Response) {
    const result = await this.service.listProducts(req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.service.getProductById(id);
      res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === "Product not found") {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      if (error.message === "Invalid product ID") {
        return res.status(400).json({
          success: false,
          error: "Invalid product ID",
        });
      }
      throw error;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const product = await this.service.updateProduct(id, data);
      res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === "Product not found") {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      if (error.message === "Invalid product ID") {
        return res.status(400).json({
          success: false,
          error: "Invalid product ID",
        });
      }
      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteProduct(id);
      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      if (error.message === "Product not found") {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      if (error.message === "Invalid product ID") {
        return res.status(400).json({
          success: false,
          error: "Invalid product ID",
        });
      }
      if (error.message === "Cannot delete product that is used in BOMs") {
        return res.status(409).json({
          success: false,
          error: "Cannot delete product that is used in BOMs",
        });
      }
      throw error;
    }
  }
}
