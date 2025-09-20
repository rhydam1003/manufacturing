import { Request } from "express";
import { Document, Types } from "mongoose";

export interface FilterQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  roleId: Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUser extends Request {
  user?: UserDocument;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StockAdjustment {
  productId: string;
  warehouseId: string;
  quantity: number;
  type: "increase" | "decrease";
  reason: string;
}

export interface StockTransfer {
  productId: string;
  sourceWarehouseId: string;
  targetWarehouseId: string;
  quantity: number;
  reason: string;
}

export interface ReportFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
  workCenterId?: string;
  warehouseId?: string;
}

export interface ProductionKPIs {
  orders: {
    total: number;
    completed: number;
    inProgress: number;
    delayed: number;
    completionRate: number;
    delayRate: number;
  };
  workCenterUtilization: {
    workCenter: string;
    utilization: number;
  }[];
}

export interface InventoryReport {
  summary: {
    lowStock: number;
    outOfStock: number;
    totalValue: number;
  };
  topMovingItems: {
    productId: string;
    quantity: number;
    movements: number;
  }[];
}

export interface UtilizationReport {
  utilization: {
    workCenter: string;
    totalOrders: number;
    totalDuration: number;
    avgDuration: number;
    efficiency: number;
  }[];
  period: {
    start: Date;
    end: Date;
  };
}

export interface ExportedReport {
  reportId: string;
  data: {
    kpis: ProductionKPIs;
    inventory: InventoryReport;
    utilization: UtilizationReport;
  };
  generatedAt: Date;
}
