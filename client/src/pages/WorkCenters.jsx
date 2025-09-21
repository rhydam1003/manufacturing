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
  Factory,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  DollarSign,
  MapPin,
  Users,
  Activity,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { workCentersAPI } from '@/api/workCenters';
import { toast } from '@/hooks/use-toast';

const WorkCenters = () => {
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkCenter, setEditingWorkCenter] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    costPerHour: '',
    capacity: '',
    downtime: '',
    isActive: true,
  });

  useEffect(() => {
    fetchWorkCenters();
  }, []);

  const fetchWorkCenters = async () => {
    try {
      setLoading(true);
      const response = await workCentersAPI.getAll();
      console.log('Work Centers API response:', response);
      setWorkCenters(response || []);
    } catch (error) {
      console.error('Error fetching work centers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch work centers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkCenter = async () => {
    try {
      await workCentersAPI.create(formData);
      toast({
        title: 'Success',
        description: 'Work center created successfully',
      });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchWorkCenters();
    } catch (error) {
      console.error('Error creating work center:', error);
      toast({
        title: 'Error',
        description: 'Failed to create work center',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateWorkCenter = async () => {
    try {
      await workCentersAPI.update(editingWorkCenter._id, formData);
      toast({
        title: 'Success',
        description: 'Work center updated successfully',
      });
      setEditingWorkCenter(null);
      resetForm();
      fetchWorkCenters();
    } catch (error) {
      console.error('Error updating work center:', error);
      toast({
        title: 'Error',
        description: 'Failed to update work center',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWorkCenter = async (id) => {
    if (!window.confirm('Are you sure you want to delete this work center?')) return;
    
    try {
      await workCentersAPI.delete(id);
      toast({
        title: 'Success',
        description: 'Work center deleted successfully',
      });
      fetchWorkCenters();
    } catch (error) {
      console.error('Error deleting work center:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete work center',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      costPerHour: '',
      capacity: '',
      downtime: '',
      isActive: true,
    });
  };

  const openEditDialog = (workCenter) => {
    setEditingWorkCenter(workCenter);
    setFormData({
      name: workCenter.name || '',
      location: workCenter.location || '',
      costPerHour: workCenter.costPerHour || '',
      capacity: workCenter.capacity || '',
      downtime: workCenter.downtime || '',
      isActive: workCenter.isActive || false,
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

  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'text-success';
    if (utilization >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const filteredWorkCenters = workCenters.filter(center => {
    const matchesSearch = center.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || center.location === locationFilter;
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && center.isActive) ||
                         (activeFilter === 'inactive' && !center.isActive);
    
    return matchesSearch && matchesLocation && matchesActive;
  });

  const locations = [...new Set(workCenters.map(wc => wc.location).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Centers</h1>
          <p className="text-muted-foreground mt-1">
            Manage production work centers and their utilization
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="industrial-gradient">
              <Plus className="mr-2 h-4 w-4" />
              New Work Center
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Work Center</DialogTitle>
              <DialogDescription>
                Add a new work center to your production system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter work center name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Cost per Hour</label>
                  <Input
                    type="number"
                    value={formData.costPerHour}
                    onChange={(e) => setFormData({...formData, costPerHour: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Capacity (hours)</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Downtime (%)</label>
                  <Input
                    type="number"
                    value={formData.downtime}
                    onChange={(e) => setFormData({...formData, downtime: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkCenter}>
                Create Work Center
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Work Center Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workCenters.length}</div>
            <p className="text-xs text-muted-foreground">
              Work centers in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Centers</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {workCenters.filter(wc => wc.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workCenters.reduce((sum, wc) => sum + (wc.capacity || 0), 0)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Total available hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Hour</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${workCenters.length > 0 ? 
                (workCenters.reduce((sum, wc) => sum + (wc.costPerHour || 0), 0) / workCenters.length).toFixed(2) : 
                '0.00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Average operational cost
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Work Centers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
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

      {/* Work Centers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Work Centers ({filteredWorkCenters.length})
          </CardTitle>
          <CardDescription>
            Manage production work centers and monitor utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading work centers...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Cost/Hour</TableHead>
                    <TableHead>Downtime</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkCenters.map((center) => {
                    const utilization = Math.max(0, 100 - (center.downtime || 0));
                    
                    return (
                      <TableRow key={center._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4 text-muted-foreground" />
                            {center.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {center.location}
                          </div>
                        </TableCell>
                        <TableCell>{getActiveBadge(center.isActive)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {center.capacity}h
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            ${center.costPerHour}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-muted-foreground" />
                            {center.downtime}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${utilization >= 90 ? 'bg-success' : utilization >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                                style={{ width: `${utilization}%` }}
                              />
                            </div>
                            <span className={`text-sm ${getUtilizationColor(utilization)}`}>
                              {utilization}%
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Utilization
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(center)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Work Center
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteWorkCenter(center._id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Work Center
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
          
          {!loading && filteredWorkCenters.length === 0 && (
            <div className="text-center py-8">
              <Factory className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No work centers found</h3>
              <p className="text-muted-foreground">
                {searchTerm || locationFilter !== 'all' || activeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first work center to get started.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Work Center Dialog */}
      <Dialog open={!!editingWorkCenter} onOpenChange={() => setEditingWorkCenter(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Work Center</DialogTitle>
            <DialogDescription>
              Update work center information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter work center name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Cost per Hour</label>
                <Input
                  type="number"
                  value={formData.costPerHour}
                  onChange={(e) => setFormData({...formData, costPerHour: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Capacity (hours)</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  placeholder="8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Downtime (%)</label>
                <Input
                  type="number"
                  value={formData.downtime}
                  onChange={(e) => setFormData({...formData, downtime: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingWorkCenter(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWorkCenter}>
              Update Work Center
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkCenters;
