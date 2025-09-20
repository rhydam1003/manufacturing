import { Request, Response, NextFunction } from "express";
import { ManufacturingOrder } from "../models/manufacturing-order.model";
import { WorkOrder } from "../models/work-order.model";
import { Product } from "../models/product.model";
import { InventoryItem } from "../models/inventory-item.model";
import { WorkCenter } from "../models/work-center.model";

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Get manufacturing order stats
      const moStats = await ManufacturingOrder.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalQuantity: { $sum: "$qtyPlanned" },
            completedQuantity: { $sum: "$qtyProduced" }
          }
        }
      ]);

      // Get work order stats
      const woStats = await WorkOrder.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalPlannedMinutes: { $sum: "$plannedMinutes" },
            totalActualMinutes: { $sum: "$actualMinutes" }
          }
        }
      ]);

      // Get product stats
      const productStats = await Product.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 }
          }
        }
      ]);

      // Get inventory stats
      const inventoryStats = await InventoryItem.aggregate([
        {
          $group: {
            _id: null,
            totalItems: { $sum: 1 },
            totalQuantity: { $sum: "$qtyOnHand" },
            totalReserved: { $sum: "$qtyReserved" }
          }
        }
      ]);

      // Get work center stats
      const workCenterStats = await WorkCenter.aggregate([
        {
          $group: {
            _id: "$isActive",
            count: { $sum: 1 },
            totalCapacity: { $sum: "$capacity" },
            totalDowntime: { $sum: "$downtime" }
          }
        }
      ]);

      // Calculate KPIs
      const completedMOs = moStats.find(stat => stat._id === "Done")?.count || 0;
      const inProgressMOs = moStats.find(stat => stat._id === "In Progress")?.count || 0;
      const plannedMOs = moStats.find(stat => stat._id === "Planned")?.count || 0;
      const canceledMOs = moStats.find(stat => stat._id === "Canceled")?.count || 0;

      const completedWOs = woStats.find(stat => stat._id === "Completed")?.count || 0;
      const inProgressWOs = woStats.find(stat => stat._id === "Started")?.count || 0;
      const queuedWOs = woStats.find(stat => stat._id === "Queued")?.count || 0;

      const rawMaterials = productStats.find(stat => stat._id === "Raw")?.count || 0;
      const finishedGoods = productStats.find(stat => stat._id === "Finished")?.count || 0;

      const inventory = inventoryStats[0] || { totalItems: 0, totalQuantity: 0, totalReserved: 0 };
      const activeWorkCenters = workCenterStats.find(stat => stat._id === true)?.count || 0;

      // Calculate efficiency metrics
      const totalPlannedMinutes = woStats.reduce((sum, stat) => sum + (stat.totalPlannedMinutes || 0), 0);
      const totalActualMinutes = woStats.reduce((sum, stat) => sum + (stat.totalActualMinutes || 0), 0);
      const efficiency = totalPlannedMinutes > 0 ? (totalActualMinutes / totalPlannedMinutes) * 100 : 0;

      const dashboardData = {
        manufacturingOrders: {
          completed: completedMOs,
          inProgress: inProgressMOs,
          planned: plannedMOs,
          canceled: canceledMOs,
          total: completedMOs + inProgressMOs + plannedMOs + canceledMOs
        },
        workOrders: {
          completed: completedWOs,
          inProgress: inProgressWOs,
          queued: queuedWOs,
          total: completedWOs + inProgressWOs + queuedWOs
        },
        products: {
          rawMaterials,
          finishedGoods,
          total: rawMaterials + finishedGoods
        },
        inventory: {
          totalItems: inventory.totalItems,
          totalQuantity: inventory.totalQuantity,
          totalReserved: inventory.totalReserved,
          availableQuantity: inventory.totalQuantity - inventory.totalReserved
        },
        workCenters: {
          active: activeWorkCenters,
          total: workCenterStats.reduce((sum, stat) => sum + stat.count, 0)
        },
        efficiency: {
          overall: Math.round(efficiency * 100) / 100,
          totalPlannedMinutes,
          totalActualMinutes
        },
        kpis: {
          completionRate: completedMOs > 0 ? Math.round((completedMOs / (completedMOs + inProgressMOs + plannedMOs)) * 100) : 0,
          onTimeDelivery: 85, // Placeholder - would need actual delivery tracking
          resourceUtilization: Math.round(efficiency),
          inventoryTurnover: 4.2 // Placeholder - would need actual turnover calculation
        }
      };

      res.json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Get recent manufacturing orders
      const recentMOs = await ManufacturingOrder.find()
        .populate("productId", "name sku")
        .populate("assigneeId", "name")
        .sort({ updatedAt: -1 })
        .limit(limit);

      // Get recent work orders
      const recentWOs = await WorkOrder.find()
        .populate("moId", "code")
        .populate("workCenterId", "name")
        .populate("operatorId", "name")
        .sort({ updatedAt: -1 })
        .limit(limit);

      const recentActivity = [
        ...recentMOs.map(mo => ({
          type: "manufacturing_order",
          id: mo._id,
          title: `MO ${mo.code}`,
          description: `Manufacturing order for ${mo.productId?.name || "Unknown Product"}`,
          status: mo.status,
          assignee: mo.assigneeId?.name,
          updatedAt: mo.updatedAt
        })),
        ...recentWOs.map(wo => ({
          type: "work_order",
          id: wo._id,
          title: `WO ${wo.name}`,
          description: `Work order at ${wo.workCenterId?.name || "Unknown Work Center"}`,
          status: wo.status,
          operator: wo.operatorId?.name,
          updatedAt: wo.updatedAt
        }))
      ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
       .slice(0, limit);

      res.json({
        success: true,
        data: recentActivity,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = [];

      // Low stock alerts
      const lowStockItems = await InventoryItem.find({
        qtyOnHand: { $lte: 10 } // Assuming 10 is low stock threshold
      }).populate("productId", "name sku");

      lowStockItems.forEach(item => {
        alerts.push({
          type: "low_stock",
          severity: "warning",
          title: "Low Stock Alert",
          message: `${item.productId?.name} (${item.productId?.sku}) has only ${item.qtyOnHand} units remaining`,
          productId: item.productId?._id,
          quantity: item.qtyOnHand
        });
      });

      // Overdue manufacturing orders
      const overdueMOs = await ManufacturingOrder.find({
        status: { $in: ["Planned", "In Progress"] },
        scheduleEnd: { $lt: new Date() }
      }).populate("productId", "name");

      overdueMOs.forEach(mo => {
        alerts.push({
          type: "overdue_order",
          severity: "error",
          title: "Overdue Manufacturing Order",
          message: `MO ${mo.code} for ${mo.productId?.name} is overdue`,
          orderId: mo._id,
          dueDate: mo.scheduleEnd
        });
      });

      // Work centers with high downtime
      const highDowntimeWorkCenters = await WorkCenter.find({
        downtime: { $gte: 480 } // Assuming 8 hours is high downtime
      });

      highDowntimeWorkCenters.forEach(wc => {
        alerts.push({
          type: "high_downtime",
          severity: "warning",
          title: "High Downtime Alert",
          message: `Work center ${wc.name} has ${wc.downtime} minutes of downtime`,
          workCenterId: wc._id,
          downtime: wc.downtime
        });
      });

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  }
}
