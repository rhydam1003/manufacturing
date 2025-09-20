import { Request, Response, NextFunction } from "express";
import { Role } from "../models/role.model";
import { RequestWithUser, UserDocument } from "../types";

export function checkPermission(requiredPermission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as RequestWithUser;
    try {
      if (!userReq.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const role = await Role.findById(userReq.user.roleId);
      if (!role) {
        return res
          .status(403)
          .json({ success: false, error: "Role not found" });
      }

      if (!role.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const Permissions = {
  // User management
  MANAGE_USERS: "manage_users",
  VIEW_USERS: "view_users",

  // Product management
  MANAGE_PRODUCTS: "manage_products",
  VIEW_PRODUCTS: "view_products",

  // BOM management
  MANAGE_BOMS: "manage_boms",
  VIEW_BOMS: "view_boms",
  ACTIVATE_BOMS: "activate_boms",

  // Inventory management
  MANAGE_INVENTORY: "manage_inventory",
  VIEW_INVENTORY: "view_inventory",
  TRANSFER_STOCK: "transfer_stock",

  // Manufacturing management
  MANAGE_MANUFACTURING: "manage_manufacturing",
  VIEW_MANUFACTURING: "view_manufacturing",
  START_PRODUCTION: "start_production",
  COMPLETE_PRODUCTION: "complete_production",

  // Work center management
  MANAGE_WORK_CENTERS: "manage_work_centers",
  VIEW_WORK_CENTERS: "view_work_centers",

  // Work order management
  MANAGE_WORK_ORDERS: "manage_work_orders",
  VIEW_WORK_ORDERS: "view_work_orders",
  UPDATE_WORK_STATUS: "update_work_status",

  // Report management
  VIEW_REPORTS: "view_reports",
  EXPORT_REPORTS: "export_reports",

  // System management
  MANAGE_ROLES: "manage_roles",
  VIEW_ROLES: "view_roles",
  VIEW_AUDIT_LOGS: "view_audit_logs",

  // Attachment management
  MANAGE_ATTACHMENTS: "manage_attachments",
  VIEW_ATTACHMENTS: "view_attachments",
};
