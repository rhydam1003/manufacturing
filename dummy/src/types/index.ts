// User and Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  sku: string;
  unit: string;
  type: 'Raw' | 'Finished';
  defaultWarehouseId: string;
  cost?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  sku: string;
  unit: string;
  type: 'Raw' | 'Finished';
  defaultWarehouseId: string;
  cost?: number;
  category?: string;
}

// BOM types
export interface BOMItem {
  componentId: string | Product;
  qtyPerUnit: number;
}

export interface BOMOperation {
  name: string;
  workCenterId: string;
  duration: number;
}

export interface BOM {
  _id: string;
  productId: string | Product;
  name: string;
  version: string;
  isActive: boolean;
  items: BOMItem[];
  operations: BOMOperation[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBOMData {
  productId: string;
  name: string;
  version: string;
  items: BOMItem[];
  operations: BOMOperation[];
}

// Manufacturing Order types
export interface ManufacturingOrder {
  _id: string;
  productId: string | Product;
  bomId: string | BOM;
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface CreateManufacturingOrderData {
  productId: string;
  bomId: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

// Work Order types
export interface WorkOrder {
  _id: string;
  moId: string;
  sequence: number;
  name: string;
  workCenterId: string;
  operatorId?: string;
  status: 'Queued' | 'Started' | 'Paused' | 'Completed' | 'Canceled';
  plannedMinutes: number;
  actualMinutes: number;
  startedAt?: string;
  completedAt?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderData {
  moId: string;
  sequence: number;
  name: string;
  workCenterId: string;
  plannedMinutes: number;
  operatorId?: string;
  comments?: string;
}

// Work Center types
export interface WorkCenter {
  _id: string;
  name: string;
  location: string;
  costPerHour: number;
  isActive: boolean;
  capacity: number;
  downtime: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkCenterData {
  name: string;
  location: string;
  costPerHour: number;
  capacity: number;
  downtime?: number;
  isActive?: boolean;
}

// Inventory types
export interface InventoryItem {
  productId: string;
  warehouseId: string;
  quantity: number;
  minimumStock: number;
  reorderPoint: number;
}

export interface StockAdjustment {
  productId: string;
  warehouseId: string;
  quantity: number;
  type: 'increase' | 'decrease';
  reason: string;
}

export interface StockTransfer {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason: string;
}

// Dashboard types
export interface DashboardStats {
  manufacturingOrders: {
    completed: number;
    inProgress: number;
    planned: number;
    canceled: number;
    total: number;
  };
  workOrders: {
    completed: number;
    inProgress: number;
    queued: number;
    total: number;
  };
  products: {
    rawMaterials: number;
    finishedGoods: number;
    total: number;
  };
  inventory: {
    totalItems: number;
    totalQuantity: number;
    totalReserved: number;
    availableQuantity: number;
  };
  workCenters: {
    active: number;
    total: number;
  };
  efficiency: {
    overall: number;
    totalPlannedMinutes: number;
    totalActualMinutes: number;
  };
  kpis: {
    completionRate: number;
    onTimeDelivery: number;
    resourceUtilization: number;
    inventoryTurnover: number;
  };
}

export interface RecentActivity {
  type: 'manufacturing_order' | 'work_order';
  id: string;
  title: string;
  description: string;
  status: string;
  assignee?: string;
  updatedAt: string;
}

export interface Alert {
  type: 'low_stock' | 'overdue_order' | 'high_downtime';
  severity: 'warning' | 'error';
  title: string;
  message: string;
  productId?: string;
  quantity?: number;
}

// Common types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams extends PaginationParams {
  [key: string]: any;
}