const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do Bivi Admin rodando!");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
