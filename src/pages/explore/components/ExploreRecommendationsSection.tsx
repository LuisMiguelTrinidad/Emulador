import { SearchX, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Juego } from "../../../hooks/api";
import { GameCard } from "../../catalog/components/GameCard";

type Props = {
  games: Juego[];
  activeSource: string;
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  // Añadimos onSourceChange aquí
  onSourceChange: (source: string) => void; 
};

export function ExploreRecommendationsSection({ 
  games, 
  activeSource, 
  loading, 
  page, 
  totalPages, 
  onPageChange,
  onSourceChange // Lo recibimos por props
}: Props) {
  // Lista de fuentes movida aquí
  const sources = ["Todas", "GBA", "DN", "GC"];

  return (
    <section className="rounded-2xl border-2 border-slate-800 bg-slate-900 p-4 min-h-[400px] flex flex-col">
      {/* Ajustamos este div para que el título y el selector estén en la misma línea */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <h2 className="text-xl font-semibold text-white whitespace-nowrap">
          Resultados en
        </h2>
        
        {/* Filtro Estilizado insertado al lado del título */}
        <div className="flex items-center gap-2 rounded-full bg-slate-800 p-1">
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => onSourceChange(source)}
              className={`rounded-full px-4 py-1 text-xs font-bold transition-colors ${
                activeSource === source
                  ? "bg-slate-700 text-sky-100 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Buscando en repositorios externos...</p>
        </div>
      ) : games.length > 0 ? (
        <div className="flex flex-1 flex-col justify-between">
          <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {games.map((game, index) => (
              <GameCard
                key={`${game.nombre}-${index}`}
                game={{
                  id: game.nombre,
                  title: game.nombre,
                  accentClassName: "from-blue-600 to-indigo-600"
                }}
                topLeftBadge={game.consola}
                to={`/explore/${encodeURIComponent(game.nombre)}?url=${encodeURIComponent(game.url_descarga)}&consola=${game.consola}`}
              />
            ))}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 border-t border-slate-800 pt-6">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1 || loading}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-4 py-2 font-semibold text-sky-100 transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <span className="text-sm font-medium text-slate-400">
                Página <span className="text-white">{page}</span> de {totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-4 py-2 font-semibold text-sky-100 transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center py-20 text-center">
          <SearchX className="text-slate-600 mb-2" size={40} />
          <p className="text-slate-400">No se han encontrado juegos para esta búsqueda.</p>
        </div>
      )}
    </section>
  );
}