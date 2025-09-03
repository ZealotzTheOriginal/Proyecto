import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/donaciones";

export default function Donaciones() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ tipo: "economica", valor: 0, descripcion: "" });
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
    if (![ "economica", "en_especie" ].includes(form.tipo)) {
      return alert("Tipo inválido");
    }
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ tipo: "economica", valor: 0, descripcion: "" });
    load();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      tipo: item.tipo,
      valor: item.valor ?? 0,
      descripcion: item.descripcion ?? ""
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar donación?")) return;
    await axios.delete(`${API}/${id}`);
    load();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ tipo: "economica", valor: 0, descripcion: "" });
  };

  const total = list.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Donaciones</h2>

        <form onSubmit={handleSubmit} className="row g-2 mb-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="economica">Económica</option>
              <option value="en_especie">En especie</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Valor (€ o unidades)"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <div className="col-md-2 d-flex gap-2">
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

        <div className="d-flex justify-content-end mb-2">
          <span className="badge bg-success fs-6">
            Total registrado: {total}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.tipo === "economica" ? "Económica" : "En especie"}</td>
                  <td>{d.valor}</td>
                  <td>{d.descripcion || "—"}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEdit(d)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(d.id)}
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
