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
  quantidade_corretora: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    
  },
  valor_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    
  }
}, {
  sequelize: db,
  tableName: 'Ativos',
  timestamps: false,
});
Ativo.associate = (models) => {
  Ativo.hasMany(models.Carteira, { foreignKey: 'id_ativo' });
};
module.exports = Ativo;
