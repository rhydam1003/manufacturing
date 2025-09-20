import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { productsApi } from '../../services/api';
import { Product, CreateProductData } from '../../types';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  unit: z.string().min(1, 'Unit is required'),
  type: z.enum(['Raw', 'Finished'], { required_error: 'Type is required' }),
  defaultWarehouseId: z.string().min(1, 'Default warehouse is required'),
  cost: z.number().min(0, 'Cost must be positive').optional(),
  category: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const typeOptions = [
  { value: '', label: 'Select type' },
  { value: 'Raw', label: 'Raw Material' },
  { value: 'Finished', label: 'Finished Good' },
];

const unitOptions = [
  { value: '', label: 'Select unit' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'lbs', label: 'Pounds' },
  { value: 'liters', label: 'Liters' },
  { value: 'meters', label: 'Meters' },
  { value: 'boxes', label: 'Boxes' },
];

// Mock warehouse options - in real app, fetch from API
const warehouseOptions = [
  { value: '', label: 'Select warehouse' },
  { value: '507f1f77bcf86cd799439011', label: 'Main Warehouse' },
  { value: '507f1f77bcf86cd799439012', label: 'Secondary Warehouse' },
  { value: '507f1f77bcf86cd799439013', label: 'Raw Materials Warehouse' },
];

export function ProductForm({ product, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      unit: product.unit,
      type: product.type,
      defaultWarehouseId: product.defaultWarehouseId,
      cost: product.cost,
      category: product.category || '',
    } : {
      type: 'Raw' as const,
    },
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductData> }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      onClose();
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const formData: CreateProductData = {
      ...data,
      cost: data.cost || 0,
      category: data.category || undefined,
    };

    if (product) {
      updateMutation.mutate({ id: product._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="SKU"
          {...register('sku')}
          error={errors.sku?.message}
          helperText="Unique product identifier"
        />

        <Select
          label="Type"
          options={typeOptions}
          {...register('type')}
          error={errors.type?.message}
        />

        <Select
          label="Unit"
          options={unitOptions}
          {...register('unit')}
          error={errors.unit?.message}
        />

        <Select
          label="Default Warehouse"
          options={warehouseOptions}
          {...register('defaultWarehouseId')}
          error={errors.defaultWarehouseId?.message}
        />

        <Input
          label="Cost"
          type="number"
          step="0.01"
          {...register('cost', { valueAsNumber: true })}
          error={errors.cost?.message}
        />

        <div className="md:col-span-2">
          <Input
            label="Category"
            {...register('category')}
            error={errors.category?.message}
            helperText="Optional product category"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {product ? 'Update' : 'Create'} Product
        </Button>
      </div>
    </form>
  );
}