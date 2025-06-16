import { useEffect, useState } from "react";

const PopularAirports = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/airports/popular")
      .then((res) => res.json())
      .then((data) => {
        setPopular(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener aeropuertos populares:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Aeropuertos más populares 🔥</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {popular.map((a, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <strong>{a.airport}</strong>
              <p style={{ marginTop: "0.5rem", color: "#555" }}>
                {a.visits} visitas
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularAirports;

