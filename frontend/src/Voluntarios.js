import { useState, useEffect } from "react";
import axios from "axios";

export default function Voluntarios() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });

  const API = "http://localhost:5000/api/voluntarios";

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const res = await axios.get(API);
    setVoluntarios(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API, form);
    setForm({ nombre: "", email: "", telefono: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchData();
  };

  return (
    <div className="mt-4">
      <h2>Voluntarios</h2>
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Nombre" value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}/>
        <input className="form-control" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input className="form-control" placeholder="Teléfono" value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}/>
        <button className="btn btn-primary">Agregar</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {voluntarios.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.nombre}</td>
              <td>{v.email}</td>
              <td>{v.telefono}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
