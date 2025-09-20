import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  async create(req: Request, res: Response) {
    const data = req.body;
    const product = await this.service.createProduct(data);
    res.status(201).json(product);
  }

  async list(req: Request, res: Response) {
    const products = await this.service.listProducts(req.query);
    res.json(products);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.service.getProductById(id);
    res.json(product);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const product = await this.service.updateProduct(id, data);
    res.json(product);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.deleteProduct(id);
    res.status(204).send();
  }
}
