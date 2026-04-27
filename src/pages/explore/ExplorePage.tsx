import { useState, useEffect } from "react";
import { ExploreHeroSection } from "./components/ExploreHeroSection";
import { ExploreRecommendationsSection } from "./components/ExploreRecommendationsSection";
import { fetchExternalGames, Juego } from "../../hooks/api";

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeSource, setActiveSource] = useState("Todas");
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleSourceChange = (newSource: string) => {
    setActiveSource(newSource);
    setPage(1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const MAPEO_FILTROS: Record<string, string> = {
          "Todas": "Todas",
          "GBA": "gba",
          "DN": "ds",
          "GC": "gamecube"
        };
        
        const consolaParaBackend = MAPEO_FILTROS[activeSource] || "Todas";

        const resultado = await fetchExternalGames(query, page, consolaParaBackend);
        
        setJuegos(resultado.juegos);
        setTotalPages(resultado.total_paginas || 1);
      } catch (error) {
        console.error("Error al buscar juegos:", error);
      } finally {
        setLoading(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeSource, page]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Ya no pasamos onSourceChange ni activeSource aquí */}
      <ExploreHeroSection
        query={query}
        resultCount={juegos.length}
        onQueryChange={handleQueryChange}
      />

      {/* Ahora las opciones de filtrado se envían a los resultados */}
      <ExploreRecommendationsSection
        games={juegos}
        activeSource={activeSource}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSourceChange={handleSourceChange}
      />
    </div>
  );
}