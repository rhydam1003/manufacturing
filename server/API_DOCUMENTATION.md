# Manufacturing Management System API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints Overview

### 🔐 Authentication Endpoints (`/auth`)

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}

Response:
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Refresh Token

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "string"
}

Response:
{
  "success": true,
  "data": {
    "token": "string"
  }
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "string"
}

Response:
{
  "success": true,
  "message": "OTP sent to your email",
  "otp": "123456" // Only in development
}
```

#### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "string",
  "otp": "string",
  "newPassword": "string"
}

Response:
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Verify Email

```http
POST /auth/verify-email
Content-Type: application/json

{
  "email": "string",
  "otp": "string"
}

Response:
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 📦 Products API (`/products`)

#### Create Product

```http
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "sku": "string",
  "unit": "string",
  "type": "Raw" | "Finished",
  "defaultWarehouseId": "string",
  "cost": number,
  "category": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "sku": "string",
    "unit": "string",
    "type": "string",
    "cost": number,
    "category": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### List Products

```http
GET /products?search=string&category=string&sortBy=string&sortOrder=asc|desc&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "_id": "string",
    "name": "string",
    "sku": "string",
    "unit": "string",
    "type": "string",
    "cost": number,
    "category": "string"
  }],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### Get Product by ID

```http
GET /products/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "sku": "string",
    "unit": "string",
    "type": "string",
    "cost": number,
    "category": "string"
  }
}
```

#### Update Product

```http
PUT /products/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "sku": "string",
  "unit": "string",
  "type": "Raw" | "Finished",
  "cost": number,
  "category": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "sku": "string",
    "unit": "string",
    "type": "string",
    "cost": number,
    "category": "string"
  }
}
```

#### Delete Product

```http
DELETE /products/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 🔧 BOM (Bill of Materials) API (`/bom`)

#### Create BOM

```http
POST /bom
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "string",
  "name": "string",
  "version": "string",
  "items": [{
    "componentId": "string",
    "qtyPerUnit": number
  }],
  "operations": [{
    "name": "string",
    "workCenterId": "string",
    "duration": number
  }]
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "productId": "string",
    "name": "string",
    "version": "string",
    "isActive": boolean,
    "items": [{
      "componentId": "string",
      "qtyPerUnit": number
    }],
    "operations": [{
      "name": "string",
      "workCenterId": "string",
      "duration": number
    }]
  }
}
```

#### List BOMs

```http
GET /bom?productId=string&isActive=boolean&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "_id": "string",
    "productId": "string",
    "name": "string",
    "version": "string",
    "isActive": boolean,
    "items": [{
      "componentId": {
        "_id": "string",
        "name": "string",
        "sku": "string"
      },
      "qtyPerUnit": number
    }]
  }],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### Get BOM by ID

```http
GET /bom/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "productId": "string",
    "name": "string",
    "version": "string",
    "isActive": boolean,
    "items": [{
      "componentId": {
        "_id": "string",
        "name": "string",
        "sku": "string"
      },
      "qtyPerUnit": number
    }]
  }
}
```

#### Update BOM

```http
PUT /bom/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "version": "string",
  "items": [{
    "componentId": "string",
    "qtyPerUnit": number
  }]
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "version": "string",
    "items": [{
      "componentId": "string",
      "qtyPerUnit": number
    }]
  }
}
```

#### Delete BOM

```http
DELETE /bom/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "BOM deleted successfully"
}
```

#### Toggle BOM Active Status

```http
PATCH /bom/:id/toggle-active
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "isActive": boolean
  }
}
```

#### Calculate BOM Cost

```http
GET /bom/:id/cost
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalCost": number,
    "components": [{
      "component": {
        "_id": "string",
        "name": "string",
        "sku": "string"
      },
      "quantity": number,
      "unitCost": number,
      "totalCost": number
    }]
  }
}
```

#### Get Product Usage in BOMs

```http
GET /bom/product/:id/usage
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "_id": "string",
    "name": "string",
    "version": "string",
    "product": {
      "_id": "string",
      "name": "string",
      "sku": "string"
    }
  }]
}
```

### 📊 Inventory API (`/inventory`)

#### Get Inventory Levels

```http
GET /inventory?productId=string&warehouseId=string&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "productId": "string",
    "warehouseId": "string",
    "quantity": number,
    "minimumStock": number,
    "reorderPoint": number
  }]
}
```

#### Get Product Inventory

```http
GET /inventory/product/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "productId": "string",
    "warehouseId": "string",
    "quantity": number,
    "minimumStock": number,
    "reorderPoint": number
  }]
}
```

#### Adjust Inventory

```http
POST /inventory/adjust
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "string",
  "warehouseId": "string",
  "quantity": number,
  "type": "increase" | "decrease",
  "reason": "string"
}

Response:
{
  "success": true,
  "data": {
    "inventoryItem": {
      "_id": "string",
      "quantity": number
    },
    "transaction": {
      "_id": "string",
      "type": "string",
      "quantity": number,
      "reason": "string"
    }
  }
}
```

#### Transfer Stock

```http
POST /inventory/transfer
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "string",
  "fromWarehouseId": "string",
  "toWarehouseId": "string",
  "quantity": number,
  "reason": "string"
}

Response:
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "string",
      "type": "transfer",
      "quantity": number,
      "reason": "string"
    }
  }
}
```

#### Get Low Stock Alerts

```http
GET /inventory/alerts
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "productId": "string",
    "warehouseId": "string",
    "quantity": number,
    "minimumStock": number,
    "reorderPoint": number
  }]
}
```

### 🏭 Manufacturing Orders API (`/manufacturing-orders`)

#### Create Manufacturing Order

```http
POST /manufacturing-orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "string",
  "bomId": "string",
  "quantity": number,
  "dueDate": "string",
  "priority": "high" | "medium" | "low"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "productId": "string",
    "bomId": "string",
    "quantity": number,
    "status": "pending",
    "dueDate": "string",
    "priority": "string"
  }
}
```

#### List Manufacturing Orders

```http
GET /manufacturing-orders?status=string&priority=string&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "_id": "string",
    "productId": "string",
    "bomId": "string",
    "quantity": number,
    "status": "string",
    "dueDate": "string",
    "priority": "string"
  }]
}
```

#### Get Manufacturing Order by ID

```http
GET /manufacturing-orders/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "productId": "string",
    "bomId": "string",
    "quantity": number,
    "status": "string",
    "dueDate": "string",
    "priority": "string"
  }
}
```

#### Update Manufacturing Order

```http
PUT /manufacturing-orders/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "quantity": number,
  "dueDate": "string",
  "priority": "high" | "medium" | "low"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "quantity": number,
    "dueDate": "string",
    "priority": "string"
  }
}
```

#### Delete Manufacturing Order

```http
DELETE /manufacturing-orders/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Manufacturing order deleted successfully"
}
```

#### Start Production

```http
POST /manufacturing-orders/:id/start
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "in_progress",
    "startedAt": "string"
  }
}
```

#### Complete Production

```http
POST /manufacturing-orders/:id/complete
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "completed",
    "completedAt": "string"
  }
}
```

#### Cancel Order

```http
POST /manufacturing-orders/:id/cancel
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "cancelled",
    "cancelledAt": "string"
  }
}
```

#### Get Work Orders

```http
GET /manufacturing-orders/:id/work-orders
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "_id": "string",
    "manufacturingOrderId": "string",
    "workCenterId": "string",
    "status": "string"
  }]
}
```

#### Get Material Requirements

```http
GET /manufacturing-orders/:id/materials
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "productId": "string",
    "quantity": number,
    "unit": "string"
  }]
}
```

### 📎 Attachments API (`/attachments`)

#### Upload Attachment

```http
POST /attachments
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- file: File
- resourceType: "string"
- resourceId: "string"
- description: "string"

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "filename": "string",
    "originalName": "string",
    "mimeType": "string",
    "size": number,
    "resourceType": "string",
    "resourceId": "string",
    "description": "string"
  }
}
```

#### Get Attachments by Resource

```http
GET /attachments/resource/:resourceType/:resourceId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [{
    "_id": "string",
    "filename": "string",
    "originalName": "string",
    "mimeType": "string",
    "size": number,
    "description": "string"
  }]
}
```

#### Get Attachment by ID

```http
GET /attachments/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "filename": "string",
    "originalName": "string",
    "mimeType": "string",
    "size": number,
    "resourceType": "string",
    "resourceId": "string",
    "description": "string"
  }
}
```

#### Update Attachment

```http
PUT /attachments/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "description": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "description": "string"
  }
}
```

#### Delete Attachment

```http
DELETE /attachments/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

### 📋 Work Orders API (`/work-orders`)

#### List Work Orders
```http
GET /work-orders?moId=string&status=string&workCenterId=string&operatorId=string&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "moId": "string",
      "sequence": number,
      "name": "string",
      "workCenterId": "string",
      "operatorId": "string",
      "status": "Queued" | "Started" | "Paused" | "Completed" | "Canceled",
      "plannedMinutes": number,
      "actualMinutes": number,
      "startedAt": "string",
      "completedAt": "string",
      "comments": "string"
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### Create Work Order
```http
POST /work-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "moId": "string",
  "sequence": number,
  "name": "string",
  "workCenterId": "string",
  "plannedMinutes": number,
  "operatorId": "string",
  "comments": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "moId": "string",
    "sequence": number,
    "name": "string",
    "workCenterId": "string",
    "status": "Queued",
    "plannedMinutes": number,
    "actualMinutes": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Get Work Order by ID
```http
GET /work-orders/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "moId": "string",
    "sequence": number,
    "name": "string",
    "workCenterId": "string",
    "operatorId": "string",
    "status": "string",
    "plannedMinutes": number,
    "actualMinutes": number,
    "startedAt": "string",
    "completedAt": "string",
    "comments": "string"
  }
}
```

#### Update Work Order
```http
PUT /work-orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "plannedMinutes": number,
  "operatorId": "string",
  "comments": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "plannedMinutes": number,
    "operatorId": "string",
    "comments": "string",
    "updatedAt": "string"
  }
}
```

#### Start Work Order
```http
POST /work-orders/:id/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "operatorId": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "Started",
    "startedAt": "string",
    "operatorId": "string",
    "updatedAt": "string"
  }
}
```

#### Pause Work Order
```http
POST /work-orders/:id/pause
Authorization: Bearer <token>
Content-Type: application/json

{
  "comments": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "Paused",
    "comments": "string",
    "updatedAt": "string"
  }
}
```

#### Complete Work Order
```http
POST /work-orders/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "actualMinutes": number,
  "comments": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "Completed",
    "completedAt": "string",
    "actualMinutes": number,
    "comments": "string",
    "updatedAt": "string"
  }
}
```

#### Cancel Work Order
```http
POST /work-orders/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "string"
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "Canceled",
    "comments": "string",
    "updatedAt": "string"
  }
}
```

#### Delete Work Order
```http
DELETE /work-orders/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Work order deleted successfully"
}
```

#### Get Work Order Stats
```http
GET /work-orders/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "Queued": {
      "count": number,
      "totalPlannedMinutes": number,
      "totalActualMinutes": number
    },
    "Started": {
      "count": number,
      "totalPlannedMinutes": number,
      "totalActualMinutes": number
    },
    "Completed": {
      "count": number,
      "totalPlannedMinutes": number,
      "totalActualMinutes": number
    }
  }
}
```

### 🔧 Work Centers API (`/work-centers`)

#### List Work Centers
```http
GET /work-centers?search=string&location=string&isActive=boolean&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "location": "string",
      "costPerHour": number,
      "isActive": boolean,
      "capacity": number,
      "downtime": number
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### Create Work Center
```http
POST /work-centers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "location": "string",
  "costPerHour": number,
  "capacity": number,
  "downtime": number,
  "isActive": boolean
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "location": "string",
    "costPerHour": number,
    "isActive": boolean,
    "capacity": number,
    "downtime": number,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Get Work Center by ID
```http
GET /work-centers/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "location": "string",
    "costPerHour": number,
    "isActive": boolean,
    "capacity": number,
    "downtime": number
  }
}
```

#### Update Work Center
```http
PUT /work-centers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "location": "string",
  "costPerHour": number,
  "capacity": number,
  "downtime": number,
  "isActive": boolean
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "location": "string",
    "costPerHour": number,
    "isActive": boolean,
    "capacity": number,
    "downtime": number,
    "updatedAt": "string"
  }
}
```

#### Delete Work Center
```http
DELETE /work-centers/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Work center deleted successfully"
}
```

#### Get Work Center Utilization
```http
GET /work-centers/:id/utilization?startDate=string&endDate=string
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "workCenter": {
      "id": "string",
      "name": "string",
      "location": "string",
      "costPerHour": number,
      "capacity": number,
      "downtime": number
    },
    "utilization": {
      "totalPlannedMinutes": number,
      "totalActualMinutes": number,
      "efficiency": number,
      "completedOrders": number,
      "inProgressOrders": number,
      "totalOrders": number
    }
  }
}
```

#### Get All Work Centers Utilization
```http
GET /work-centers/utilization?startDate=string&endDate=string
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "workCenter": {
        "id": "string",
        "name": "string",
        "location": "string",
        "costPerHour": number,
        "capacity": number,
        "downtime": number
      },
      "utilization": {
        "totalPlannedMinutes": number,
        "totalActualMinutes": number,
        "efficiency": number,
        "completedOrders": number,
        "inProgressOrders": number,
        "totalOrders": number
      }
    }
  ]
}
```

#### Update Work Center Downtime
```http
PUT /work-centers/:id/downtime
Authorization: Bearer <token>
Content-Type: application/json

{
  "downtime": number
}

Response:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "downtime": number,
    "updatedAt": "string"
  }
}
```

#### Get Work Center Stats
```http
GET /work-centers/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "active": {
      "count": number,
      "totalCapacity": number,
      "totalDowntime": number,
      "avgCostPerHour": number
    },
    "inactive": {
      "count": number,
      "totalCapacity": number,
      "totalDowntime": number,
      "avgCostPerHour": number
    }
  }
}
```

### 📈 Dashboard API (`/dashboard`)

#### Get Dashboard Stats
```http
GET /dashboard/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "manufacturingOrders": {
      "completed": number,
      "inProgress": number,
      "planned": number,
      "canceled": number,
      "total": number
    },
    "workOrders": {
      "completed": number,
      "inProgress": number,
      "queued": number,
      "total": number
    },
    "products": {
      "rawMaterials": number,
      "finishedGoods": number,
      "total": number
    },
    "inventory": {
      "totalItems": number,
      "totalQuantity": number,
      "totalReserved": number,
      "availableQuantity": number
    },
    "workCenters": {
      "active": number,
      "total": number
    },
    "efficiency": {
      "overall": number,
      "totalPlannedMinutes": number,
      "totalActualMinutes": number
    },
    "kpis": {
      "completionRate": number,
      "onTimeDelivery": number,
      "resourceUtilization": number,
      "inventoryTurnover": number
    }
  }
}
```

#### Get Recent Activity
```http
GET /dashboard/recent-activity?limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "type": "manufacturing_order" | "work_order",
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "assignee": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### Get Alerts
```http
GET /dashboard/alerts
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "type": "low_stock" | "overdue_order" | "high_downtime",
      "severity": "warning" | "error",
      "title": "string",
      "message": "string",
      "productId": "string",
      "quantity": number
    }
  ]
}
```

### 📊 Reports API (`/reports`)

_Note: Reports endpoints are currently placeholder implementations_

### 🔧 Work Centers API (`/work-centers`)

_Note: Work Centers endpoints are currently placeholder implementations_

### 📋 Work Orders API (`/work-orders`)

_Note: Work Orders endpoints are currently placeholder implementations_

## Error Responses

All endpoints may return these error responses:

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized - No token provided"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "value": "string",
      "msg": "string",
      "path": "string",
      "location": "body"
    }
  ]
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": "Resource already exists or conflict occurred"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address. The following headers are included in responses:

- `X-RateLimit-Limit`: Total requests allowed in the time window
- `X-RateLimit-Remaining`: Remaining requests in the current time window
- `X-RateLimit-Reset`: Time (in UTC) when the rate limit resets

## Permissions

The API uses Role-Based Access Control (RBAC) with the following permissions:

### Product Permissions

- `VIEW_PRODUCTS`: View product information
- `MANAGE_PRODUCTS`: Create, update, delete products

### BOM Permissions

- `VIEW_BOMS`: View BOM information
- `MANAGE_BOMS`: Create, update, delete BOMs
- `ACTIVATE_BOMS`: Activate/deactivate BOMs

### Inventory Permissions

- `VIEW_INVENTORY`: View inventory levels
- `MANAGE_INVENTORY`: Adjust inventory levels
- `TRANSFER_STOCK`: Transfer stock between warehouses

### Manufacturing Permissions

- `VIEW_MANUFACTURING`: View manufacturing orders
- `MANAGE_MANUFACTURING`: Create, update, delete manufacturing orders

### Attachment Permissions

- `VIEW_ATTACHMENTS`: View attachments
- `MANAGE_ATTACHMENTS`: Upload, update, delete attachments

## Data Models

### Product Model

```typescript
interface Product {
  _id: string;
  sku: string;
  name: string;
  unit: string;
  type: "Raw" | "Finished";
  defaultWarehouseId: string;
  cost?: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BOM Model

```typescript
interface BOM {
  _id: string;
  productId: string;
  name: string;
  version: string;
  isActive: boolean;
  items: BOMItem[];
  operations: BOMOperation[];
  createdAt: Date;
  updatedAt: Date;
}

interface BOMItem {
  componentId: string;
  qtyPerUnit: number;
}

interface BOMOperation {
  name: string;
  workCenterId: string;
  duration: number;
}
```

### Manufacturing Order Model

```typescript
interface ManufacturingOrder {
  _id: string;
  productId: string;
  bomId: string;
  quantity: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  dueDate: Date;
  priority: "high" | "medium" | "low";
  createdAt: Date;
  updatedAt: Date;
}
```

## Testing

The API includes comprehensive test coverage with Jest. Run tests using:

```bash
npm test
```

Test coverage includes:

- ✅ Authentication endpoints
- ✅ Product CRUD operations
- ✅ BOM CRUD operations
- ✅ Inventory management
- ✅ Manufacturing orders
- ✅ File attachments
- ✅ Error handling
- ✅ Validation
- ✅ Authorization

## Development

### Prerequisites

- Node.js 18+
- MongoDB
- Redis (optional, for caching)

### Setup

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start MongoDB
4. Run migrations: `npm run migrate`
5. Start development server: `npm run dev`

### Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/manufacturing
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=5242880
```
