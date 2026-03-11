import { catalogGames } from "../data/catalogGames";
import { GameCard } from "./GameCard";
import { Gamepad2 } from "lucide-react";

export function CatalogGamesSection() {
  return (
    <section className="rounded-2flex xl f flex flex-col gap-4 rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
      <div className="flex justify-between gap-4">
        <div className="flex flex-1 gap-1">
          <div className="aspect-square text-slate-400">
            <Gamepad2 className="h-full w-full p-1" strokeWidth={2} />
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
              Biblioteca
            </p>
            <h2 className="text-lg leading-tight font-semibold text-white">
              Mis juegos
            </h2>
          </div>
        </div>

        <div className="my-auto rounded-full bg-slate-700 px-4 py-1 text-sm font-bold text-sky-100">
          {catalogGames.length} títulos
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {catalogGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
