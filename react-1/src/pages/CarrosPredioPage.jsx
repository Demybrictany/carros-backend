import { useState, useEffect } from "react";
import TablaCarros from "../Components/tablas/TablaCarros";
import InfoSideCard from "../Components/InfoSideCard";
import { BASE_URL } from "../config";


function CarroPredioPage() {
  const [carros, setCarros] = useState([]);

  // Tarjeta lateral
  const [modalData, setModalData] = useState(null);

  // Dropdowns
  const [vendedores, setVendedores] = useState([]);
  const [compradores, setCompradores] = useState([]);

  // Busqueda
  const [busqueda, setBusqueda] = useState("");

  // ID del carro
  const [Id_Predio, setId] = useState(null);

  // Campos
  const [Placa, setPlaca] = useState("");
  const [Modelo, setModelo] = useState("");
  const [Anio, setAnio] = useState("");
  const [FotoCarro, setFoto] = useState("");
  const [Precio_Compra, setPrecio] = useState("");

  const [Vin, setVin] = useState("");
  const [Num_Motor, setMotor] = useState("");
  const [Num_Chasis, setChasis] = useState("");
  const [Color, setColor] = useState("");

  const [Id_Vendedor, setVendedor] = useState("");
  const [Id_Compra, setCompra] = useState("");
const [Tiempo_Traspaso, setTraspaso] = useState("");

  // -----------------------------
  // CARGA DE DATOS
  // -----------------------------

  const cargarCarros = () => {
    fetch(`${BASE_URL}/carros-predio`)
      .then((res) => res.json())
      .then((data) => setCarros(data));
  };

  const cargarVendedores = () => {
    fetch(`${BASE_URL}/vendedores`)
      .then((res) => res.json())
      .then((data) => setVendedores(data));
  };

  const cargarCompradores = () => {
    fetch(`${BASE_URL}/compradores`)
      .then((res) => res.json())
      .then((data) => setCompradores(data));
  };

  useEffect(() => {
    cargarCarros();
    cargarVendedores();
    cargarCompradores();
  }, []);

  // FOTO BASE64
  const convertirImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  // LIMPIAR
  const limpiar = () => {
    setId(null);
    setPlaca("");
    setModelo("");
    setAnio("");
    setFoto("");
    setPrecio("");
    setVin("");
    setMotor("");
    setChasis("");
    setColor("");
    setVendedor("");
    setCompra("");
    setTraspaso("");
    setModalData(null);
  };

  // GUARDAR O ACTUALIZAR
  const guardar = async () => {
    if (!Placa.trim()) return alert("La placa es obligatoria");
    if (!Vin.trim()) return alert("VIN es obligatorio");
    if (!Anio) return alert("El año es obligatorio");

    const body = {
      Placa,
      Modelo,
      Anio: parseInt(Anio),
      FotoCarro,
      Precio_Compra: parseFloat(Precio_Compra),
      Vin,
      Num_Motor,
      Num_Chasis,
      Color,
      Tiempo_Traspaso,
      Id_Vendedor: Id_Vendedor ? parseInt(Id_Vendedor) : null,
      Id_Compra: Id_Compra ? parseInt(Id_Compra) : null,
      
    };

    const url = Id_Predio
      ? `${BASE_URL}/carros-predio/${Id_Predio}`
      : `${BASE_URL}/carros-predio`;

    await fetch(url, {
      method: Id_Predio ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    limpiar();
    cargarCarros();
  };

  // SELECCIONAR
  const seleccionar = (c) => {
    setId(c.Id_Predio);
    setPlaca(c.Placa);
    setModelo(c.Modelo);
    setAnio(c.Anio);
    setFoto(c.FotoCarro);
    setPrecio(c.Precio_Compra);
    setVin(c.Vin);
    setMotor(c.Num_Motor);
    setChasis(c.Num_Chasis);
    setColor(c.Color);
    setTraspaso(c.Tiempo_Traspaso)
    setVendedor(c.Id_Vendedor);
    setCompra(c.Id_Compra);
  };

  // FILTRO EN TIEMPO REAL
  const carrosFiltrados = carros.filter((c) => {
    const texto = busqueda.toLowerCase();

    return (
      c.Placa.toLowerCase().includes(texto) ||
      c.Modelo.toLowerCase().includes(texto) ||
      c.Vin.toLowerCase().includes(texto) ||
      c.Color.toLowerCase().includes(texto)
    );
  });

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div className="page-container">
      <h1>Carros en Predio</h1>

      <div className="form-container">

        {/* FORMULARIO */}
        <div className="form-box">

          <input placeholder="Placa" value={Placa} onChange={(e) => setPlaca(e.target.value)} />
          <input placeholder="Modelo" value={Modelo} onChange={(e) => setModelo(e.target.value)} />

          <input
            placeholder="Año"
            value={Anio}
            type="number"
            onChange={(e) => setAnio(e.target.value)}
          />

          <label>Foto del carro:</label>
          <input type="file" accept="image/*" onChange={convertirImagen} />

          <input
            placeholder="Precio Compra"
            type="number"
            value={Precio_Compra}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <input placeholder="VIN" value={Vin} onChange={(e) => setVin(e.target.value)} />
          <input placeholder="Motor" value={Num_Motor} onChange={(e) => setMotor(e.target.value)} />
          <input placeholder="Chasis" value={Num_Chasis} onChange={(e) => setChasis(e.target.value)} />
          <input placeholder="Color" value={Color} onChange={(e) => setColor(e.target.value)} />
<input
  placeholder="Tiempo de Traspaso"
  value={Tiempo_Traspaso}
  onChange={(e) => setTraspaso(e.target.value)}
/>

          {/* SELECT VENDEDOR */}
          <label>Vendedor:</label>
          <select
            value={Id_Vendedor}
            onChange={(e) => {
              const id = parseInt(e.target.value);
              setVendedor(id);
              const seleccionado = vendedores.find((x) => x.Id_Vendedor === id);
              setModalData(seleccionado);
            }}
          >
            <option value="">Seleccione vendedor</option>
            {vendedores.map((v) => (
              <option key={v.Id_Vendedor} value={v.Id_Vendedor}>
                {v.Nombre} - {v.Dpi}
              </option>
            ))}
          </select>

          {/* SELECT COMPRADOR */}
{/* SELECT COMPRADOR (SOLO MOSTRAR, NO EDITABLE) */}
<label>Comprador:</label>
<select value={Id_Compra} disabled style={{ backgroundColor: "#2e3b4e", color: "#ccc" }}>
  <option value="">
    {Id_Compra ? "Comprador asignado en una venta" : "Sin comprador"}
  </option>
  {compradores.map((c) => (
    <option key={c.Id_Compra} value={c.Id_Compra}>
      {c.Nombre} - {c.DPI}
    </option>
  ))}
</select>


          <button className="btn-primary" onClick={guardar}>
            {Id_Predio ? "Actualizar" : "Agregar"}
          </button>
        </div>

        {/* TARJETA LATERAL */}
        <InfoSideCard data={modalData} />
      </div>

          {/* 🔍 BUSCADOR ARRIBA DEL FORM */}
          <div className="search-row">
            <input
              className="search-input-inside"
              type="text"
              placeholder="Buscar carro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
      {/* TABLA FILTRADA */}
      <TablaCarros carros={carrosFiltrados} seleccionar={seleccionar} refrescar={cargarCarros} />
    </div>
  );
}

export default CarroPredioPage;
