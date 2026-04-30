const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carteira = sequelize.define('Carteira', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_ativo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  }
}, {
  tableName: 'Carteiras',
  timestamps: true,
});

module.exports = Carteira;