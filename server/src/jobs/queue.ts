import Queue from "bull";
import { ReportService } from "../services/report.service";
import { InventoryService } from "../services/inventory.service";
import { AuditLog } from "../models/audit-log.model";

// Create queues
// Redis queues bypassed for local development
// const reportQueue = new Queue("report-generation", process.env.REDIS_URL);
// const inventoryQueue = new Queue("inventory-management", process.env.REDIS_URL);
// const cleanupQueue = new Queue("data-cleanup", process.env.REDIS_URL);

// All queue logic is disabled for local development (Redis bypassed)
