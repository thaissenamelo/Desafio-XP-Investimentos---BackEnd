const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Carteira = db.define('Carteira', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clientes',
      key: 'id'
    }
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
  sequelize: db,
  tableName: 'Carteiras',
  timestamps: true,
});

Carteira.associate = (models) => {
  Carteira.belongsTo(models.Ativo, { foreignKey: 'id_ativo' });
  Carteira.belongsTo(models.Client, { foreignKey: 'id_cliente' });
};

module.exports = Carteira;
