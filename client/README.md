# Manufacturing Management System

## Overview

A comprehensive, production-ready Manufacturing Management System built with React, featuring end-to-end production process management from order to output.

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time KPIs, charts, and alerts
- **Manufacturing Orders** - Create, track, and manage production orders
- **Work Orders** - Assign and track individual work operations
- **Bill of Materials (BOM)** - Define material requirements and operations
- **Inventory Management** - Real-time stock tracking and alerts
- **Work Centers** - Manage machine capacity and utilization
- **Products** - Manage raw materials and finished goods

### Key Capabilities
- **Authentication** - Secure login/register with JWT tokens
- **Role-Based Access** - Manufacturing managers, operators, inventory managers, admins
- **Real-time Tracking** - Live updates on production status and inventory
- **Advanced Analytics** - Production throughput, efficiency, and utilization charts
- **Alert System** - Low stock, overdue orders, and work center downtime alerts
- **Responsive Design** - Works seamlessly on desktop and tablet devices

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript/JavaScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query, Context API
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with refresh token flow

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd manufacturing-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### API Base URL
Update the API base URL in `src/api/client.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1'; // Update this
```

### Environment Setup
The system works with the provided API documentation. Ensure your backend API is running and accessible.

## 🏗 Architecture

```
src/
├── api/                 # HTTP client and API services
│   ├── client.js       # Axios configuration with interceptors
│   ├── auth.js         # Authentication API calls
│   └── manufacturingOrders.js
├── components/         # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── ui/             # shadcn/ui components
│   └── ProtectedRoute.jsx
├── contexts/           # React Context providers
│   └── AuthContext.jsx
├── hooks/              # Custom React hooks
├── pages/              # Application pages
│   ├── auth/           # Login, Register pages
│   ├── Dashboard.jsx
│   ├── ManufacturingOrders.jsx
│   └── WorkOrders.jsx
└── utils/              # Utility functions
```

## 🎨 Design System

The application uses a comprehensive design system with:
- **Industrial Theme** - Professional blues and grays
- **Semantic Color Tokens** - Consistent color usage
- **Status Colors** - Clear visual status indicators
- **Responsive Grid** - Mobile-first design approach
- **Custom Components** - KPI cards, status badges, tables

## 🔐 Authentication

- **JWT Tokens** - Secure authentication with automatic refresh
- **Role-Based Access** - Different permissions for user roles
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Session Management** - Persistent login state

## 📊 Features in Detail

### Dashboard
- Real-time KPIs (orders, work orders, products, alerts)
- Production throughput charts
- Work center utilization analytics
- Recent activity feed
- System alerts and notifications

### Manufacturing Orders
- Create orders with BOM and scheduling
- Track production progress
- Start, pause, complete, cancel operations
- Material requirements calculation
- Priority and status management

### Work Orders
- Individual operation tracking
- Operator assignment and time logging
- Status management (Queued, Started, Paused, Completed)
- Efficiency calculations
- Work center utilization

## 🔄 API Integration

The system is designed to work with the provided REST API:
- **Base URL**: Configurable in client.js
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Automatic retry and user notifications
- **Loading States**: Proper loading and error states

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Quality Control module
- [ ] Maintenance Management
- [ ] Advanced Reporting (PDF/Excel export)
- [ ] Mobile App
- [ ] Real-time Notifications
- [ ] Advanced Analytics Dashboard
- [ ] Integration with ERP systems

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

Built with ❤️ for modern manufacturing operations.