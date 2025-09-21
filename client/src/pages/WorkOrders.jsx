import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { workOrdersAPI } from '@/api/workOrders';
import { workCentersAPI } from '@/api/workCenters';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Wrench,
  AlertCircle,
} from 'lucide-react';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workCenterFilter, setWorkCenterFilter] = useState('all');

  useEffect(() => {
    fetchWorkOrders();
    fetchWorkCenters();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await workOrdersAPI.getAll();
      console.log('Work Orders API response:', response);
      setWorkOrders(response || []);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch work orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkCenters = async () => {
    try {
      const response = await workCentersAPI.getAll();
      console.log('Work Centers for work orders:', response);
      setWorkCenters(response || []);
    } catch (error) {
      console.error('Error fetching work centers:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Queued: { variant: 'outline', className: 'status-queued', label: 'Queued' },
      Started: { variant: 'default', className: 'status-in-progress', label: 'Started' },
      Paused: { variant: 'secondary', className: 'status-pending', label: 'Paused' },
      Completed: { variant: 'default', className: 'status-completed', label: 'Completed' },
      Canceled: { variant: 'destructive', className: 'status-cancelled', label: 'Canceled' },
    };

    const config = statusConfig[status] || statusConfig.Queued;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Started':
        return <Play className="h-4 w-4 text-primary" />;
      case 'Paused':
        return <Pause className="h-4 w-4 text-warning" />;
      case 'Canceled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.moId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    const matchesWorkCenter = workCenterFilter === 'all' || wo.workCenter === workCenterFilter;
    
    return matchesSearch && matchesStatus && matchesWorkCenter;
  });

  const handleStartWorkOrder = (workOrderId) => {
    console.log('Starting work order:', workOrderId);
    // Implement start work order logic
  };

  const handlePauseWorkOrder = (workOrderId) => {
    console.log('Pausing work order:', workOrderId);
    // Implement pause work order logic
  };

  const handleCompleteWorkOrder = (workOrderId) => {
    console.log('Completing work order:', workOrderId);
    // Implement complete work order logic
  };

  const handleCancelWorkOrder = (workOrderId) => {
    console.log('Cancelling work order:', workOrderId);
    // Implement cancel work order logic
  };

  const getEfficiency = (planned, actual) => {
    if (!actual || actual === 0) return null;
    const efficiency = (planned / actual) * 100;
    return efficiency.toFixed(1);
  };

  const getEfficiencyColor = (efficiency) => {
    if (!efficiency) return 'text-muted-foreground';
    const eff = parseFloat(efficiency);
    if (eff >= 100) return 'text-success';
    if (eff >= 80) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground mt-1">
            Assign and track work operations for manufacturing orders
          </p>
        </div>
        <Button className="industrial-gradient">
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by work order ID, name, or MO ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Queued">Queued</SelectItem>
                <SelectItem value="Started">Started</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workCenterFilter} onValueChange={setWorkCenterFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by work center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Centers</SelectItem>
                <SelectItem value="Cutting Station A">Cutting Station A</SelectItem>
                <SelectItem value="Welding Station B">Welding Station B</SelectItem>
                <SelectItem value="Assembly Line 1">Assembly Line 1</SelectItem>
                <SelectItem value="QC Station">QC Station</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Work Orders ({filteredWorkOrders.length})
          </CardTitle>
          <CardDescription>
            Track and manage individual work operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order ID</TableHead>
                  <TableHead>MO ID</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Work Center</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time (Planned/Actual)</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.map((wo) => {
                  const efficiency = getEfficiency(wo.plannedMinutes, wo.actualMinutes);
                  return (
                    <TableRow key={wo.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(wo.status)}
                          {wo.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {wo.moId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{wo.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Sequence: {wo.sequence}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{wo.workCenter}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {wo.operator}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(wo.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {wo.plannedMinutes}m / {wo.actualMinutes}m
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {efficiency ? (
                          <span className={getEfficiencyColor(efficiency)}>
                            {efficiency}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Work Order</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {wo.status === 'Queued' && (
                              <DropdownMenuItem 
                                onClick={() => handleStartWorkOrder(wo.id)}
                                className="text-success"
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Start Work Order
                              </DropdownMenuItem>
                            )}
                            {wo.status === 'Started' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handlePauseWorkOrder(wo.id)}
                                  className="text-warning"
                                >
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause Work Order
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleCompleteWorkOrder(wo.id)}
                                  className="text-success"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Complete Work Order
                                </DropdownMenuItem>
                              </>
                            )}
                            {wo.status === 'Paused' && (
                              <DropdownMenuItem 
                                onClick={() => handleStartWorkOrder(wo.id)}
                                className="text-success"
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Resume Work Order
                              </DropdownMenuItem>
                            )}
                            {(wo.status === 'Queued' || wo.status === 'Started' || wo.status === 'Paused') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleCancelWorkOrder(wo.id)}
                                  className="text-destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Work Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredWorkOrders.length === 0 && (
            <div className="text-center py-8">
              <Wrench className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No work orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || workCenterFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Work orders will appear here when manufacturing orders are created.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrders;