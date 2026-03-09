import { BASE_URL } from "../config";

const API = `${BASE_URL}/usuarios`;

// login de usuario
export async function login(usuario, contrasena) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario, contrasena }),
  });

  return res.json();
}

// registrar usuario
export async function registrarUsuario(data, token) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}