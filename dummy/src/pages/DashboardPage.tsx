import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { dashboardApi } from '../services/api';
import { formatNumber, formatDate, getStatusColor } from '../lib/utils';

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardApi.getRecentActivity(10),
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => dashboardApi.getAlerts(),
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const dashboardStats = stats?.data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Manufacturing Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(dashboardStats?.manufacturingOrders.total || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardStats?.manufacturingOrders.inProgress || 0} in progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Work Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(dashboardStats?.workOrders.total || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardStats?.workOrders.completed || 0} completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(dashboardStats?.products.total || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardStats?.products.rawMaterials || 0} raw materials
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats?.efficiency.overall.toFixed(1) || 0}%
                </p>
                <p className="text-sm text-gray-500">Overall efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity?.data?.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'manufacturing_order' ? (
                        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                {alerts?.data?.slice(0, 5).map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon 
                        className={`h-5 w-5 ${
                          alert.severity === 'error' ? 'text-red-500' : 'text-yellow-500'
                        }`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {alert.message}
                      </p>
                    </div>
                    <Badge 
                      variant={alert.severity === 'error' ? 'danger' : 'warning'}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
                {(!alerts?.data || alerts.data.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No alerts at this time
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {dashboardStats?.kpis.completionRate || 0}%
              </p>
              <p className="text-sm text-gray-500">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {dashboardStats?.kpis.onTimeDelivery || 0}%
              </p>
              <p className="text-sm text-gray-500">On-Time Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {dashboardStats?.kpis.resourceUtilization || 0}%
              </p>
              <p className="text-sm text-gray-500">Resource Utilization</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {dashboardStats?.kpis.inventoryTurnover || 0}
              </p>
              <p className="text-sm text-gray-500">Inventory Turnover</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}