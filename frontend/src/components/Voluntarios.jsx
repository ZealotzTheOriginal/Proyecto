import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/voluntarios";

export default function Voluntarios() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const { data } = await axios.get(API);
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return alert("El nombre es obligatorio");

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }

    setForm({ nombre: "", email: "", telefono: "" });
    load();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nombre: item.nombre ?? "",
      email: item.email ?? "",
      telefono: item.telefono ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar voluntario?")) return;
    await axios.delete(`${API}/${id}`);
    load();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ nombre: "", email: "", telefono: "" });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Voluntarios</h2>

        <form onSubmit={handleSubmit} className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary flex-fill" type="submit">
              {editingId ? "Guardar cambios" : "Agregar"}
            </button>
            {editingId && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.nombre}</td>
                  <td>{v.email || "—"}</td>
                  <td>{v.telefono || "—"}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEdit(v)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(v.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
