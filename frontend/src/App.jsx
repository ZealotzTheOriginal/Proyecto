import Voluntarios from "./components/Voluntarios";
import Donaciones from "./components/Donaciones";
import Transportes from "./components/Transportes";
import Dashboard from "./components/Dashboard";
import MapaTransportes from "./components/MapaTransportes";

export default function App() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Fundación Nexa – Gestión</h1>

      <Dashboard />
      <MapaTransportes />

      <div className="row g-4 mt-4">
        <div className="col-12"><Voluntarios /></div>
        {/* <div className="col-12"><Donaciones /></div> */}
        <div className="col-12"><Transportes /></div>
      </div>
    </div>
  );
}
