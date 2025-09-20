import request from "supertest";
import { app } from "./testApp";
import { createTestBOM, createTestProduct, generateMongoId } from "./helpers";
import { Types } from "mongoose";

describe("BOM API Endpoints", () => {
  describe("POST /api/bom", () => {
    it("should create a new BOM", async () => {
      const product = await createTestProduct();
      const component = await createTestProduct();

      const response = await request(app)
        .post("/api/bom")
        .send({
          productId: product._id,
          name: "Test BOM",
          version: "1.0.0",
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
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.productId.toString()).toBe(
        product._id.toString()
      );
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app).post("/api/bom").send({
        version: "1.0.0",
        // Missing required productId
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/bom", () => {
    it("should return list of BOMs", async () => {
      const { bom } = await createTestBOM();

      const response = await request(app).get("/api/bom");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]._id.toString()).toBe(bom._id.toString());
    });

    it("should filter BOMs by product", async () => {
      const { bom, product } = await createTestBOM();
      await createTestBOM(); // Another BOM

      const response = await request(app)
        .get("/api/bom")
        .query({ productId: product._id.toString() });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]._id.toString()).toBe(bom._id.toString());
    });
  });

  describe("GET /api/bom/:id", () => {
    it("should return a specific BOM", async () => {
      const { bom } = await createTestBOM();

      const response = await request(app).get(`/api/bom/${bom._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(bom._id.toString());
    });

    it("should return 404 for non-existent BOM", async () => {
      const response = await request(app).get(`/api/bom/${generateMongoId()}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/bom/:id", () => {
    it("should update a BOM", async () => {
      const { bom } = await createTestBOM();
      const newVersion = "2.0.0";

      const response = await request(app)
        .put(`/api/bom/${bom._id}`)
        .send({ version: newVersion });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.version).toBe(newVersion);
    });
  });

  describe("DELETE /api/bom/:id", () => {
    it("should delete a BOM", async () => {
      const { bom } = await createTestBOM();

      const response = await request(app).delete(`/api/bom/${bom._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify deletion
      const getResponse = await request(app).get(`/api/bom/${bom._id}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe("POST /api/bom/:id/toggle-active", () => {
    it("should toggle BOM active status", async () => {
      const { bom } = await createTestBOM();
      const initialStatus = bom.isActive;

      const response = await request(app).post(
        `/api/bom/${bom._id}/toggle-active`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(!initialStatus);
    });
  });

  describe("GET /api/bom/:id/cost", () => {
    it("should calculate BOM cost", async () => {
      const { bom, component } = await createTestBOM();

      const response = await request(app).get(`/api/bom/${bom._id}/cost`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalCost");
      // Component cost is 50, quantity is 2
      expect(response.body.data.totalCost).toBe(100);
    });
  });

  describe("GET /api/bom/product/:id/usage", () => {
    it("should return product usage in BOMs", async () => {
      const { bom, component } = await createTestBOM();

      const response = await request(app).get(
        `/api/bom/product/${component._id}/usage`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0].id.toString()).toBe(bom._id.toString());
    });
  });
});
