import { Navigate, Route, Routes } from "react-router";
import Layout from "../components/Layout";
import { CatalogPage } from "../pages/catalog";
import { ExplorePage } from "../pages/explore";
import { SettingsPage } from "../pages/settings";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/catalog" replace />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
