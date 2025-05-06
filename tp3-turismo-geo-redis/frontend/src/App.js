import React, { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [grupoAgregar, setGrupoAgregar] = useState('');
  const [grupoBuscar, setGrupoBuscar] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [lugares, setLugares] = useState([]); // ya está bien así

  const [distancia, setDistancia] = useState(null);
  const [lugarSeleccionado, setLugarSeleccionado] = useState('');
  const [puntoFijoSeleccionado, setPuntoFijoSeleccionado] = useState('');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);


  const puntosFijos = [
    { nombre: 'Punto A', lat: 40.7128, lon: -74.0060 },
    { nombre: 'Punto B', lat: 34.0522, lon: -118.2437 },
    { nombre: 'Punto C', lat: 41.8781, lon: -87.6298 }
  ];

  const grupos = [
    'cervecerias',
    'universidades',
    'farmacias',
    'emergencias',
    'supermercados'
  ];

  const agregarLugar = async () => {
    const res = await fetch('http://localhost:5000/lugares/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        grupo: grupoAgregar, // <--- acá el cambio
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      })
    });
    if (res.ok) {
      alert('Lugar agregado correctamente');
    } else {
      const error = await res.json();
      alert(`Error: ${error.detail}`);
    }
  };

  const buscarLugares = async () => {
    if (!grupoBuscar || !puntoFijoSeleccionado) {
      alert('Seleccioná un grupo y un punto fijo');
      return;
    }

    const puntoFijo = puntosFijos.find(p => p.nombre === puntoFijoSeleccionado);
    if (!puntoFijo) {
      alert('Punto fijo no encontrado');
      return;
    }

    const { lat, lon } = puntoFijo;

    const res = await fetch(`http://localhost:5000/lugares/grupo/${grupoBuscar}?lat=${lat}&lon=${lon}`);

    if (res.ok) {
      const data = await res.json();
      setLugares(data.lugares);
    } else {
      alert('Error al buscar lugares cercanos');
    }
  };

  const calcularDistancia = async () => {
    if (!lugarSeleccionado || !puntoFijoSeleccionado) {
      alert('Por favor, seleccioná un lugar y un punto fijo.');
      return;
    }

    const puntoFijo = puntosFijos.find(p => p.nombre === puntoFijoSeleccionado);
    if (!puntoFijo) {
      alert('Punto fijo no encontrado');
      return;
    }

    const { lat, lon } = puntoFijo;

    const res = await fetch(`http://localhost:5000/distancia?grupo=${grupoBuscar}&nombre=${lugarSeleccionado}&lat=${lat}&lon=${lon}`);

    if (res.ok) {
      const data = await res.json();
      setDistancia(data.distancia_km);
    } else {
      alert('Error al calcular la distancia.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Agregar lugar turístico</h2>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" /><br />
      <select value={grupoAgregar} onChange={e => setGrupoAgregar(e.target.value)}>
        <option value="">Seleccioná un grupo</option>
        {grupos.map(g => <option key={g} value={g}>{g}</option>)}
      </select><br />
      <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitud" /><br />
      <input value={lon} onChange={e => setLon(e.target.value)} placeholder="Longitud" /><br />
      <button onClick={agregarLugar}>Agregar</button>

      <h2>Buscar lugares cercanos (5km)</h2>
      <select value={grupoBuscar} onChange={e => setGrupoBuscar(e.target.value)}>
        <option value="">Seleccioná un grupo</option>
        {grupos.map(g => <option key={g} value={g}>{g}</option>)}
      </select><br />

      <h2>Seleccioná donde te encuentras</h2>
      <select value={puntoFijoSeleccionado} onChange={e => setPuntoFijoSeleccionado(e.target.value)}>
        <option value="">Seleccionar Punto Fijo</option>
        {puntosFijos.map(punto => (
          <option key={punto.nombre} value={punto.nombre}>{punto.nombre}</option>
        ))}
      </select><br />

      <button onClick={buscarLugares}>Buscar</button>

      <h3>Lugares encontrados:</h3>
      <ul>
        {lugares.map(l => (
          <li key={l.nombre} onClick={() => setLugarSeleccionado(l.nombre)} style={{ cursor: 'pointer' }}>
            {l.nombre}
          </li>
        ))}
      </ul>
      {busquedaRealizada && lugares.length === 0 && (
        <p>No se encontraron lugares cercanos.</p>
      )}

      <h2>Calcular distancia a: {lugarSeleccionado}</h2>
      <button onClick={calcularDistancia}>Calcular</button>
      {distancia && <p>Distancia: {distancia} km</p>}
    </div>
  );
}

export default App;




