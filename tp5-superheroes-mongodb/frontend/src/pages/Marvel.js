import React, { useEffect, useState } from 'react';
import HeroCard from '../components/HeroCard';

const Marvel = () => {
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/marvel')
      .then((res) => res.json())
      .then((data) => setHeroes(data))
      .catch((err) => console.error('Error al cargar héroes de Marvel:', err));
  }, []);

  return (
    <div className="cards-container">
      {heroes.map((heroe) => (
        <HeroCard key={heroe.nombre} heroe={heroe} />
      ))}
    </div>
  );
};

export default Marvel;
