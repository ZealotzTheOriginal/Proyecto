import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

// Icono personalizado para transportes
const transporteIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [30, 30],
});

const API = "http://localhost:5000/api/transportes";

export default function MapaTransportes() {
  const [transportes, setTransportes] = useState([]);

  useEffect(() => {
    axios.get(API).then((res) => {
      setTransportes(res.data);
    });
  }, []);

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h2 className="h4 mb-3">🌍 Ubicación de transportes</h2>

        <MapContainer
          center={[41.3888, 2.159]} // Barcelona como centro por defecto
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />

          {transportes
            .filter((t) => t.lat && t.lng) // solo mostrar los que tienen coordenadas
            .map((t) => (
              <Marker
                key={t.id}
                position={[t.lat, t.lng]}
                icon={transporteIcon}
              >
                <Popup>
                  🚐 <b>{t.vehiculo}</b> <br />
                  👨 {t.conductor || "—"} <br />
                  ⚡ {t.disponibilidad}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
