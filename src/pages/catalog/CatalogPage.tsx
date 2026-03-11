import { CatalogHero } from "./components/CatalogHero";
import { CatalogGamesSection } from "./components/CatalogGamesSection";
import { RecentGamesSection } from "./components/RecentGamesSection";

export function CatalogPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <CatalogHero />
      <RecentGamesSection />
      <CatalogGamesSection />
    </div>
  );
}
