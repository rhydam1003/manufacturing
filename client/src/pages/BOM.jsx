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
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Calculator,
  Layers,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { bomAPI } from '@/api/bom';
import { productsAPI } from '@/api/products';
import { toast } from '@/hooks/use-toast';

const BOM = () => {
  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBOM, setEditingBOM] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    version: '',
    items: [],
    operations: [],
  });

  useEffect(() => {
    fetchBOMs();
    fetchProducts();
  }, []);

  const fetchBOMs = async () => {
    try {
      setLoading(true);
      const response = await bomAPI.getAll();
      console.log('BOM API response:', response);
      setBoms(response || []);
    } catch (error) {
      console.error('Error fetching BOMs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch BOMs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      console.log('Products for BOM:', response);
      setProducts(response || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateBOM = async () => {
    try {
      await bomAPI.create(formData);
      toast({
        title: 'Success',
        description: 'BOM created successfully',
      });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchBOMs();
    } catch (error) {
      console.error('Error creating BOM:', error);
      toast({
        title: 'Error',
        description: 'Failed to create BOM',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateBOM = async () => {
    try {
      await bomAPI.update(editingBOM._id, formData);
      toast({
        title: 'Success',
        description: 'BOM updated successfully',
      });
      setEditingBOM(null);
      resetForm();
      fetchBOMs();
    } catch (error) {
      console.error('Error updating BOM:', error);
      toast({
        title: 'Error',
        description: 'Failed to update BOM',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBOM = async (id) => {
    if (!window.confirm('Are you sure you want to delete this BOM?')) return;
    
    try {
      await bomAPI.delete(id);
      toast({
        title: 'Success',
        description: 'BOM deleted successfully',
      });
      fetchBOMs();
    } catch (error) {
      console.error('Error deleting BOM:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete BOM',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await bomAPI.toggleActive(id);
      toast({
        title: 'Success',
        description: 'BOM status updated successfully',
      });
      fetchBOMs();
    } catch (error) {
      console.error('Error toggling BOM status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update BOM status',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      name: '',
      version: '',
      items: [],
      operations: [],
    });
  };

  const openEditDialog = (bom) => {
    setEditingBOM(bom);
    setFormData({
      productId: bom.productId || '',
      name: bom.name || '',
      version: bom.version || '',
      items: bom.items || [],
      operations: bom.operations || [],
    });
  };

  const getActiveBadge = (isActive) => {
    return isActive ? (
      <Badge variant="default" className="status-completed">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="status-cancelled">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const filteredBOMs = boms.filter(bom => {
    const matchesSearch = bom.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bom.version?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProductName(bom.productId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = productFilter === 'all' || bom.productId === productFilter;
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && bom.isActive) ||
                         (activeFilter === 'inactive' && !bom.isActive);
    
    return matchesSearch && matchesProduct && matchesActive;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bill of Materials</h1>
          <p className="text-muted-foreground mt-1">
            Manage product recipes and component requirements
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="industrial-gradient">
              <Plus className="mr-2 h-4 w-4" />
              New BOM
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create BOM</DialogTitle>
              <DialogDescription>
                Create a new bill of materials for a product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium">Product</label>
                <Select value={formData.productId} onValueChange={(value) => setFormData({...formData, productId: value})}>
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
                  <label className="text-sm font-medium">BOM Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter BOM name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Version</label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    placeholder="e.g., v1.0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBOM}>
                Create BOM
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter BOMs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by BOM name, version, or product..."
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
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* BOMs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Bill of Materials ({filteredBOMs.length})
          </CardTitle>
          <CardDescription>
            Manage product recipes and component requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading BOMs...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BOM Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Operations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBOMs.map((bom) => (
                    <TableRow key={bom._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {bom.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getProductName(bom.productId)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {bom.version}
                        </Badge>
                      </TableCell>
                      <TableCell>{getActiveBadge(bom.isActive)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Layers className="h-3 w-3 text-muted-foreground" />
                          {bom.items?.length || 0} components
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calculator className="h-3 w-3 text-muted-foreground" />
                          {bom.operations?.length || 0} operations
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calculator className="mr-2 h-4 w-4" />
                              Calculate Cost
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(bom)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit BOM
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleActive(bom._id)}>
                              {bom.isActive ? (
                                <>
                                  <ToggleLeft className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteBOM(bom._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete BOM
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!loading && filteredBOMs.length === 0 && (
            <div className="text-center py-8">
              <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No BOMs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || productFilter !== 'all' || activeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first BOM to get started.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit BOM Dialog */}
      <Dialog open={!!editingBOM} onOpenChange={() => setEditingBOM(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit BOM</DialogTitle>
            <DialogDescription>
              Update BOM information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Select value={formData.productId} onValueChange={(value) => setFormData({...formData, productId: value})}>
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
                <label className="text-sm font-medium">BOM Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter BOM name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Version</label>
                <Input
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  placeholder="e.g., v1.0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBOM(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBOM}>
              Update BOM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BOM;
