import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { manufacturingOrdersAPI } from '@/api/manufacturingOrders';
import { productsAPI } from '@/api/products';
import { bomAPI } from '@/api/bom';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  Clock,
  AlertCircle,
} from 'lucide-react';

const ManufacturingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    bomId: '',
    quantity: '',
    dueDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchBOMs();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await manufacturingOrdersAPI.getAll();
      console.log('Manufacturing Orders API response:', response);
      setOrders(response || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch manufacturing orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      console.log('Products for manufacturing orders:', response);
      setProducts(response || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBOMs = async () => {
    try {
      const response = await bomAPI.getAll();
      console.log('BOMs for manufacturing orders:', response);
      setBOMs(response || []);
    } catch (error) {
      console.error('Error fetching BOMs:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'outline', className: 'status-pending', label: 'Pending' },
      in_progress: { variant: 'default', className: 'status-in-progress', label: 'In Progress' },
      completed: { variant: 'default', className: 'status-completed', label: 'Completed' },
      cancelled: { variant: 'destructive', className: 'status-cancelled', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: 'outline', className: 'text-muted-foreground' },
      medium: { variant: 'secondary', className: 'text-warning' },
      high: { variant: 'destructive', className: '' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-primary" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStartOrder = (orderId) => {
    console.log('Starting order:', orderId);
    // Implement start order logic
  };

  const handleCompleteOrder = (orderId) => {
    console.log('Completing order:', orderId);
    // Implement complete order logic
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancelling order:', orderId);
    // Implement cancel order logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manufacturing Orders</h1>
          <p className="text-muted-foreground mt-1">
            Create, track, and manage production orders
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="industrial-gradient">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Manufacturing Order</DialogTitle>
              <DialogDescription>
                Create a new production order with BOM and scheduling details.
              </DialogDescription>
            </DialogHeader>
            {/* Create form would go here */}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="industrial-gradient">
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or product name..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manufacturing Orders ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Track and manage all production orders in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {order.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          BOM {order.bomVersion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.quantity} units</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.progress}%
                        </span>
                      </div>
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
                          <DropdownMenuItem>Edit Order</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status === 'pending' && (
                            <DropdownMenuItem 
                              onClick={() => handleStartOrder(order.id)}
                              className="text-success"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Start Production
                            </DropdownMenuItem>
                          )}
                          {order.status === 'in_progress' && (
                            <DropdownMenuItem 
                              onClick={() => handleCompleteOrder(order.id)}
                              className="text-success"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Order
                            </DropdownMenuItem>
                          )}
                          {(order.status === 'pending' || order.status === 'in_progress') && (
                            <DropdownMenuItem 
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first manufacturing order to get started.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturingOrders;