const { Ativo } = require('../models');

module.exports = {

  async getAll() {
    return await Ativo.findAll();
  }

};