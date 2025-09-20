import Queue from "bull";
import { ReportService } from "../services/report.service";
import { InventoryService } from "../services/inventory.service";
import { AuditLog } from "../models/audit-log.model";

// Create queues
const reportQueue = new Queue("report-generation", process.env.REDIS_URL);
const inventoryQueue = new Queue("inventory-management", process.env.REDIS_URL);
const cleanupQueue = new Queue("data-cleanup", process.env.REDIS_URL);

// Report generation jobs
reportQueue.process("daily-kpi", async (job) => {
  const reportService = new ReportService();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const report = await reportService.getProductionKPIs({
    startDate: yesterday.toISOString(),
    endDate: new Date().toISOString(),
  });

  // Store report data or send notifications
  return report;
});

// Inventory management jobs
inventoryQueue.process("stock-alerts", async (job) => {
  const inventoryService = new InventoryService();
  const lowStockItems = await inventoryService.getStock({
    minQuantity: 0,
    maxQuantity: 10,
  });

  // Send notifications for low stock items
  return lowStockItems;
});

// Data cleanup jobs
cleanupQueue.process("audit-log-cleanup", async (job) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await AuditLog.deleteMany({
    createdAt: { $lt: thirtyDaysAgo },
  });
});

// Schedule jobs
reportQueue.add(
  "daily-kpi",
  {},
  {
    repeat: { cron: "0 1 * * *" }, // Run at 1 AM daily
  }
);

inventoryQueue.add(
  "stock-alerts",
  {},
  {
    repeat: { cron: "0 */4 * * *" }, // Run every 4 hours
  }
);

cleanupQueue.add(
  "audit-log-cleanup",
  {},
  {
    repeat: { cron: "0 2 * * 0" }, // Run at 2 AM every Sunday
  }
);

// Error handling
[reportQueue, inventoryQueue, cleanupQueue].forEach((queue) => {
  queue.on("error", (error) => {
    console.error(`Queue ${queue.name} error:`, error);
  });

  queue.on("failed", (job, error) => {
    console.error(`Job ${job.id} in queue ${queue.name} failed:`, error);
  });
});
