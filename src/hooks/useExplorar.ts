import { useState, useEffect } from "react";
// Importamos Juego en lugar de ExternalGame
import { fetchExternalGames, Juego } from "./api";

export function useExplorar() {
  // El estado ahora usa la interfaz correcta Juego[]
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [sistema, setSistema] = useState<string>("gba");
  const [busqueda, setBusqueda] = useState<string>(""); // Añadido para la búsqueda
  const [pagina, setPagina] = useState<number>(1); // Añadido para la paginación
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = async () => {
    try {
      setCargando(true);
      setError(null);
      // Ahora pasamos los 3 parámetros que requiere la API
      const resultados = await fetchExternalGames(busqueda, pagina, sistema);
      // Extraemos el array 'juegos' de la respuesta BusquedaJuegos
      setJuegos(resultados.juegos);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servicio de búsqueda.");
      setJuegos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    buscar();
  }, [sistema, busqueda, pagina]); // Reacciona a cualquier cambio

  return { juegos, sistema, setSistema, busqueda, setBusqueda, pagina, setPagina, cargando, error, refrescar: buscar };
}