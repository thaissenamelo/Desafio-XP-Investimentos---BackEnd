const { DataTypes } = require("sequelize");
const db = require("../config/database"); 

const Client = db.define('Client', { 
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
  saldo : {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
}, {
  // 3º argumento: Opções
  sequelize: db, // Aqui usamos a variável 'db' que importamos acima
  tableName: 'Clientes', 
  timestamps: false,
});


Client.associate = (models) => {
  Client.hasMany(models.Carteira, { foreignKey: 'id_cliente' });
};

module.exports = Client;
