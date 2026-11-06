// Instalar: npm init -y && npm i express mysql2 bcrypt jsonwebtoken cors dotenv
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Devuelve solo los datos seguros del usuario (nunca la contraseña)
const datosPublicos = (u) => ({
  id: u.id_usuario,
  nombre: u.nombre,
  telefono: u.telefono,
  correo: u.correo,
  proveedor: u.proveedor === 1,
  rfcempresarial: u.rfcempresarial,
});

// REGISTRO
app.post("/api/registro", async (req, res) => {
  try {
    const { nombre, telefono, correo, contrasena, proveedor, rfcempresarial } = req.body;
    if (!nombre || !telefono || !correo || !contrasena) {
      return res.status(400).json({ error: "Completa todos los campos." });
    }
    if (proveedor && !rfcempresarial) {
      return res.status(400).json({ error: "Los proveedores deben indicar su RFC empresarial." });
    }
    const [existe] = await db.query("SELECT id_usuario FROM usuarios WHERE correo = ?", [correo]);
    if (existe.length > 0) {
      return res.status(409).json({ error: "Ese correo ya está registrado." });
    }
    const hash = await bcrypt.hash(contrasena, 10);
    await db.query(
      `INSERT INTO usuarios (nombre, telefono, correo, contrasena, proveedor, rfcempresarial)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, telefono, correo, hash, proveedor ? 1 : 0, proveedor ? rfcempresarial : null]
    );
    res.status(201).json({ mensaje: "Cuenta creada." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor." });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const [filas] = await db.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
    const usuario = filas[0];
    if (!usuario) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    let ok = false;
    if (usuario.contrasena.startsWith("$2")) {
      // contraseña ya encriptada con bcrypt
      ok = await bcrypt.compare(contrasena, usuario.contrasena);
    } else {
      // usuarios de prueba con contraseña en texto plano (ej. "123456"):
      // si coincide, la encriptamos ahora para que quede segura en la base
      ok = contrasena === usuario.contrasena;
      if (ok) {
        const hash = await bcrypt.hash(contrasena, 10);
        await db.query("UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?", [hash, usuario.id_usuario]);
      }
    }
    if (!ok) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, usuario: datosPublicos(usuario) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor." });
  }
});

// Ruta protegida: datos del usuario con sesión iniciada
app.get("/api/perfil", async (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const [filas] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);
    res.json(datosPublicos(filas[0]));
  } catch {
    res.status(401).json({ error: "Sesión inválida o expirada." });
  }
});
/*node server.js y activar xammp*/
app.listen(process.env.PORT, () => console.log(`API en http://localhost:${process.env.PORT}`));
