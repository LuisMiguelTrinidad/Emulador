import { GameCard } from "./GameCard";
import { Gamepad2, Loader2 } from "lucide-react";
import { JuegoId } from "../../../hooks/api";

interface Props {
  juegos: JuegoId[];
  cargando: boolean;
}

export function CatalogGamesSection({ juegos, cargando }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
      <div className="flex justify-between gap-4">
        <div className="flex flex-1 gap-1">
          <div className="aspect-square text-slate-400">
            <Gamepad2 className="h-auto w-auto p-1 flex-0" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Biblioteca</p>
            <h2 className="text-lg leading-tight font-semibold text-white">Mis juegos</h2>
          </div>
        </div>

        <div className="my-auto rounded-full bg-slate-700 px-4 py-1 text-sm font-bold text-sky-100">
          {cargando ? "Cargando..." : `${juegos.length} títulos`}
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-sky-500 w-12 h-12" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {juegos.map((juego, index) => (
            <GameCard 
              key={`${juego.titulo}-${index}`} 
              juego={juego} 
            />
          ))}
        </div>
      )}
    </section>
  );
}