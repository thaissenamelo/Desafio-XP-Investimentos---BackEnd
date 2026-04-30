const clienteService = require('../services/cliente.service');

module.exports = {

  async createClient(req, res) {
    try {
      const result = await clienteService.createClient(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllClients(req, res) {
    try {
      const clients = await clienteService.getAllClients();
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getClient(req, res) {
    try {
      const client = await clienteService.getClient(req.params.id);
      res.json(client);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async updateClient(req, res) {
    try {
      const updated = await clienteService.updateClient(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteClient(req, res) {
    try {
      await clienteService.deleteClient(req.params.id);
      res.json({ message: 'Cliente deletado com sucesso' });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

};