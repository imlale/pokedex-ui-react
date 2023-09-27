import { useState, useEffect } from 'react';
import './index.css'

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Manejar la visibilidad del botón cuando el usuario hace scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      // Mostrar el botón cuando el usuario ha desplazado más de 300 píxeles hacia abajo
      setIsVisible(true);
    } else {
      // Ocultar el botón si el usuario está cerca de la parte superior de la página
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    // Scroll suave a la parte superior de la página
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div onClick={scrollToTop} className={`scroll-to-top-button ${isVisible ? 'visible' : ''}`}>
      
    </div>
  );
}

export default ScrollToTopButton;