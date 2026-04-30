const ativoService = require('../services/ativo.service');

class AtivoController {
    async createAtivo(req, res) {
        try {
            const ativo = await ativoService.createAtivo(req.body);
            return res.status(201).json(ativo);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllAtivos(req, res) {
        try {
            const ativos = await ativoService.getAllAtivos();
            return res.status(200).json(ativos);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAtivo(req, res) {
        try {
            const ativo = await ativoService.getAtivoById(req.params.id);
            if (!ativo) {
                return res.status(404).json({ error: "Ativo não encontrado" });
            }
            return res.status(200).json(ativo);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateAtivo(req, res) {
        try {
            const [updated] = await ativoService.updateAtivo(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Ativo não encontrado para atualizar" });
            }
            return res.status(200).json({ message: "Ativo atualizado com sucesso" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteAtivo(req, res) {
        try {
            const deleted = await ativoService.deleteAtivo(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Ativo não encontrado para deletar" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AtivoController();
