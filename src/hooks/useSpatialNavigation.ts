import { useCallback } from 'react';
import { setController } from './useGamepad';

// Selecciona enlaces, botones, inputs y elementos con tabIndex (como tus GameCards)
const FOCUSABLE_SELECTOR = 'a[href], button, input, [tabIndex="0"]';

export function useSpatialNavigation() {
  const handleAction = useCallback((action: string) => {
    const currentFocus = document.activeElement as HTMLElement;

    // Acción A: Simular un click
    if (action === 'A') {
      currentFocus?.click();
      return;
    }
    
    // Acción B: Quitar el foco o volver atrás
    if (action === 'B') {
      if (currentFocus && currentFocus !== document.body) {
         currentFocus.blur();
      }
      return;
    }

    // Buscamos todos los elementos interactivos en la pantalla
    const focusableElements = Array.from(
      document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0); // Solo los visibles

    if (focusableElements.length === 0) return;

    // Si no hay nada enfocado, enfocamos el primer elemento (Ej: el buscador)
    if (!currentFocus || currentFocus === document.body) {
      focusableElements[0].focus();
      return;
    }

    const currentRect = currentFocus.getBoundingClientRect();
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2,
    };

    let bestCandidate: HTMLElement | null = null;
    let minDistance = Infinity;

    focusableElements.forEach((candidate) => {
      if (candidate === currentFocus) return;
      
      const rect = candidate.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      let isValidDirection = false;

      // Comprobamos si el candidato está en la dirección pulsada (con un pequeño margen de 10px)
      if (action === 'UP' && rect.bottom <= currentRect.top + 10) isValidDirection = true;
      if (action === 'DOWN' && rect.top >= currentRect.bottom - 10) isValidDirection = true;
      if (action === 'LEFT' && rect.right <= currentRect.left + 10) isValidDirection = true;
      if (action === 'RIGHT' && rect.left >= currentRect.right - 10) isValidDirection = true;

      if (isValidDirection) {
        // Distancia euclidiana (Pitágoras) para encontrar el más cercano
        const distance = Math.sqrt(
          Math.pow(center.x - currentCenter.x, 2) + 
          Math.pow(center.y - currentCenter.y, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          bestCandidate = candidate;
        }
      }
    });

    if (bestCandidate) {
      (bestCandidate as HTMLElement).focus();
      // Hace scroll suave si el elemento está fuera de la pantalla
      (bestCandidate as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  setController(handleAction);
}