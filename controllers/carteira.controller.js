const carteiraService = require('../services/carteira.service');

module.exports = {

  async comprarAtivo(req, res) {
    try {
      await carteiraService.comprar(req.body);
      res.json({ message: 'Compra realizada com sucesso' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async venderAtivo(req, res) {
    try {
      await carteiraService.vender(req.body);
      res.json({ message: 'Venda realizada com sucesso' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getCarteiraCliente(req, res) {
    try {
      const data = await carteiraService.listarCarteira(req.params.codCliente);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAtivo(req, res) {
    try {
      const ativo = await carteiraService.getAtivo(req.params.codAtivo);
      res.json(ativo);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

};