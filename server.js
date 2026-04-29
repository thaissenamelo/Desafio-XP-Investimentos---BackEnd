const express = require("express");
// const reviewRoutes = require("./routes/review.routes");
// const movieRoutes = require("./routes/movie.routes");
// const userRoutes = require("./routes/user.routes");
const db = require("./models");
const investimentosRoutes = require("./routes/investimentosRoutes");

const app = express();

app.use(express.json());
app.use(investimentosRoutes);

// app.use("/reviews", reviewRoutes);
// app.use("/movie", movieRoutes);
// app.use("/users", userRoutes);

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

