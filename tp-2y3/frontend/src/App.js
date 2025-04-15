import React, { useEffect, useState } from 'react';

function App() {
  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Obtener la lista de capítulos al cargar el componente
  useEffect(() => {
    fetch('http://localhost:5000/capitulos')  // Backend Flask
      .then((response) => response.json())
      .then((data) => {
        setCapitulos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los capítulos:', error);
        setLoading(false);
      });
  }, []);
  
  // Función para alquilar un capítulo
  const alquilarCapitulo = (id) => {
    fetch(`http://localhost:5000/alquilar/${id}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setCapitulos((prevCapitulos) =>
          prevCapitulos.map((cap) =>
            cap.id === id ? { ...cap, estado: 'reservado' } : cap
          )
        );
      })
      .catch((error) => console.error('Error al alquilar:', error));
  };

  // Función para confirmar pago
  const confirmarPago = (id) => {
    const precio = prompt('Ingrese el precio para confirmar el pago');
    fetch(`http://localhost:5000/confirmar_pago/${id}`, {
      method: 'POST',
      body: JSON.stringify({ precio }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setCapitulos((prevCapitulos) =>
          prevCapitulos.map((cap) =>
            cap.id === id ? { ...cap, estado: 'alquilado' } : cap
          )
        );
      })
      .catch((error) => console.error('Error al confirmar pago:', error));
  };

  // Componente de loading mientras se carga la lista
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Lista de Capítulos</h1>
      <ul className="capitulos-list">
        {capitulos.map((capitulo) => (
          <li key={capitulo.id} className="capitulo-item">
            <h2>{capitulo.titulo}</h2>
            <p>Estado: {capitulo.estado}</p>
            <p>resrvado hasta: {capitulo.reservado_hasta}</p>
            {capitulo.estado === 'disponible' && (
              <button onClick={() => alquilarCapitulo(capitulo.id)}>
                Alquilar (4 minutos)
              </button>
            )}
            {capitulo.estado === 'reservado' && (
              <button onClick={() => confirmarPago(capitulo.id)}>
                Confirmar Pago (24 horas)
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


