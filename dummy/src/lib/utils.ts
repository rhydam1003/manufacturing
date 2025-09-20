import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getStatusColor(status: string) {
  const statusColors: Record<string, string> = {
    // Manufacturing Order statuses
    pending: 'badge-warning',
    in_progress: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    
    // Work Order statuses
    Queued: 'badge-gray',
    Started: 'badge-primary',
    Paused: 'badge-warning',
    Completed: 'badge-success',
    Canceled: 'badge-danger',
    
    // Priority levels
    high: 'badge-danger',
    medium: 'badge-warning',
    low: 'badge-success',
    
    // Product types
    Raw: 'badge-primary',
    Finished: 'badge-success',
    
    // General statuses
    active: 'badge-success',
    inactive: 'badge-gray',
  };
  
  return statusColors[status] || 'badge-gray';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}