import { ChevronLeft, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import { GameDetailsSection } from "./components/GameDetailsSection";
import { GameOverviewSection } from "./components/GameOverviewSection";
import { useGameDetails } from "../../hooks/useGameDetails";

export function GamePage() {
  const { gameId } = useParams();
  const { pathname } = useLocation();
  
  // 1. IMPORTANTE: Cambiar "explore" por "explorar" para que coincida con tu URL
  const isExploreGame = pathname.startsWith("/explore");
  // Asegúrate de que este backPath coincida con tu ruta principal de exploración
  const backPath = isExploreGame ? "/explore" : "/catalog";
  
  const { juego, cargando } = useGameDetails(gameId, isExploreGame);
  
  const backLabel = isExploreGame ? "Volver a explorar" : "Volver al catálogo";

  if (cargando) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-300">
        <Loader2 className="animate-spin mr-3 h-8 w-8 text-sky-500" /> 
        <span className="text-lg font-semibold">Cargando ficha del juego...</span>
      </div>
    );
  }

  // 2. ESTADO DE ERROR: Si terminó de cargar y no hay juego (y no es una exploración externa)
  if (!juego && !isExploreGame) {
    return (
      <section className="flex h-full min-h-60 items-center justify-center rounded-2xl border-2 border-slate-800 bg-slate-900 p-8 text-center text-slate-200">
        <div className="space-y-4">
          <p className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase">
            No encontrado
          </p>
          <h1 className="text-3xl font-bold text-white">Juego no disponible</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            No hemos podido encontrar este juego en tu base de datos local. Es posible que haya sido desvinculado o el enlace sea incorrecto.
          </p>
          <Link
            to={backPath}
            className="inline-flex items-center gap-1 rounded-full bg-slate-700 px-6 py-3 text-sm font-semibold text-sky-100 outline-offset-4 focus:outline-2 focus:outline-amber-400 transition-colors hover:bg-slate-600"
          >
            <ChevronLeft size={18} />
            {backLabel}
          </Link>
        </div>
      </section>
    );
  }

  // 3. RENDERIZADO NORMAL: Ficha completa del juego
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Link 
        to={backPath} 
        className="inline-flex self-start items-center gap-1 text-sm font-semibold text-slate-300 outline-offset-4 focus:outline-2 focus:outline-amber-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={16} /> 
        {backLabel}
      </Link>

      <div className="grid flex-1 gap-4 md:grid-cols-12 overflow-hidden">
        <div className="flex min-h-0 flex-col md:col-span-8">
          <GameOverviewSection 
            juego={juego} 
            isExplore={isExploreGame} 
            // Si viene de explorar, el ID suele ser el título en la URL. Lo decodificamos para que se lea bien.
            tempTitle={isExploreGame ? decodeURIComponent(gameId || "") : undefined} 
          />
        </div>
        <div className="flex min-h-0 flex-col gap-4 md:col-span-4">
          <GameDetailsSection juego={juego} />
        </div>
      </div>
    </div>
  );
}