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

### Auth Endpoints

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

### Products API

#### Create Product

```http
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "code": "string",
  "description": "string",
  "unitOfMeasure": "string",
  "cost": "number",
  "category": "string",
  "tags": ["string"]
}

Response:
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    ...
  }
}
```

#### List Products

```http
GET /products?search=string&sortBy=string&sortOrder=asc|desc&page=number&limit=number
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "data": [{
      "id": "string",
      "name": "string",
      ...
    }],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

### BOM (Bill of Materials) API

#### Create BOM

```http
POST /bom
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "string",
  "name": "string",
  "version": "string",
  "components": [{
    "productId": "string",
    "quantity": number,
    "unitOfMeasure": "string"
  }]
}

Response:
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    ...
  }
}
```

### Inventory API

#### Get Stock Levels

```http
GET /inventory/stock?productId=string&warehouseId=string
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "data": [{
      "productId": "string",
      "warehouseId": "string",
      "quantity": number,
      ...
    }],
    "total": number
  }
}
```

#### Adjust Stock

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
      "id": "string",
      "quantity": number,
      ...
    },
    "transaction": {
      "id": "string",
      "type": "string",
      ...
    }
  }
}
```

### Manufacturing Orders API

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
    "id": "string",
    "status": "string",
    ...
  }
}
```

### Reports API

#### Get Production KPIs

```http
GET /reports/kpi?startDate=string&endDate=string
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "orders": {
      "total": number,
      "completed": number,
      "inProgress": number,
      "delayed": number
    },
    "workCenterUtilization": [{
      "workCenter": "string",
      "utilization": number
    }]
  }
}
```

### Error Responses

All endpoints may return these error responses:

```http
401 Unauthorized
{
  "success": false,
  "error": "Unauthorized - No token provided"
}

403 Forbidden
{
  "success": false,
  "error": "Insufficient permissions"
}

400 Bad Request
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}

500 Internal Server Error
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
