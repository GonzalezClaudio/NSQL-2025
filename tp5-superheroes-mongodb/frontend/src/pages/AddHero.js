// src/pages/AddHero.js
import { useState } from "react";
import "../styles/AddHero.css";

export default function AddHero() {
  const [formData, setFormData] = useState({
    nombre: "",
    nombre_real: "",
    anio_aparicion: "",
    casa: "Marvel",
    biografia: "",
    equipamiento: "",
    aliados: "",
    enemigos: "",
    logo: "",
    imagenes_carousel: [],
    cantidad_imagenes: 0,
  });

  // Estado para el mensaje de éxito o error
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, imagenes_carousel: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Subir imágenes al servidor
    const imagenesSubidas = [];

    for (const img of formData.imagenes_carousel) {
      const data = new FormData();
      data.append("imagen", img);

      const res = await fetch("http://localhost:8000/superheroes/subir_imagen", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        imagenesSubidas.push(result.url);
      }
    }

    // 2. Crear objeto final
    const nuevoHeroe = {
      nombre: formData.nombre,
      nombre_real: formData.nombre_real,
      anio_aparicion: parseInt(formData.anio_aparicion),
      casa: formData.casa,
      biografia: formData.biografia,
      logo: formData.logo,
      equipamiento: formData.equipamiento.split(",").map((item) => item.trim()),
      aliados: formData.aliados.split(",").map((item) => item.trim()),
      enemigos: formData.enemigos.split(",").map((item) => item.trim()),
      imagenes_carousel: imagenesSubidas,
      cantidad_imagenes: imagenesSubidas.length,
    };

    // 3. Enviar al backend
    const response = await fetch("http://localhost:8000/superheroes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoHeroe),
    });

    if (response.ok) {
      setMensaje("Superhéroe agregado con éxito");
      setFormData({
        nombre: "",
        nombre_real: "",
        anio_aparicion: "",
        casa: "Marvel",
        biografia: "",
        equipamiento: "",
        aliados: "",
        enemigos: "",
        logo: "",
        imagenes_carousel: [],
        cantidad_imagenes: 0,
      });
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setMensaje("Error al agregar superhéroe");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="add-hero-container">
      <h1>Agregar Superhéroe</h1>
      
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Nombre real</label>
        <input name="nombre_real" value={formData.nombre_real} onChange={handleChange} />

        <label>Año de aparición</label>
        <input
          type="number"
          name="anio_aparicion"
          value={formData.anio_aparicion}
          onChange={handleChange}
        />

        <label>Casa</label>
        <select name="casa" value={formData.casa} onChange={handleChange}>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
        </select>

        <div style={{ margin: "1rem 0" }}>
          <strong>Logo de la casa seleccionada:</strong>
          <br />
          <img
            src={`logo/logo-${formData.casa.toLowerCase()}.png`}
            alt={`Logo de ${formData.casa}`}
            style={{ width: "120px", marginTop: "0.5rem" }}
          />
        </div>

        <label>Biografía</label>
        <textarea name="biografia" value={formData.biografia} onChange={handleChange} />

        <label>Equipamiento (separado por coma)</label>
        <input name="equipamiento" value={formData.equipamiento} onChange={handleChange} />

        <label>Aliados (separado por coma)</label>
        <input name="aliados" value={formData.aliados} onChange={handleChange} />

        <label>Enemigos (separado por coma)</label>
        <input name="enemigos" value={formData.enemigos} onChange={handleChange} />

        <label>Logo (nombre del archivo .png)</label>
        <input name="logo" value={formData.logo} onChange={handleChange} />

        <label>Imágenes del carrusel</label>
        <input type="file" multiple onChange={handleImagesChange} />

        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}
