import { useEffect, useState } from "react";
import axios from "axios";
    import { exportToPDF, exportToExcel } from "../utils/exportUtils";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const API = "http://localhost:5000/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [donaciones, setDonaciones] = useState([]);
  const [transportes, setTransportes] = useState([]);

  useEffect(() => {
    axios.get(`${API}/voluntarios`).then((res) => setVoluntarios(res.data));
    axios.get(`${API}/donaciones`).then((res) => setDonaciones(res.data));
    axios.get(`${API}/transportes`).then((res) => setTransportes(res.data));
  }, []);

  // Datos calculados
  const totalDonaciones = donaciones.reduce((acc, d) => acc + (d.valor || 0), 0);

  const donacionesTipo = [
    { name: "Económicas", value: donaciones.filter(d => d.tipo === "economica").length },
    { name: "En especie", value: donaciones.filter(d => d.tipo === "en_especie").length },
  ];

  const transportesEstado = [
    { name: "Disponible", value: transportes.filter(t => t.disponibilidad === "Disponible").length },
    { name: "Ocupado", value: transportes.filter(t => t.disponibilidad === "Ocupado").length },
    { name: "Mantenimiento", value: transportes.filter(t => t.disponibilidad === "Mantenimiento").length },
  ];

  const donacionesValor = donaciones.map(d => ({
    descripcion: d.descripcion || "Donación",
    valor: d.valor || 0,
  }));

  return (

    <div className="card shadow-sm mt-4">
        <div className="d-flex gap-2 mb-3">
  <button
    className="btn btn-outline-danger"
    onClick={() => exportToPDF(voluntarios, donaciones, transportes)}
  >
    📄 Exportar PDF
  </button>
  <button
    className="btn btn-outline-success"
    onClick={() => exportToExcel(voluntarios, donaciones, transportes)}
  >
    📊 Exportar Excel
  </button>
</div>

      <div className="card-body">
        <h2 className="h4 mb-4">📊 Dashboard de Gestión</h2>

        <div className="row">
          {/* Tarjetas rápidas */}
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-primary text-white rounded shadow-sm text-center">
              <h3>{voluntarios.length}</h3>
              <p>Voluntarios activos</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-success text-white rounded shadow-sm text-center">
              <h3>{totalDonaciones} €</h3>
              <p>Total en donaciones</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-warning text-dark rounded shadow-sm text-center">
              <h3>{transportes.length}</h3>
              <p>Transportes registrados</p>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="row mt-4">
          {/* Donaciones por tipo */}
          <div className="col-md-6">
            <h5>Donaciones por tipo</h5>
            <PieChart width={300} height={300}>
              <Pie
                data={donacionesTipo}
                cx={150}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {donacionesTipo.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Estado de transportes */}
          <div className="col-md-6">
            <h5>Estado de transportes</h5>
            <PieChart width={300} height={300}>
              <Pie
                data={transportesEstado}
                cx={150}
                cy={150}
                outerRadius={100}
                fill="#82ca9d"
                dataKey="value"
                label
              >
                {transportesEstado.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Gráfico de donaciones por valor */}
        <div className="row mt-4">
          <div className="col-12">
            <h5>Donaciones (valor en €)</h5>
            <BarChart width={600} height={300} data={donacionesValor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="descripcion" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}
