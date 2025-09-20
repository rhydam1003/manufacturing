export class WorkOrderController {
  async create(req, res) {
    res.json({ message: "Create WO endpoint" });
  }
  async list(req, res) {
    res.json({ message: "List WOs endpoint" });
  }
  async getById(req, res) {
    res.json({ message: "Get WO by ID endpoint" });
  }
  async update(req, res) {
    res.json({ message: "Update WO endpoint" });
  }
  async start(req, res) {
    res.json({ message: "Start WO endpoint" });
  }
  async complete(req, res) {
    res.json({ message: "Complete WO endpoint" });
  }
  async cancel(req, res) {
    res.json({ message: "Cancel WO endpoint" });
  }
}
