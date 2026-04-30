"use strict";

const Sequelize = require('sequelize'); 
const sequelize = require('../config/database'); 
const Client = require('./cliente'); 
const Carteira = require('./carteira');
const Ativo = require('./ativos')

const db = {
  sequelize,
  Sequelize,
  Client,
  Carteira,
  Ativo
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
