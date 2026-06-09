import React, { useState, useEffect, useRef } from 'react';
import './Carrusel.css'; // Asegúrate de importar el archivo CSS acá

import e from '../assets/iconos/e.png';

// Datos de ejemplo para las fotos de Toxic Shine
const carruselData = [
  { image: e, name: 'e - Línea Completa' },
  { image: '/path/to/toxic-shine-products-2.png', name: 'Kit de Lavado Premium' },
  { image: '/path/to/toxic-shine-products-3.png', name: 'Cherry Wax & Tire Cleaner' },
  { image: '/path/to/toxic-shine-products-4.png', name: 'All Clean - Limpiador Universal' },
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
    // Activar pausa manual
    setIsPaused(true);
    // Reiniciar el temporizador de retención de 8 segundos
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Reanudar movimiento automático
      setIsPaused(false);
    }, 8000); 
  };

  useEffect(() => {
    // Configurar movimiento automático solo si no está en pausa manual
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % carruselData.length);
      }, 4000); // Mover cada 4 segundos
    }

    return () => {
      // Limpiar intervalos y temporizadores al desmontar el componente
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPaused]); // El efecto se reinicia si 'isPaused' cambia

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

      <button className="carrusel-btn carrusel-prev" onClick={prevSlide}>
        <span>&#10094;</span>
      </button>
      <button className="carrusel-btn carrusel-next" onClick={nextSlide}>
        <span>&#10095;</span>
      </button>
    </div>
  );
}