const { DataTypes } = require("sequelize");
const Sequelize = require("../config/database");


const client = Sequelize.define({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
}, {
  sequelize: db,
  tableName: 'Clientes', // Nome EXATO da tabela no seu Workbench
  timestamps: false,
});

module.exports = client;