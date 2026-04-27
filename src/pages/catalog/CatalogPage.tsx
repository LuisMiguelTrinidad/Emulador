import { CatalogHero } from "./components/CatalogHero";
import { CatalogGamesSection } from "./components/CatalogGamesSection";
import { useBiblioteca } from "../../hooks/useBiblioteca";

export function CatalogPage() {
  const usuarioId = Number(localStorage.getItem("usuario_id")) || 1;
  const { juegos, cargando, error } = useBiblioteca(usuarioId);

  return (
    <div className="flex w-full flex-col gap-4">
      <CatalogHero />
      
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-xl">
          Error al cargar la biblioteca: {error}
        </div>
      )}

      <CatalogGamesSection juegos={juegos} cargando={cargando} />
    </div>
  );
}