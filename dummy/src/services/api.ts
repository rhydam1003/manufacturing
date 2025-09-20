import { apiRequest, PaginatedResponse } from '../lib/api';
import {
  Product,
  CreateProductData,
  BOM,
  CreateBOMData,
  ManufacturingOrder,
  CreateManufacturingOrderData,
  WorkOrder,
  CreateWorkOrderData,
  WorkCenter,
  CreateWorkCenterData,
  InventoryItem,
  StockAdjustment,
  StockTransfer,
  DashboardStats,
  RecentActivity,
  Alert,
  FilterParams,
} from '../types';

// Products API
export const productsApi = {
  list: (params?: FilterParams): Promise<PaginatedResponse<Product>> =>
    apiRequest.get('/products', params),
    
  getById: (id: string): Promise<{ success: boolean; data: Product }> =>
    apiRequest.get(`/products/${id}`),
    
  create: (data: CreateProductData): Promise<{ success: boolean; data: Product }> =>
    apiRequest.post('/products', data),
    
  update: (id: string, data: Partial<CreateProductData>): Promise<{ success: boolean; data: Product }> =>
    apiRequest.put(`/products/${id}`, data),
    
  delete: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/products/${id}`),
};

// BOM API
export const bomApi = {
  list: (params?: FilterParams): Promise<PaginatedResponse<BOM>> =>
    apiRequest.get('/bom', params),
    
  getById: (id: string): Promise<{ success: boolean; data: BOM }> =>
    apiRequest.get(`/bom/${id}`),
    
  create: (data: CreateBOMData): Promise<{ success: boolean; data: BOM }> =>
    apiRequest.post('/bom', data),
    
  update: (id: string, data: Partial<CreateBOMData>): Promise<{ success: boolean; data: BOM }> =>
    apiRequest.put(`/bom/${id}`, data),
    
  delete: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/bom/${id}`),
    
  toggleActive: (id: string): Promise<{ success: boolean; data: { _id: string; isActive: boolean } }> =>
    apiRequest.patch(`/bom/${id}/toggle-active`),
    
  calculateCost: (id: string): Promise<{ success: boolean; data: any }> =>
    apiRequest.get(`/bom/${id}/cost`),
    
  getUsage: (productId: string): Promise<{ success: boolean; data: any[] }> =>
    apiRequest.get(`/bom/product/${productId}/usage`),
};

// Manufacturing Orders API
export const manufacturingOrdersApi = {
  list: (params?: FilterParams): Promise<PaginatedResponse<ManufacturingOrder>> =>
    apiRequest.get('/manufacturing-orders', params),
    
  getById: (id: string): Promise<{ success: boolean; data: ManufacturingOrder }> =>
    apiRequest.get(`/manufacturing-orders/${id}`),
    
  create: (data: CreateManufacturingOrderData): Promise<{ success: boolean; data: ManufacturingOrder }> =>
    apiRequest.post('/manufacturing-orders', data),
    
  update: (id: string, data: Partial<CreateManufacturingOrderData>): Promise<{ success: boolean; data: ManufacturingOrder }> =>
    apiRequest.put(`/manufacturing-orders/${id}`, data),
    
  delete: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/manufacturing-orders/${id}`),
    
  start: (id: string): Promise<{ success: boolean; data: ManufacturingOrder }> =>
    apiRequest.post(`/manufacturing-orders/${id}/start`),
    
  complete: (id: string): Promise<{ success: boolean; data: ManufacturingOrder }> =>
    apiRequest.post(`/manufacturing-orders/${id}/complete`),
    
  cancel: (id: string): Promise<{ success: boolean; data: ManufacturingOrder }> =>
    apiRequest.post(`/manufacturing-orders/${id}/cancel`),
    
  getWorkOrders: (id: string): Promise<{ success: boolean; data: WorkOrder[] }> =>
    apiRequest.get(`/manufacturing-orders/${id}/work-orders`),
    
  getMaterialRequirements: (id: string): Promise<{ success: boolean; data: any[] }> =>
    apiRequest.get(`/manufacturing-orders/${id}/materials`),
};

// Work Orders API
export const workOrdersApi = {
  list: (params?: FilterParams): Promise<PaginatedResponse<WorkOrder>> =>
    apiRequest.get('/work-orders', params),
    
  getById: (id: string): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.get(`/work-orders/${id}`),
    
  create: (data: CreateWorkOrderData): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.post('/work-orders', data),
    
  update: (id: string, data: Partial<CreateWorkOrderData>): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.put(`/work-orders/${id}`, data),
    
  delete: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/work-orders/${id}`),
    
  start: (id: string, operatorId: string): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.post(`/work-orders/${id}/start`, { operatorId }),
    
  pause: (id: string, comments?: string): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.post(`/work-orders/${id}/pause`, { comments }),
    
  complete: (id: string, actualMinutes: number, comments?: string): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.post(`/work-orders/${id}/complete`, { actualMinutes, comments }),
    
  cancel: (id: string, reason?: string): Promise<{ success: boolean; data: WorkOrder }> =>
    apiRequest.post(`/work-orders/${id}/cancel`, { reason }),
    
  getStats: (): Promise<{ success: boolean; data: any }> =>
    apiRequest.get('/work-orders/stats'),
};

// Work Centers API
export const workCentersApi = {
  list: (params?: FilterParams): Promise<PaginatedResponse<WorkCenter>> =>
    apiRequest.get('/work-centers', params),
    
  getById: (id: string): Promise<{ success: boolean; data: WorkCenter }> =>
    apiRequest.get(`/work-centers/${id}`),
    
  create: (data: CreateWorkCenterData): Promise<{ success: boolean; data: WorkCenter }> =>
    apiRequest.post('/work-centers', data),
    
  update: (id: string, data: Partial<CreateWorkCenterData>): Promise<{ success: boolean; data: WorkCenter }> =>
    apiRequest.put(`/work-centers/${id}`, data),
    
  delete: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/work-centers/${id}`),
    
  getUtilization: (id: string, startDate?: string, endDate?: string): Promise<{ success: boolean; data: any }> =>
    apiRequest.get(`/work-centers/${id}/utilization`, { startDate, endDate }),
    
  getAllUtilization: (startDate?: string, endDate?: string): Promise<{ success: boolean; data: any[] }> =>
    apiRequest.get('/work-centers/utilization', { startDate, endDate }),
    
  updateDowntime: (id: string, downtime: number): Promise<{ success: boolean; data: WorkCenter }> =>
    apiRequest.put(`/work-centers/${id}/downtime`, { downtime }),
    
  getStats: (): Promise<{ success: boolean; data: any }> =>
    apiRequest.get('/work-centers/stats'),
};

// Inventory API
export const inventoryApi = {
  list: (params?: FilterParams): Promise<PaginatedResponse<InventoryItem>> =>
    apiRequest.get('/inventory', params),
    
  getByProduct: (productId: string): Promise<{ success: boolean; data: InventoryItem[] }> =>
    apiRequest.get(`/inventory/product/${productId}`),
    
  adjust: (data: StockAdjustment): Promise<{ success: boolean; data: any }> =>
    apiRequest.post('/inventory/adjust', data),
    
  transfer: (data: StockTransfer): Promise<{ success: boolean; data: any }> =>
    apiRequest.post('/inventory/transfer', data),
    
  getAlerts: (): Promise<{ success: boolean; data: InventoryItem[] }> =>
    apiRequest.get('/inventory/alerts'),
};

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<{ success: boolean; data: DashboardStats }> =>
    apiRequest.get('/dashboard/stats'),
    
  getRecentActivity: (limit?: number): Promise<{ success: boolean; data: RecentActivity[] }> =>
    apiRequest.get('/dashboard/recent-activity', { limit }),
    
  getAlerts: (): Promise<{ success: boolean; data: Alert[] }> =>
    apiRequest.get('/dashboard/alerts'),
};