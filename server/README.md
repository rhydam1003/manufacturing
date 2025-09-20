# Manufacturing Management System Backend

A production-grade backend service for manufacturing operations management, built with Node.js, Express, and TypeScript.

## Features

- 🔐 User Authentication & Authorization with JWT
- 📦 Product Management
- 📋 Bill of Materials (BOM) Management
- 📊 Inventory Management
- 🏭 Manufacturing Order Management
- 🔧 Work Order Management
- 📈 Real-time Production Monitoring
- 📊 Reporting & Analytics
- 📎 File Attachments
- 🔄 Background Jobs
- 📝 Audit Logging

## Tech Stack

- Node.js & TypeScript
- Express.js
- MongoDB with Mongoose
- Redis for Caching
- Bull for Job Queue
- AWS S3 for File Storage
- JWT for Authentication
- Express-validator for Validation
- Winston for Logging
- Jest for Testing

## Prerequisites

- Node.js >= 18
- MongoDB
- Redis
- AWS Account (for S3)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd manufacturing-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Running with Docker

1. Build and run with Docker Compose:

   ```bash
   docker-compose up -d
   ```

2. View logs:
   ```bash
   docker-compose logs -f app
   ```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

### Main Endpoints

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Products**: `/api/products`
- **BOM**: `/api/bom`
- **Inventory**: `/api/inventory`
- **Manufacturing Orders**: `/api/manufacturing-orders`
- **Work Orders**: `/api/work-orders`
- **Reports**: `/api/reports`

## Testing

Run tests:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For support, email [your-email@example.com](mailto:your-email@example.com)
