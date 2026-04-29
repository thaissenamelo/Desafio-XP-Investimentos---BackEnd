const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Ativo = db.define('Ativo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sigla_ativo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  qtd_corretora: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  },
  valor_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  }
}, {
  sequelize: db,
  tableName: 'Ativos',
  timestamps: false,
});

module.exports = Ativo;