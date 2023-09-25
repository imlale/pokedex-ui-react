import { useEffect, useRef } from 'react';
import Loader from './Loader';

function FinDePaginaObserver({ onFinDePagina, isLoading }: { onFinDePagina: () => void, isLoading: boolean }) {
  const initia : IntersectionObserver = new IntersectionObserver(()=>{})
  const observerRef = useRef(initia);

  useEffect(() => {
    
    const options = {
      root: null, // Utiliza el viewport como contenedor principal
      rootMargin: '0px',
      threshold: 0.1, // Umbral de visibilidad del 10%
    };

    // Crea una nueva instancia del IntersectionObserver
    observerRef.current = new IntersectionObserver((entries) => {
      
      // Si la entrada intersecta (es decir, el elemento está en el viewport)
      if (!isLoading && entries[0].isIntersecting) {
        // Ejecuta la función cuando se llega al final de la página
        //TO-DO, Se está ejecutando cuando todo es vacio.
        onFinDePagina();
        console.log("recarga...", isLoading)
      }
    }, options);

    // Observa el elemento que quieres rastrear
    const elementoObservado = document.getElementById('cargar-mas'); // Reemplaza con el ID o elemento que deseas observar
    if (elementoObservado) {
      observerRef.current.observe(elementoObservado);
    }

    // Limpia la instancia del IntersectionObserver cuando el componente se desmonta
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading]);

  return <div id="cargar-mas" >{isLoading && <Loader/>}</div>;
}

export default FinDePaginaObserver;