// src/hooks/useBiblioteca.ts
import { useState, useEffect } from "react";
import { fetchBiblioteca, JuegoId } from "./api";

export function useBiblioteca(usuarioId: number) {
  const [juegos, setJuegos] = useState<JuegoId[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const datos = await fetchBiblioteca(usuarioId);
      setJuegos(datos);
    } catch (err) {
      setError(err as string);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [usuarioId]);

  return { juegos, cargando, error, refrescar: cargarDatos };
}