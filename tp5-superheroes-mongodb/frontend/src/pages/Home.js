import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroCard from '../components/HeroCard';
import './Home.css';

const Home = () => {
  const [heroes, setHeroes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/superheroes")
      .then((res) => {
        setHeroes(res.data);
        
      })
      .catch((err) => console.error("Error al cargar los superhéroes", err));
  }, []);

  const filtrados = heroes.filter(h =>
    h.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="home-container">
      <h1>Superhéroes</h1>
      <input
        type="text"
        placeholder="Buscar superhéroe..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="busqueda-input"
      />

      {/* Mostrar resultados filtrados si hay texto en la búsqueda */}
      {busqueda.trim() !== "" ? (
        filtrados.length > 0 ? (
          <div className="cards-container">
            {filtrados.map((heroe) => (
              <HeroCard key={heroe.nombre} heroe={heroe} />
            ))}
          </div>
        ) : (
          <p>No se encontraron superhéroes con ese nombre.</p>
        )
      ) : (
        // Si no hay búsqueda, mostrar todos los héroes
        <div className="cards-container">
          {heroes.map((heroe) => (
            <HeroCard key={heroe.nombre} heroe={heroe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
