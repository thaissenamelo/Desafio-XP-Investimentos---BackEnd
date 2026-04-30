const express = require("express");
const clientRoutes = require("./routes/client.routes");
const ativoRoutes = require("./routes/ativo.routes");
const carteiraRoutes = require("./routes/carteira.routes");
const db = require("./models");

const app = express();

app.use(express.json());

app.use("/client", clientRoutes);
app.use("/ativo", ativoRoutes);
app.use("/carteira", carteiraRoutes);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("Banco conectado");

    await db.sequelize.sync();

    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  } catch (error) {
    console.error("Erro ao conectar no banco", error);
  }
}

startServer();