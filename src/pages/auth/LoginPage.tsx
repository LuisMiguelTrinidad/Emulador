import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogIn, Loader2 } from "lucide-react";
import { loginUsuario } from "../../hooks/api";

export function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await loginUsuario(usuario, password);
      localStorage.setItem("usuario_id", res.usuario_id.toString());
      localStorage.setItem("username", usuario);
      window.location.href = "/catalog"; // Forzamos recarga para refrescar estado del router
    } catch (err) {
      setError("Credenciales incorrectas o error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border-2 border-slate-800 bg-slate-900 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">RetroArch Cloud</h1>
          <p className="text-slate-400">Inicia sesión para jugar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Usuario</label>
            <input
              required
              className="w-full rounded-xl border-2 border-slate-800 bg-slate-950 p-3 text-white focus:outline-2 focus:outline-amber-400"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Contraseña</label>
            <input
              required
              type="password"
              className="w-full rounded-xl border-2 border-slate-800 bg-slate-950 p-3 text-white focus:outline-2 focus:outline-amber-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm font-bold text-red-400">{error}</p>}

          <button
            disabled={cargando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 p-3 font-bold text-white hover:bg-sky-500 disabled:opacity-50"
          >
            {cargando ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-bold text-amber-400 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}