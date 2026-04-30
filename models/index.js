"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Cliente = require("./clientes");
const Ativo = require("./ativos");
const Carteira = require("./carteira");

const db = {
  sequelize,
  Sequelize,
  Cliente,
  Ativo,
  Carteira
};

// 🔥 RELACIONAMENTOS (ESSENCIAL)
Carteira.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Carteira.belongsTo(Ativo, { foreignKey: 'id_ativo' });

Cliente.hasMany(Carteira, { foreignKey: 'id_cliente' });
Ativo.hasMany(Carteira, { foreignKey: 'id_ativo' });

module.exports = db;
