// ===============================================
//  CONTROLADOR DE USUARIOS - SISTEMA DE CARROS
// ===============================================

const Usuario = require("../models/usuario.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "super_clave_para_el_jwt"; // cámbiala en producción

// =======================================================
// LISTAR TODOS LOS USUARIOS (Gerente / Programador)
// =======================================================
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["Id_Usuario", "Nombre", "Correo", "Rol"],
      order: [["Id_Usuario", "ASC"]],
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al obtener la lista de usuarios" });
  }
};

// =======================================================
// REGISTRAR USUARIO (Gerente)
// =======================================================
exports.registrar = async (req, res) => {
  try {
    const { Nombre, Correo, Contrasena, Rol } = req.body;

    // Evitar crear programador desde la interfaz (solo inicial)
    if (Rol === "programador") {
      return res.status(403).json({ error: "No permitido crear usuarios programador" });
    }

    // Validar correo único
    const existe = await Usuario.findOne({ where: { Correo } });
    if (existe)
      return res.status(400).json({ error: "El correo ya está en uso" });

    // Encriptar contraseña
    const hash = await bcrypt.hash(Contrasena, 10);

    const nuevo = await Usuario.create({
      Nombre,
      Correo,
      Contrasena: hash,
      Rol,
    });

    res.json({ mensaje: "Usuario creado correctamente ✔", usuario: nuevo });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// =======================================================
// LOGIN (Correo o Nombre)
// =======================================================
exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Buscar por correo o por nombre
    const user = await Usuario.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { Correo: usuario },
          { Nombre: usuario },
        ]
      }
    });

    if (!user)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Comparar contraseña
    const match = await bcrypt.compare(contrasena, user.Contrasena);
    if (!match)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    // Crear token
    const token = jwt.sign(
      { id: user.Id_Usuario, rol: user.Rol },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      ok: true,
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: user.Id_Usuario,
        nombre: user.Nombre,
        correo: user.Correo,
        rol: user.Rol,
      },
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
};

// =======================================================
// CREAR USUARIO INICIAL (Solo 1 vez - Programador)
// =======================================================
exports.crearInicial = async (req, res) => {
  try {
    const existe = await Usuario.findOne();
    if (existe) {
      return res.json({
        mensaje: "Ya existe un usuario, elimina este endpoint",
      });
    }

    const hash = await bcrypt.hash("admin123@", 10);

    const nuevo = await Usuario.create({
      Nombre: "Admin",
      Correo: "admin@gmail.com",
      Contrasena: hash,
      Rol: "programador",
    });

    res.json({
      mensaje: "USUARIO INICIAL CREADO ✔",
      usuario: nuevo,
      login: {
        usuario: "admin@gmail.com",
        contrasena: "admin123@",
      },
    });

  } catch (error) {
    console.error("Error creando usuario inicial:", error);
    res.status(500).json({ error: "Error creando usuario inicial" });
  }
};


