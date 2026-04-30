const { Carteira } = require('../models');

class CarteiraService {
    async getAll() {
        return await Carteira.findAll();
    }

    async create(data) {
        return await Carteira.create(data);
    }

    async getById(id) {
        return await Carteira.findOne({ where: { id } });
    }

    async delete(id) {
        return await Carteira.destroy({ where: { id } });
    }

    async update(id, data) {
        return await Carteira.update(data, { where: { id } });
    }
}

module.exports = new CarteiraService();
