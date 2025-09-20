import request from "supertest";
import { app } from "./testApp";
import { createTestProduct, generateMongoId } from "./helpers";
import { Types } from "mongoose";

describe("Product API Endpoints", () => {
  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const productData = {
        name: "Test Product",
        code: "TEST001",
        description: "Test description",
        category: "raw-material",
        unit: "pcs",
        cost: 100,
        price: 150,
        minimumStock: 10,
        reorderPoint: 20,
      };

      const response = await request(app)
        .post("/api/products")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: productData.name,
        code: productData.code,
        cost: productData.cost,
      });
    });

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/products").send({
        description: "Missing required fields",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should prevent duplicate product codes", async () => {
      const productData = {
        name: "Test Product",
        code: "UNIQUE001",
        category: "raw-material",
        unit: "pcs",
        cost: 100,
        price: 150,
      };

      // Create first product
      await request(app).post("/api/products").send(productData);

      // Try to create another product with same code
      const response = await request(app)
        .post("/api/products")
        .send(productData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/products", () => {
    it("should return list of products", async () => {
      const product = await createTestProduct();

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]._id.toString()).toBe(product._id.toString());
    });

    it("should filter products by category", async () => {
      const product1 = await createTestProduct({ category: "raw-material" });
      const product2 = await createTestProduct({ category: "finished-good" });

      const response = await request(app)
        .get("/api/products")
        .query({ category: "raw-material" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]._id.toString()).toBe(
        product1._id.toString()
      );
    });

    it("should support pagination", async () => {
      // Create multiple products
      await Promise.all([
        createTestProduct({ code: "TEST001" }),
        createTestProduct({ code: "TEST002" }),
        createTestProduct({ code: "TEST003" }),
      ]);

      const response = await request(app)
        .get("/api/products")
        .query({ limit: 2, page: 1 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(3);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a specific product", async () => {
      const product = await createTestProduct();

      const response = await request(app).get(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(product._id.toString());
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).get(
        `/api/products/${generateMongoId()}`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update a product", async () => {
      const product = await createTestProduct();
      const updates = {
        name: "Updated Product",
        cost: 200,
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updates.name);
      expect(response.body.data.cost).toBe(updates.cost);
    });

    it("should validate update data", async () => {
      const product = await createTestProduct();
      const updates = {
        cost: -100, // Testing validation of negative cost
        price: 150,
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updates);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete a product", async () => {
      const product = await createTestProduct();

      const response = await request(app).delete(
        `/api/products/${product._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify deletion
      const getResponse = await request(app).get(
        `/api/products/${product._id}`
      );
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).delete(
        `/api/products/${generateMongoId()}`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it("should prevent deletion of products used in BOMs", async () => {
      // First create a product and use it in a BOM
      const product = await createTestProduct();
      await request(app)
        .post("/api/bom")
        .send({
          productId: new Types.ObjectId(),
          items: [
            {
              componentId: product._id,
              qtyPerUnit: 1,
            },
          ],
        });

      // Try to delete the product
      const response = await request(app).delete(
        `/api/products/${product._id}`
      );

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/products/inventory", () => {
    it("should return product inventory status", async () => {
      const product = await createTestProduct({
        minimumStock: 10,
        reorderPoint: 20,
      });

      const response = await request(app).get("/api/products/inventory");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      const productData = response.body.data.find(
        (p: any) => p._id.toString() === product._id.toString()
      );
      expect(productData).toBeDefined();
      expect(productData).toHaveProperty("currentStock");
      expect(productData).toHaveProperty("minimumStock");
      expect(productData).toHaveProperty("reorderPoint");
    });

    it("should filter low stock products", async () => {
      await createTestProduct({
        minimumStock: 10,
        reorderPoint: 20,
        currentStock: 5, // Below minimum
      });

      await createTestProduct({
        minimumStock: 10,
        reorderPoint: 20,
        currentStock: 15, // Above minimum
      });

      const response = await request(app)
        .get("/api/products/inventory")
        .query({ lowStock: true });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].currentStock).toBeLessThan(
        response.body.data[0].minimumStock
      );
    });
  });
});
