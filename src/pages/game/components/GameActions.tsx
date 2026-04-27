import { Play, Trash2, Download, Loader2 } from "lucide-react";
import { lanzarJuego, borrarJuego, descargarJuego, JuegoId, Juego, ProgresoDescarga } from "../../../hooks/api";
import { useState } from "react";

type Props = {
  instalado: boolean;
  juego: JuegoId | Juego | any;
  tempTitle: string;
};

// Mapeo inverso para saber qué string pasarle al WebSocket según el ID
const ID_A_SISTEMA: Record<number, string> = {
  1: "gba",
  2: "ds",
  3: "gamecube"
};

export function GameActions({ instalado, juego, tempTitle }: Props) {
  const [procesando, setProcesando] = useState(false);
  const [progreso, setProgreso] = useState<ProgresoDescarga | null>(null);

  const MAPEO_CONSOLAS: Record<string, string> = {
    "GBA": "gba",
    "DN": "ds",
    "GC": "gamecube",
    // Fallbacks por si viene de la base de datos local
    "Game Boy Advance": "gba",
    "Nintendo DS": "ds",
    "GameCube": "gamecube"
  };

  const handlePlay = async () => {
    if (!juego?.id) return;
    
    setProcesando(true);
    try {
      const usuarioId = Number(localStorage.getItem("usuario_id")) || 1;
      
      // Llamamos a la API con los nuevos parámetros
      await lanzarJuego(juego.id, usuarioId);
      
      // Nota: Si todo va bien, Tauri cerrará la app inmediatamente después de esta línea,
      // por lo que el usuario no llegará a ver que 'procesando' se vuelve false.
      setProcesando(false); 
    } catch (error) {
      alert(`Error al iniciar el juego: ${error}`);
      setProcesando(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este juego?")) return;
    
    setProcesando(true);
    try {
      const usuarioId = Number(localStorage.getItem("usuario_id")) || 1;
      const mensaje = await borrarJuego(juego.id, usuarioId);
      alert(mensaje);
      // Aquí deberías redirigir al usuario al catálogo o recargar la vista
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setProcesando(false);
    }
  };

const handleDownload = () => {
    console.log("1. Botón pulsado.");

    const usuarioId = Number(localStorage.getItem("usuario_id")) || 1;
    const params = new URLSearchParams(window.location.search);
    
    // Sacamos la URL y la consola de los parámetros (si venimos de explorar) o del objeto juego
    const urlDesdeParam = params.get("url");
    const consolaDesdeParam = params.get("consola");

    const urlFinal = urlDesdeParam || juego?.url_descarga || juego?.url || juego?.ruta;
    const consolaOriginal = consolaDesdeParam || juego?.consola || juego?.system || "";

    console.log("2. Datos obtenidos -> URL:", urlFinal, "| Consola:", consolaOriginal);

    if (!urlFinal) {
      alert("No se pudo encontrar la dirección de descarga.");
      return;
    }

    if (!consolaOriginal) {
      alert("No se pudo determinar el sistema/consola del juego.");
      return;
    }

    // Mapeamos al formato estricto que espera el backend
    const MAPEO_CONSOLAS: Record<string, string> = {
      "GBA": "gba",
      "DN": "ds",
      "GC": "gamecube"
    };
    const sistemaStr = MAPEO_CONSOLAS[consolaOriginal.toUpperCase()] || consolaOriginal.toLowerCase();

    setProcesando(true);
    setProgreso({ status: "descargando", progreso: 0 });

    console.log("3. Llamando al WebSocket con:", { sistemaStr, urlFinal, tempTitle, usuarioId });

    // Llamada a la API
    descargarJuego(sistemaStr, urlFinal, tempTitle || "Juego_Desconocido", usuarioId, (data) => {
      console.log("4. Respuesta del WebSocket:", data);
      setProgreso(data);
      
      if (data.status === "completado") {
        setProcesando(false);
        setProgreso(null);
        alert("¡Juego descargado y añadido a tu biblioteca!");
      } else if (data.status === "error") {
        setProcesando(false);
        setProgreso(null);
        alert(`Error en la descarga: ${data.mensaje}`);
      }
    });
  };

  // Función auxiliar para determinar qué texto mostrar en el botón de descarga
  const getBotonDescargaTexto = () => {
    if (!progreso) return "Descargar e instalar";
    if (progreso.status === "descargando") return `Descargando... ${progreso.progreso || 0}%`;
    if (progreso.status === "extrayendo") return "Extrayendo archivo...";
    return "Procesando...";
  };

  return (
    <div className="mt-4 flex gap-3">
      {instalado ? (
        <>
          <button
            onClick={handlePlay}
            disabled={procesando}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            {procesando ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
            Jugar ahora
          </button>
          <button
            onClick={handleDelete}
            disabled={procesando}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-bold text-red-400 hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <Trash2 size={18} />
            Eliminar
          </button>
        </>
      ) : (
        <button
          onClick={handleDownload}
          disabled={procesando}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-bold text-white hover:bg-sky-500 disabled:opacity-50 transition-colors"
        >
          {procesando ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          {getBotonDescargaTexto()}
        </button>
      )}
    </div>
  );
}