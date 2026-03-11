import type { CatalogGame } from "../data/catalogGames";

type Props = {
  game: CatalogGame;
};

export function GameCard({ game }: Props) {
  return (
    <article className="relative aspect-square">
      <div
        tabIndex={0}
        className={`h-full w-full rounded-2xl bg-linear-to-br outline-offset-4 focus:outline-2 focus:outline-amber-400 ${game.accentClassName}`}
      />

      <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-linear-to-t from-slate-950 to-transparent p-2">
        <h3 className="truncate text-sm font-semibold text-white">
          {game.title}
        </h3>
      </div>
    </article>
  );
}
