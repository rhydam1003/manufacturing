import { Request, Response } from "express";
import { ReportService } from "../services/report.service";

export class ReportController {
  private service: ReportService;

  constructor() {
    this.service = new ReportService();
  }

  async getProductionKPIs(req: Request, res: Response) {
    try {
      const kpis = await this.service.getProductionKPIs(req.query);
      res.json({ success: true, data: kpis });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getInventoryReport(req: Request, res: Response) {
    try {
      const report = await this.service.getInventoryReport(req.query);
      res.json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getUtilizationReport(req: Request, res: Response) {
    try {
      const report = await this.service.getUtilizationReport(req.query);
      res.json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async exportData(req: Request, res: Response) {
    try {
      const data = await this.service.exportData(req.query);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
