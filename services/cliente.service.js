const { Client } = require('../models');

class ClientService {
    async getAllClients() {
        return await Client.findAll();
    }

    async createClient(data) {
        return await Client.create(data);
    }

    async getClient(id) {
        return await Client.findOne({
            where: { id }
        });
    }

    async deleteClient(id) {
        return await Client.destroy({
            where: { id }
        });
    }

    async updateCliente(id, data) {
        return await Client.update(data, {
            where: { id }
        });
    }
}

module.exports = new ClientService();
