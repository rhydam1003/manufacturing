import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  className,
  variant = 'default' 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10';
      case 'success':
        return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10';
      case 'warning':
        return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10';
      case 'destructive':
        return 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10';
      default:
        return 'bg-card';
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn(
      'smooth-transition hover:shadow-md',
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            'h-5 w-5',
            variant === 'primary' && 'text-primary',
            variant === 'success' && 'text-success',
            variant === 'warning' && 'text-warning',
            variant === 'destructive' && 'text-destructive',
            variant === 'default' && 'text-muted-foreground'
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {trendValue && (
            <Badge 
              variant="outline" 
              className={cn(
                'ml-2 text-xs font-normal',
                getTrendColor()
              )}
            >
              <TrendIcon className="h-3 w-3 mr-1" />
              {trendValue}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;