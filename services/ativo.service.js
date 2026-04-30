const { Ativo } = require('../models');

class AtivoService {
    async getAllAtivos() {
        return await Ativo.findAll();
    }

    async createAtivo(data) {
    
        return await Ativo.create(data);
    }

    async getAtivoById(id) {
        return await Ativo.findOne({
            where: { id }
        });
    }

    async deleteAtivo(id) {
        return await Ativo.destroy({
            where: { id }
        });
    }

    async updateAtivo(id, data) {
        return await Ativo.update(data, {
            where: { id }
        });
    }

   
    async getAtivoBySigla(sigla) {
        return await Ativo.findOne({
            where: { sigla_ativo: sigla }
        });
    }
}

module.exports = new AtivoService();
