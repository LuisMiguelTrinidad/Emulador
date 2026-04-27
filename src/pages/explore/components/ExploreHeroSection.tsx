import { Search } from "lucide-react";

type Props = {
  query: string;
  resultCount: number;
  onQueryChange: (value: string) => void;
};

export function ExploreHeroSection({
  query,
  resultCount,
  onQueryChange,
}: Props) {
  return (
    <section className="rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
      {/* Este div es la clave: 
        - flex-row y justify-between empujan los elementos a los extremos.
        - items-center los alinea verticalmente por la mitad.
        - w-full asegura que ocupe todo el ancho disponible.
      */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Lado izquierdo: Textos */}
        <div className="space-y-1">
          <p className="text-md font-bold tracking-wide text-slate-400 uppercase">Explorar</p>
          <h1 className="text-2xl font-bold text-white">Busca juegos externos</h1>
        </div>

        {/* Lado derecho: Buscador */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 outline-offset-4 focus-within:outline-2 focus-within:outline-amber-400">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar título..."
              className="w-40 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </label>
        </div>
      </div>
    </section>
  );
}