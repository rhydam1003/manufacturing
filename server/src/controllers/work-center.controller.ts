export class WorkCenterController {
  async create(req, res) {
    res.json({ message: "Create Work Center endpoint" });
  }
  async list(req, res) {
    res.json({ message: "List Work Centers endpoint" });
  }
  async getById(req, res) {
    res.json({ message: "Get Work Center by ID endpoint" });
  }
  async update(req, res) {
    res.json({ message: "Update Work Center endpoint" });
  }
  async delete(req, res) {
    res.json({ message: "Delete Work Center endpoint" });
  }
}
