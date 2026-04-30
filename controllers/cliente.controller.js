const clienteService = require('../services/cliente.service');

class ClientController {
    async createClient(req, res) {
        try {
            const cliente = await clienteService.createClient(req.body);
            return res.status(201).json(cliente);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllClients(req, res) {
        try {
            const clientes = await clienteService.getAllClients();
            return res.status(200).json(clientes);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getClient(req, res) {
        try {
            const cliente = await clienteService.getClient(req.params.id);
            return res.status(200).json(cliente);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    async deleteClient(req, res) {
        try {
            const resultado = await clienteService.deleteClient(req.params.id);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    async updateClient(req, res) {
        try {
            const resultado = await clienteService.updateCliente(req.params.id, req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ClientController();
