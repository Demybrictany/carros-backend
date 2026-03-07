const jwt = require("jsonwebtoken");
const SECRET = "super_clave_para_el_jwt";

// ✔ Verifica token
exports.verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// ✔ Permite solo gerente
exports.soloGerente = (req, res, next) => {
if (req.user.rol !== "gerente" && req.user.rol !== "programador") {
    return res.status(403).json({ error: "Acceso denegado (solo gerente)" });
  }
  next();
};
exports.soloProgramador = (req, res, next) => {
  if (req.user.rol !== "programador") {
    return res.status(403).json({ error: "Acceso restringido solo a programador" });
  }
  next();
};

//router.get("/config", verificarToken, soloProgramador, controladorSuper);
