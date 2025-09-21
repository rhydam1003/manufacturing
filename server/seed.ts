import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import models
import { User } from "./src/models/user.model";
import { Role } from "./src/models/role.model";
import { Product } from "./src/models/product.model";
import { Warehouse } from "./src/models/warehouse.model";
import { WorkCenter } from "./src/models/work-center.model";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "");

  // Clear collections
  await Promise.all([
    User.deleteMany({}),
    Role.deleteMany({}),
    Product.deleteMany({}),
    Warehouse.deleteMany({}),
    WorkCenter.deleteMany({}),
  ]);

  // Seed roles
  const roles = await Role.insertMany([
    { name: "Admin", description: "Administrator", permissions: ["*"] },
    { name: "Manager", description: "Manager", permissions: ["view","edit"] },
    { name: "Operator", description: "Operator", permissions: ["view"] },
  ]);

  // Seed users
  const users = await User.insertMany([
    {
      email: "admin@example.com",
      passwordHash: "admin123",
      name: "Admin User",
      role: roles[0]._id,
      roleId: roles[0]._id,
      isActive: true,
    },
    {
      email: "manager@example.com",
      passwordHash: "manager123",
      name: "Manager User",
      role: roles[1]._id,
      roleId: roles[1]._id,
      isActive: true,
    },
  ]);

  // Seed warehouses
  const warehouses = await Warehouse.insertMany([
    { name: "Main Warehouse", code: "MAIN", location: "HQ" },
    { name: "Secondary Warehouse", code: "SEC", location: "Branch" },
  ]);

  // Seed products
  const products = await Product.insertMany([
    {
      sku: "RAW-001",
      name: "Raw Material 1",
      unit: "kg",
      type: "Raw",
      defaultWarehouseId: warehouses[0]._id,
      cost: 10,
      category: "Raw Material",
    },
    {
      sku: "FIN-001",
      name: "Finished Product 1",
      unit: "pcs",
      type: "Finished",
      defaultWarehouseId: warehouses[1]._id,
      cost: 100,
      category: "Finished Product",
    },
  ]);

  // Seed work centers
  await WorkCenter.insertMany([
    {
      name: "Assembly Line 1",
      location: "Plant 1",
      costPerHour: 50,
      isActive: true,
      capacity: 100,
      downtime: 0,
    },
    {
      name: "Packaging",
      location: "Plant 1",
      costPerHour: 30,
      isActive: true,
      capacity: 200,
      downtime: 0,
    },
  ]);

  console.log("Seed data inserted successfully.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
