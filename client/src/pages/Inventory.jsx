import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  MoreHorizontal,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  AlertTriangle,
  Warehouse,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { inventoryAPI } from '@/api/inventory';
import { productsAPI } from '@/api/products';
import { toast } from '@/hooks/use-toast';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);

  // Form state
  const [adjustFormData, setAdjustFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
    type: 'increase',
    reason: '',
  });

  const [transferFormData, setTransferFormData] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getLevels();
      setInventory(response.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAdjustInventory = async () => {
    try {
      await inventoryAPI.adjust(adjustFormData);
      toast({
        title: 'Success',
        description: 'Inventory adjusted successfully',
      });
      setIsAdjustDialogOpen(false);
      resetAdjustForm();
      fetchInventory();
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to adjust inventory',
        variant: 'destructive',
      });
    }
  };

  const handleTransferStock = async () => {
    try {
      await inventoryAPI.transfer(transferFormData);
      toast({
        title: 'Success',
        description: 'Stock transferred successfully',
      });
      setIsTransferDialogOpen(false);
      resetTransferForm();
      fetchInventory();
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to transfer stock',
        variant: 'destructive',
      });
    }
  };

  const resetAdjustForm = () => {
    setAdjustFormData({
      productId: '',
      warehouseId: '',
      quantity: '',
      type: 'increase',
      reason: '',
    });
  };

  const resetTransferForm = () => {
    setTransferFormData({
      productId: '',
      fromWarehouseId: '',
      toWarehouseId: '',
      quantity: '',
      reason: '',
    });
  };

  const openAdjustDialog = (item) => {
    setAdjustingItem(item);
    setAdjustFormData({
      productId: item.productId,
      warehouseId: item.warehouseId,
      quantity: '',
      type: 'increase',
      reason: '',
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getStockStatus = (quantity, minimumStock, reorderPoint) => {
    if (quantity <= minimumStock) {
      return { status: 'critical', color: 'text-destructive', icon: AlertTriangle };
    } else if (quantity <= reorderPoint) {
      return { status: 'low', color: 'text-warning', icon: AlertTriangle };
    } else {
      return { status: 'good', color: 'text-success', icon: Package };
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = getProductName(item.productId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = productFilter === 'all' || item.productId === productFilter;
    
    return matchesSearch && matchesProduct;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your inventory levels
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transfer Stock
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
            <DialogTrigger asChild>
              <Button className="industrial-gradient">
                <Plus className="mr-2 h-4 w-4" />
                Adjust Inventory
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Unique products in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + (item.quantity || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total units across all warehouses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {inventory.filter(item => item.quantity <= item.minimumStock).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items below minimum stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Points</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter(item => item.quantity <= item.reorderPoint).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items at reorder point
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map(product => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Inventory Levels ({filteredInventory.length})
          </CardTitle>
          <CardDescription>
            Current inventory levels across all warehouses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading inventory...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item, index) => {
                    const stockStatus = getStockStatus(item.quantity, item.minimumStock, item.reorderPoint);
                    const StatusIcon = stockStatus.icon;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {getProductName(item.productId)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Warehouse className="h-3 w-3 mr-1" />
                            Warehouse {item.warehouseId}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-lg font-semibold">{item.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{item.minimumStock}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{item.reorderPoint}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${stockStatus.color}`} />
                            <Badge 
                              variant={stockStatus.status === 'good' ? 'default' : 'destructive'}
                              className={stockStatus.color}
                            >
                              {stockStatus.status}
                            </Badge>
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
                              <DropdownMenuItem onClick={() => openAdjustDialog(item)}>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Transfer Stock
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!loading && filteredInventory.length === 0 && (
            <div className="text-center py-8">
              <Warehouse className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No inventory found</h3>
              <p className="text-muted-foreground">
                {searchTerm || productFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Inventory items will appear here when products are added to warehouses.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adjust Inventory Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
            <DialogDescription>
              Increase or decrease inventory levels for a product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Select value={adjustFormData.productId} onValueChange={(value) => setAdjustFormData({...adjustFormData, productId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={adjustFormData.quantity}
                  onChange={(e) => setAdjustFormData({...adjustFormData, quantity: e.target.value})}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={adjustFormData.type} onValueChange={(value) => setAdjustFormData({...adjustFormData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-3 w-3 text-success" />
                        Increase
                      </div>
                    </SelectItem>
                    <SelectItem value="decrease">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-3 w-3 text-destructive" />
                        Decrease
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Input
                value={adjustFormData.reason}
                onChange={(e) => setAdjustFormData({...adjustFormData, reason: e.target.value})}
                placeholder="Enter reason for adjustment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustInventory}>
              Adjust Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Stock Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
            <DialogDescription>
              Transfer stock between warehouses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Select value={transferFormData.productId} onValueChange={(value) => setTransferFormData({...transferFormData, productId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">From Warehouse</label>
                <Input
                  value={transferFormData.fromWarehouseId}
                  onChange={(e) => setTransferFormData({...transferFormData, fromWarehouseId: e.target.value})}
                  placeholder="Warehouse ID"
                />
              </div>
              <div>
                <label className="text-sm font-medium">To Warehouse</label>
                <Input
                  value={transferFormData.toWarehouseId}
                  onChange={(e) => setTransferFormData({...transferFormData, toWarehouseId: e.target.value})}
                  placeholder="Warehouse ID"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={transferFormData.quantity}
                  onChange={(e) => setTransferFormData({...transferFormData, quantity: e.target.value})}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Input
                  value={transferFormData.reason}
                  onChange={(e) => setTransferFormData({...transferFormData, reason: e.target.value})}
                  placeholder="Enter reason"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferStock}>
              Transfer Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
