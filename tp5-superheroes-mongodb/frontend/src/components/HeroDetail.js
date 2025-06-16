import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/HeroDetail.css'; 

const HeroDetail = () => {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [heroe, setHeroe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false); 

  useEffect(() => {
    const fetchHeroe = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/superheroes/${nombre}`);
        const data = await response.json();
        setHeroe(data);
      } catch (error) {
        console.error('Error al obtener los datos del héroe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroe();
  }, [nombre]);

  const handleEliminar = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/superheroes/${nombre}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Superhéroe eliminado correctamente');
        navigate('/');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error de red: ${error.message}`);
    }
  };

  // Mostrar modal de confirmación
  const abrirConfirmacion = () => setShowConfirm(true);
  const cerrarConfirmacion = () => setShowConfirm(false);

  // Confirmar eliminación desde modal
  const confirmarEliminar = () => {
    setShowConfirm(false);
    handleEliminar();
  };

  if (loading) return <p>Cargando...</p>;
  if (!heroe || heroe.error) return <p>Superhéroe no encontrado</p>;

  return (
    <div className="hero-detail">
      <h2>{heroe.nombre}</h2>
      {heroe.logo && (
        <img
          src={`http://127.0.0.1:8000/static/${heroe.logo}`}
          alt={heroe.nombre}
          className="hero-logo"
        />
      )}
      <p><strong>Nombre real:</strong> {heroe.nombre_real}</p>
      <p><strong>Casa:</strong> {heroe.casa}</p>
      <p><strong>Biografía:</strong> {heroe.biografia}</p>

      {heroe.imagenes_carousel && heroe.imagenes_carousel.length > 0 && (
        <div className="carousel-container">
          <h3>Galería</h3>
          <Carousel showThumbs={false} infiniteLoop autoPlay>
            {heroe.imagenes_carousel.map((imgUrl, index) => (
              <div key={index}>
                <img
                  src={`http://127.0.0.1:8000/${imgUrl}`}
                  alt={`Imagen ${index + 1}`}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Botón para abrir modal */}
      <button
        onClick={abrirConfirmacion}
        style={{
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          marginTop: '20px',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        Eliminar
      </button>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de que querés eliminar a {nombre}?</p>
            <div className="modal-buttons">
              <button onClick={confirmarEliminar} className="btn-confirm">
                Sí, eliminar
              </button>
              <button onClick={cerrarConfirmacion} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroDetail;


