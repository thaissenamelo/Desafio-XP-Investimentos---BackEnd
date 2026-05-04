const db = require('./models');

async function seed() {
  try {
    await db.sequelize.sync({ force: true });
    console.log("✅ Banco sincronizado e limpo.");

    const Client = db.Client || db.sequelize.models.Client;
    const Ativo = db.Ativo || db.sequelize.models.Ativo;

    if (!Client || !Ativo) {
        throw new Error("Modelos não encontrados.");
    }

    // 1. Criar Clientes (Adicionando a senha que o seu banco exige)
    await Client.create({
      nome: "Ryan Investidor",
      email: "ryan@teste.com",
      senha: "123", // Adicionei a senha aqui
      saldo: 10000.00
    });

    await Client.create({
      nome: "Thais Trader",
      email: "thais@teste.com",
      senha: "123", // Adicionei a senha aqui
      saldo: 5000.00
    });

    // 2. Criar Ativos
    await Ativo.create({
      sigla_ativo: "PETR4",
      quantidade_corretora: 500,
      valor_unitario: 35.50
    });

    await Ativo.create({
      sigla_ativo: "VALE3",
      quantidade_corretora: 300,
      valor_unitario: 70.20
    });

    console.log("✅ Banco populado com sucesso!");
    process.exit();
  } catch (error) {
    console.error("❌ Erro ao popular o banco:", error.message);
    process.exit(1);
  }
}

seed();
