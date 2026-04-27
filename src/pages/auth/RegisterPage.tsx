import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserPlus, Loader2, ChevronLeft } from "lucide-react";
import { registrarUsuario } from "../../hooks/api";

export function RegisterPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // Llamada a la función de api.ts que invoca el comando de Rust/Python
      await registrarUsuario(usuario, password);
      
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err: any) {
      // Diferenciamos si el error es porque el usuario existe o es un error de red
      if (err.toString().includes("registrado")) {
        setError("Este nombre de usuario ya está en uso. Prueba con otro.");
      } else {
        setError("Error de conexión con el servidor. Inténtalo de nuevo.");
      }
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border-2 border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-slate-400 text-sm">Regístrate para guardar tus partidas en la nube</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Usuario
            </label>
            <input
              required
              type="text"
              autoComplete="username"
              placeholder="Ej: RedPlayer99"
              className="w-full rounded-xl border-2 border-slate-800 bg-slate-950 p-3 text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none transition-colors"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contraseña
            </label>
            <input
              required
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-xl border-2 border-slate-800 bg-slate-950 p-3 text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
              <p className="text-center text-sm font-semibold text-red-400">{error}</p>
            </div>
          )}

          <button
            disabled={cargando || !usuario || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 p-3 font-bold text-white transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {cargando ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <UserPlus size={20} />
                Registrarse
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col gap-3 pt-2">
          <div className="h-px bg-slate-800 w-full" />
          <p className="text-center text-sm text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}