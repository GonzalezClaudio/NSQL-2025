import React from 'react';
import '../styles/HeroCard.css';
import { useNavigate } from 'react-router-dom';

const HeroCard = ({ heroe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/superheroe/${heroe.nombre}`);
  };

  // Validación mínima
  if (!heroe || !heroe.logo || !heroe.nombre) {
    return <div>Datos del héroe no disponibles</div>;
  }

  return (
    <div className="hero-card" onClick={handleClick}>
      <img
        src={`http://127.0.0.1:8000/static/${heroe.logo}`}
        alt={heroe.nombre}
        className="hero-image"
        onError={(e) => (e.target.style.display = 'none')}
      />
      <h3>{heroe.nombre}</h3>
      {heroe.nombre_real && <p><strong>{heroe.nombre_real}</strong></p>}
      <p>{heroe.biografia?.substring(0, 100)}...</p>
    </div>
  );
};

export default HeroCard;

