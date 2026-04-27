// src/pages/game/components/GameOverviewSection.tsx
import { GameActions } from "./GameActions";
import { getGameAccentColor } from "../../../utils/colors";
import { JuegoId } from "../../../hooks/api";
import { useBiblioteca } from "../../../hooks/useBiblioteca";

type Props = {
  juego: JuegoId | any;
  isExplore?: boolean;
  tempTitle?: string;
};

export function GameOverviewSection({ juego, isExplore, tempTitle }: Props) {
  const titulo = juego?.titulo || tempTitle || "Juego desconocido";
  const consola = juego?.consola || "Retro";
  
  // Obtenemos el color dinámico
  const accentColor = getGameAccentColor(titulo, consola);

  const usuarioId = Number(localStorage.getItem("usuario_id")) || 1;
  const { juegos: biblioteca } = useBiblioteca(usuarioId);

  // Comprobamos si el título ya existe en la biblioteca
  const juegoEnBiblioteca = biblioteca?.find(
    (g) => g.titulo.toLowerCase() === titulo.toLowerCase()
  );

  // Establecemos si está instalado y pasamos el objeto con la "ruta" real si lo tenemos
  const isInstalado = !!juegoEnBiblioteca || (!isExplore && !!juego?.ruta);
  const juegoActivo = juegoEnBiblioteca || juego;

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border-2 border-slate-800 bg-slate-900 p-4 shadow-inner">
      <div className="flex min-h-0 flex-col gap-4 md:flex-row md:items-start md:gap-6">
        
        <div
          className={`aspect-square w-full max-w-[180px] self-center rounded-2xl bg-linear-to-br shadow-xl transition-transform hover:scale-105 md:self-start ${accentColor}`}
        >
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
             <span className="text-xs font-black uppercase tracking-tighter text-white/20 select-none">
               {consola}
             </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center py-2">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
            Información del Archivo
          </p>
          <h1 className="mt-1 text-3xl leading-tight font-bold text-white lg:text-4xl">
            {titulo}
          </h1>
          
          <div className="mt-2 flex items-center gap-2">
             <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase">
               {consola}
             </span>
             <span className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
               {isInstalado ? "DISPONIBLE" : "SIN VINCULAR"}
             </span>
          </div>

          {/* Descripción o metadatos extra si los hubiera */}
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 italic">
            "Este juego forma parte de tu colección privada. Los metadatos detallados se sincronizarán en futuras versiones."
          </p>

          <div className="mt-auto pt-6">
            <GameActions 
              juego={juegoActivo} 
              instalado={isInstalado} 
              tempTitle={titulo} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}