const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "super_clave_para_el_jwt";
const LEGACY_SECRET = "super_clave_para_el_jwt";

// ✔ Verifica token
exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    try {
      req.user = jwt.verify(token, SECRET);
    } catch (error) {
      if (SECRET === LEGACY_SECRET) throw error;
      req.user = jwt.verify(token, LEGACY_SECRET);
    }
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
