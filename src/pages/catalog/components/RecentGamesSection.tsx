import { History } from "lucide-react";
import { catalogGames } from "../data/catalogGames";
import { GameCard } from "./GameCard";

export function RecentGamesSection() {
  const recentGames = catalogGames.slice(0, 5);

  return (
    <section className="flex flex-col gap-4 rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
      <div className="flex justify-between gap-4">
        <div className="flex flex-1 gap-1">
          <div className="aspect-square text-slate-400">
            <History className="h-full w-full p-1" strokeWidth={2} />
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
              RECIENTES
            </p>
            <h2 className="text-lg leading-tight font-semibold text-white">
              Continúa donde lo dejaste
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {recentGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
