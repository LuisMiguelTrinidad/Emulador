import { invoke } from "@tauri-apps/api/core";
import WebSocket from '@tauri-apps/plugin-websocket';

////////////////////////////////////////////////////
// INTERFACES
////////////////////////////////////////////////////

export interface JuegoId {
  id: number;
  titulo: string;
  consola: string;
  ruta: string | null;
}

export interface Juego {
  nombre: string;
  url_descarga: string;
  consola: string;
}

export interface LoginRespuesta {
  mensaje: string;
  usuario_id: number;
}

export interface RegistroRespuesta {
  id: number;
  usuario: string;
}

export interface ProgresoDescarga {
  status: "descargando" | "extrayendo" | "completado" | "error";
  progreso?: number;
  descargado_mb?: number;
  total_mb?: number;
  mensaje?: string;
  ruta_rom?: string;
}

export interface BusquedaJuegos {
  busqueda: string;
  total_resultados: number;
  pagina_actual: number;
  tamaño_pagina: number;
  total_paginas: number;
  juegos: Juego[];
}

////////////////////////////////////////////////////
// FUNCIONES RUST
////////////////////////////////////////////////////

export async function fetchBiblioteca(id: number): Promise<JuegoId[]> {
  //Tauri lanza un error automáticamente (rechaza la promesa) si Rust devuelve Err()
  return invoke<JuegoId[]>("get_biblioteca", { id });
}

export async function loginUsuario(usuario: string, contrasena: string): Promise<LoginRespuesta> {
  return invoke<LoginRespuesta>("login", { usuario, contrasena });
}

export async function registrarUsuario(usuario: string, contrasena: string): Promise<RegistroRespuesta> {
  return invoke<RegistroRespuesta>("register", { usuario, contrasena });
}

export async function fetchExternalGames(busqueda: string, pagina: number, consola: string): Promise<BusquedaJuegos> {
  const cantidad = 40;
  return invoke<BusquedaJuegos>("get_juegos", { busqueda, pagina, cantidad , consola});
}

export async function borrarJuego(idJuego: number, idPerfil: number): Promise<string> {
  return invoke<string>("borrar_juego_cuenta", { idJuego, idPerfil });
}

export async function lanzarJuego(idJuego: number, idPerfil: number): Promise<string> {
  return invoke<string>("iniciar_juego", { idJuego, idPerfil });
}

////////////////////////////////////////////////////
// FUNCIONES TS
////////////////////////////////////////////////////

export async function descargarJuego(consola: string, url: string, nombre: string, perfilId: number, onMessage: (data: ProgresoDescarga) => void) {
  const tokenId = import.meta.env.VITE_P_ACCESS_TOKEN_ID;
  const token = import.meta.env.VITE_P_ACCESS_TOKEN;
  //Si en algún momento tengo la oportunidad de conocer al creador de FastAPI le haré conocer el verdadero terror

  // Ya no pasamos los tokens por la URL
  const wsUrl = `wss://backendpython.procsmocscimsi.uk/ws/descargar/${consola}`;
  //const wsUrl = `ws://backendpython.procsmocscimsi.uk/ws/descargar/${consola}?P-Access-Token-Id=${tokenId}&P-Access-Token=${token}`;

  try {
    //const socket = await WebSocket.connect(wsUrl);
    // Usamos el plugin de Tauri para poder mandar headers
    const socket = await WebSocket.connect(wsUrl, {
      headers: {
        "P-Access-Token-Id": tokenId,
        "P-Access-Token": token,
        // Falsificamos el origen para que FastAPI crea que es una petición interna
        "Origin": "https://backendpython.procsmocscimsi.uk" 
      }
    });

    socket.addListener((msg) => {
      // El plugin devuelve event.data
      const data = JSON.parse(msg.data as string);
      onMessage(data);
    });

    await socket.send(JSON.stringify({
      url: url,
      nombre: nombre,
      perfil_id: perfilId
    }));
  } catch (error) {
    console.error("Error al conectar WS:", error);
  }
}