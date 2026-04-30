const ativoService = require('../services/ativo.service');

module.exports = {

  async getAll(req, res) {
    try {
      const ativos = await ativoService.getAll();
      res.json(ativos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};