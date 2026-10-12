import React, { useState, useEffect, useRef } from 'react';
import './Carrusel.css';

// Datos limpios y unificados del catálogo de Lubcker (eliminadas las rutas rotas)
const carruselData = [
  { image: require("../assets/productos/1DEDO.jpg"), name: '1DEDO - Limpieza de manos premium' },
  { image: require("../assets/productos/1DEDO.jpg"), name: 'Ofertas de la Semana - Productos Destacados' },
  { image: require("../assets/productos/1DEDO.jpg"), name: 'Línea de Limpieza Avanzada' },
  { image: require("../assets/productos/1DEDO.jpg"), name: 'Kit de Mantenimiento Lubricante Pro' },
];

export default function Carrusel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    resetPauseTimer();
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carruselData.length);
  };

  const prevSlide = () => {
    resetPauseTimer();
    setCurrentSlide((prevSlide) => (prevSlide - 1 + carruselData.length) % carruselData.length);
  };

  const resetPauseTimer = () => {
    setIsPaused(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000); 
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % carruselData.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPaused]);

  return (
    <div className="carrusel-contenedor" onClick={resetPauseTimer}>
      <div className="carrusel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {carruselData.map((slide, index) => (
          <div className="carrusel-slide" key={index}>
            <img src={slide.image} alt={slide.name} className="carrusel-image" />
            <div className="carrusel-overlay">
              <p className="carrusel-name">{slide.name}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="carrusel-btn carrusel-prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
        <span>&#10094;</span>
      </button>
      <button className="carrusel-btn carrusel-next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
        <span>&#10095;</span>
      </button>
    </div>
  );
}
