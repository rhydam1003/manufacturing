import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Factory,
  Package,
  Clock,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('production');
  const [timeRange, setTimeRange] = useState('30days');

  // Mock data for reports
  const productionData = [
    { name: 'Jan', planned: 150, actual: 142, efficiency: 94.7 },
    { name: 'Feb', planned: 180, actual: 175, efficiency: 97.2 },
    { name: 'Mar', planned: 200, actual: 195, efficiency: 97.5 },
    { name: 'Apr', planned: 170, actual: 168, efficiency: 98.8 },
    { name: 'May', planned: 220, actual: 210, efficiency: 95.5 },
    { name: 'Jun', planned: 190, actual: 188, efficiency: 98.9 },
  ];

  const workCenterData = [
    { name: 'Assembly Line 1', utilization: 85, downtime: 15, efficiency: 85 },
    { name: 'Assembly Line 2', utilization: 92, downtime: 8, efficiency: 92 },
    { name: 'Welding Station', utilization: 78, downtime: 22, efficiency: 78 },
    { name: 'Paint Shop', utilization: 88, downtime: 12, efficiency: 88 },
    { name: 'Quality Control', utilization: 95, downtime: 5, efficiency: 95 },
  ];

  const orderStatusData = [
    { name: 'Completed', value: 145, color: '#10b981' },
    { name: 'In Progress', value: 32, color: '#3b82f6' },
    { name: 'Planned', value: 18, color: '#f59e0b' },
    { name: 'Cancelled', value: 8, color: '#ef4444' },
  ];

  const costAnalysisData = [
    { name: 'Materials', value: 45, color: '#8b5cf6' },
    { name: 'Labor', value: 30, color: '#06b6d4' },
    { name: 'Overhead', value: 15, color: '#f59e0b' },
    { name: 'Utilities', value: 10, color: '#10b981' },
  ];

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting report:', reportType, timeRange);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate insights and reports for your manufacturing operations
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production Report</SelectItem>
              <SelectItem value="efficiency">Efficiency Report</SelectItem>
              <SelectItem value="cost">Cost Analysis</SelectItem>
              <SelectItem value="inventory">Inventory Report</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,278 units</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Work Centers</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <p className="text-xs text-muted-foreground">
              80% utilization rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Production Trend
            </CardTitle>
            <CardDescription>
              Planned vs actual production over time
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
                  stroke="#64748b"
                  strokeDasharray="5 5"
                  name="Planned"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Work Center Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Work Center Utilization
            </CardTitle>
            <CardDescription>
              Current utilization across all work centers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workCenterData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
                <Bar dataKey="downtime" fill="#ef4444" name="Downtime %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
            <CardDescription>
              Breakdown of manufacturing costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costAnalysisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costAnalysisData.map((entry, index) => (
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

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Actions</CardTitle>
          <CardDescription>
            Generate and export detailed reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Production Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span>Efficiency Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Cost Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
