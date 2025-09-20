import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import KPICard from '@/components/ui/KPICard';
import {
  ClipboardList,
  Wrench,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Factory,
  Users,
  BarChart3,
} from 'lucide-react';
import { dashboardAPI } from '@/api/dashboard';
import { toast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse, alertsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivity(),
        dashboardAPI.getAlerts()
      ]);
      
      setDashboardData(statsResponse.data);
      setRecentActivity(activityResponse.data || []);
      setAlerts(alertsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (keeping for now as API doesn't provide chart data)
  const productionData = [
    { name: 'Jan', planned: 150, actual: 142 },
    { name: 'Feb', planned: 180, actual: 175 },
    { name: 'Mar', planned: 200, actual: 195 },
    { name: 'Apr', planned: 170, actual: 168 },
    { name: 'May', planned: 220, actual: 210 },
    { name: 'Jun', planned: 190, actual: 188 },
  ];

  const workCenterUtilization = [
    { name: 'Assembly Line 1', utilization: 85, downtime: 15 },
    { name: 'Assembly Line 2', utilization: 92, downtime: 8 },
    { name: 'Welding Station', utilization: 78, downtime: 22 },
    { name: 'Paint Shop', utilization: 88, downtime: 12 },
    { name: 'Quality Control', utilization: 95, downtime: 5 },
  ];

  const orderStatusData = [
    { name: 'Completed', value: dashboardData?.manufacturingOrders?.completed || 0, color: 'hsl(var(--success))' },
    { name: 'In Progress', value: dashboardData?.manufacturingOrders?.inProgress || 0, color: 'hsl(var(--primary))' },
    { name: 'Planned', value: dashboardData?.manufacturingOrders?.planned || 0, color: 'hsl(var(--warning))' },
    { name: 'Cancelled', value: dashboardData?.manufacturingOrders?.canceled || 0, color: 'hsl(var(--destructive))' },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      in_progress: 'secondary',
      planned: 'outline',
      overdue: 'destructive',
    };
    
    const colors = {
      completed: 'status-completed',
      in_progress: 'status-in-progress',
      planned: 'status-pending',
      overdue: 'status-cancelled',
    };

    return (
      <Badge className={colors[status]} variant={variants[status]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manufacturing Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your manufacturing operations
          </p>
        </div>
        <Button className="industrial-gradient">
          <ClipboardList className="mr-2 h-4 w-4" />
          New Manufacturing Order
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Manufacturing Orders"
          value={dashboardData?.manufacturingOrders?.total || 0}
          subtitle={`${dashboardData?.manufacturingOrders?.completed || 0} completed`}
          trend="up"
          trendValue="+12%"
          icon={ClipboardList}
          variant="primary"
        />
        <KPICard
          title="Active Work Orders"
          value={dashboardData?.workOrders?.inProgress || 0}
          subtitle={`${dashboardData?.workOrders?.queued || 0} queued`}
          trend="up"
          trendValue="+5%"
          icon={Wrench}
          variant="success"
        />
        <KPICard
          title="Products in System"
          value={dashboardData?.products?.total || 0}
          subtitle={`${dashboardData?.products?.rawMaterials || 0} raw, ${dashboardData?.products?.finishedGoods || 0} finished`}
          trend="neutral"
          trendValue="0%"
          icon={Package}
          variant="default"
        />
        <KPICard
          title="Critical Alerts"
          value={alerts.length}
          subtitle={`${alerts.filter(a => a.severity === 'error').length} errors, ${alerts.filter(a => a.severity === 'warning').length} warnings`}
          trend="down"
          trendValue="-2"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Throughput */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Production Throughput
            </CardTitle>
            <CardDescription>
              Planned vs Actual production over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  name="Planned"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of all manufacturing orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Work Center Utilization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Work Center Utilization
          </CardTitle>
          <CardDescription>
            Current utilization and downtime across all work centers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workCenterUtilization} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="hsl(var(--primary))" name="Utilization %" />
              <Bar dataKey="downtime" fill="hsl(var(--destructive))" name="Downtime %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Section: Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates on manufacturing and work orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-shrink-0">
                  {activity.type === 'manufacturing_order' ? (
                    <ClipboardList className="h-5 w-5 text-primary" />
                  ) : (
                    <Wrench className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activity.assignee}
                    </span>
                    <span>{activity.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Critical issues requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border border-border">
                <div className="flex-shrink-0">
                  {alert.severity === 'error' ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <Badge variant={alert.severity === 'error' ? 'destructive' : 'outline'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {alert.message}
                  </p>
                  {alert.quantity && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Quantity: {alert.quantity} units
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;