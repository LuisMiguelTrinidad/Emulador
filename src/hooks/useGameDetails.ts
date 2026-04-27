import { useState, useEffect } from "react";
import { JuegoId, fetchBiblioteca } from "./api";

export function useGameDetails(gameId: string | undefined, isExplore: boolean) {
  const [juego, setJuego] = useState<JuegoId | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      if (!gameId) return;
      
      if (isExplore) {
        // Si viene de explorar, la info suele pasarse por estado o se asume temporal
        // Aquí podrías implementar una búsqueda específica si fuera necesario
        setJuego(null); // Placeholder si no hay persistencia aún
      } else {
        const usuarioId = Number(localStorage.getItem("usuario_id")) || 1;
        const biblioteca = await fetchBiblioteca(usuarioId);
        // Buscamos el juego por título o ID (dependiendo de cómo pases el gameId en la URL)
        const encontrado = biblioteca.find(j => j.id.toString() === gameId);
        setJuego(encontrado || null);
      }
      setCargando(false);
    }
    cargar();
  }, [gameId, isExplore]);

  return { juego, cargando };
}