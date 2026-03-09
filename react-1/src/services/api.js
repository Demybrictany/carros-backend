import axios from "axios";
import { BASE_URL } from "../config";

// instancia central de axios
const api = axios.create({
  baseURL: BASE_URL,
});

// ===============================
// VENDEDORES
// ===============================

// Obtener vendedores
export const getVendedores = async () => {
  const res = await api.get("/vendedores");
  return res.data;
};

// Crear vendedor
export const createVendedor = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await api.post("/vendedores", formData);

  return res.data;
};

// Actualizar vendedor
export const updateVendedor = async (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await api.put(`/vendedores/${id}`, formData);

  return res.data;
};
// actualizar venta 
export const updateVenta = async (id, data) => {
  const res = await api.put(`/ventas/${id}`, data);
  return res.data;
};

// Eliminar vendedor
export const deleteVendedor = async (id) => {
  const res = await api.delete(`/vendedores/${id}`);
  return res.data;
};

export default api;