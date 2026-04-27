import { LogOut, User, Gamepad2, Database } from "lucide-react";

export function ProfilePage() {
  const username = localStorage.getItem("username") || "Jugador";
  const userId = localStorage.getItem("usuario_id") || "---";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex w-full h-full flex-col gap-4">
      <section className="rounded-2xl border-2 border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-slate-700 bg-slate-800 text-sky-400">
            <User size={40} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-[0.2em] text-amber-500 uppercase">Perfil de Usuario</p>
            <h1 className="text-3xl font-bold text-white">{username}</h1>
            <p className="text-sm text-slate-400">ID de Perfil: <span className="font-mono text-slate-200">#{userId}</span></p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 flex-1">
        
        <article className="flex flex-col rounded-2xl border-2 border-slate-800 bg-slate-900 p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
            <Database size={20} className="text-sky-400" />
            Estado de Sincronización
          </h2>
          <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-950/50 p-4 border border-slate-800">
            <p className="text-sm text-slate-300 italic text-center">
              Tus partidas se están guardando automáticamente en la nube.
            </p>
          </div>
        </article>

        <article className="flex flex-col rounded-2xl border-2 border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-bold text-white mb-4">Opciones de Sesión</h2>
          <button
            onClick={handleLogout}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-900/50 bg-red-950/20 px-4 py-3 font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </article>
      </div>
    </div>
  );
}