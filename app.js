//app.js
const express = require("express");
const app = express();
app.use(express.json());

let users = []; // Aquí guardaremos usuarios temporalmente
let sessions = {}; // Guardará los tokens de sesión

// Ruta raíz (GET /)
app.get("/", (req, res) => {
  res.send("API funcionando ");
});

// Registro
app.post("/api/register", (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Faltan datos" });
  }
  const user = { username, password, email };
  users.push(user);
  return res.status(201).json({ message: "Usuario registrado", user });
});

//LOGIN 
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  const token = `token_${Date.now()}`;
  sessions[token] = username;
  return res.status(200).json({ message: "Login exitoso", token });
});

//RECURSOS PROTEGIDOS
app.get("/api/protected-resource", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !sessions[authHeader.replace("Bearer ", "")]) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  return res.status(200).json({ data: "Recurso secreto " });
});

//LOGOUT
app.post("/api/logout", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.replace("Bearer ", "");
  if (token && sessions[token]) {
    delete sessions[token];
    return res.status(200).json({ message: "Sesión cerrada" });
  }
  return res.status(400).json({ message: "Token inválido" });
});

module.exports = app;