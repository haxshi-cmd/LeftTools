require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const productosRouter = require("./routes/productos");

const app = express();
const puerto = Number(process.env.PORT || 3000);

// En desarrollo permite probar el frontend desde otro puerto.
// En producción, limita CORS al origen exacto de la aplicación.
app.use(cors());
app.use(express.json());

app.get("/api/estado", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ estado: "ok", baseDatos: "conectada" });
  } catch (error) {
    res.status(500).json({ estado: "error", baseDatos: "no disponible" });
  }
});

app.use("/api/productos", productosRouter);

app.listen(puerto, () => {
  console.log(`API LeftTools disponible en http://localhost:${puerto}`);
});
