import { Search } from "lucide-react";

export function CatalogHero() {
  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-col">
        <h2 className="text-md font-bold tracking-wide text-slate-400">
          RETROARCH CLOUD
        </h2>
        <h1 className="text-2xl font-bold text-white">Catálogo</h1>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 outline-offset-4 focus-within:outline-2 focus-within:outline-amber-400">
        <Search className="text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Buscar juegos…"
          className="text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
