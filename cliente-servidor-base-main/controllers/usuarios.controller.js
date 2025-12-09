const { Usuario } = require("../models/index");

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.json({ message: "Usuario creado", usuario });
    } catch (error) {
        res.status(500).json({ error });
    }
};
