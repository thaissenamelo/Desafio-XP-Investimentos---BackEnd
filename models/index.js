"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../config/database");
// const Review = require("./review.model");
// const Movie = require("./movie.model");
// const User = require("./user.model");

const db = {
  sequelize,
  Sequelize,
  // Review,
  // Movie,
  // User,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
