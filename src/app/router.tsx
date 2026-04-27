import { Navigate, Route, Routes } from "react-router";
import Layout from "../components/Layout";
import { CatalogPage } from "../pages/catalog";
import { ExplorePage } from "../pages/explore";
import { GamePage } from "../pages/game";
import { ProfilePage } from "../pages/profile";
import { LoginPage, RegisterPage } from "../pages/auth/"; // Importamos las nuevas

export function AppRouter() {
  const estaAutenticado = !!localStorage.getItem("usuario_id");

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      {!estaAutenticado ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        /* RUTAS PRIVADAS (Requieren estar logueado) */
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/catalog" replace />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:gameId" element={<GamePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="explore/:gameId" element={<GamePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Route>
      )}
    </Routes>
  );
}