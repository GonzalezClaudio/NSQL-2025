import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./MapPopup.css";  // Estilos personalizados para el Popup

const MapView = () => {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/airports")
      .then((res) => res.json())
      .then((data) => setAirports(data));
  }, []);

  const handleMarkerClick = async (iata, icao) => {
    const code = iata || icao;
    try {
      const res = await fetch(`http://localhost:8000/airports/${code}`);
      const data = await res.json();
      console.log("📈 Popularidad actualizada para:", code);
      // Opcional: podés mostrar los datos en un alert si querés
      // alert(`✈️ ${data.name}\n📍 Ciudad: ${data.city}\n🗺️ Código IATA: ${data.iata_faa || 'N/A'}\n🌐 ICAO: ${data.icao}`);
    } catch (err) {
      console.error("Error al registrar clic en aeropuerto:", err);
    }
  };

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup>
        {airports.map((a, idx) => (
          <Marker
            key={idx}
            position={[a.lat, a.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(a.iata_faa, a.icao),
            }}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            })}
          >
            <Popup>
              <div className="popup-content">
                <div className="popup-title">✈️ {a.name}</div>
                <div className="popup-row">
                  <span className="popup-label">📍 Ciudad:</span> {a.city}
                </div>
                <div className="popup-row">
                  <span className="popup-label">🗺️ Código IATA:</span> {a.iata_faa || "N/A"}
                </div>
                <div className="popup-row">
                  <span className="popup-label">🌐 ICAO:</span> {a.icao || "N/A"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
