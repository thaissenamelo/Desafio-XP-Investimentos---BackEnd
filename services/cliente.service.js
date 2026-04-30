const { Cliente } = require('../models');

module.exports = {

  async createClient(data) {
    return await Cliente.create(data);
  },

  async getAllClients() {
    return await Cliente.findAll();
  },

  async getClient(id) {
    const client = await Cliente.findByPk(id);
    if (!client) throw new Error('Cliente não encontrado');
    return client;
  },

  async updateClient(id, data) {
    const client = await Cliente.findByPk(id);
    if (!client) throw new Error('Cliente não encontrado');

    await client.update(data);
    return client;
  },

  async deleteClient(id) {
    const client = await Cliente.findByPk(id);
    if (!client) throw new Error('Cliente não encontrado');

    await client.destroy();
  }

};