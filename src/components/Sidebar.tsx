import { NavLink } from "react-router";
import { navigationItems } from "../app/navigation";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex flex-col items-center rounded-2xl aspect-square p-2 border-2 border-slate-800",
      "transition-all duration-200 outline-none", // Suaviza la animación y quita el borde feo nativo
      "focus:outline-2 focus:outline-amber-400 focus:-outline-offset-2 focus:bg-slate-800", // <--- ESTADO FOCUS PARA EL MANDO
      isActive ? "bg-radial-[at_00%_00%] from-slate-700 to-slate-800" : "",
    ].join(" ");

  return (
    <div className="flex h-full flex-col justify-between gap-2 rounded-2xl border-2 border-slate-800 bg-slate-900 p-2">
      {navigationItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          aria-label={item.title}
          className={linkClass}
        >
          <div className="flex flex-1 items-center justify-center text-sky-100 drop-shadow-lg">
            {item.icon}
          </div>
          <p className="text-md text-center font-semibold tracking-wide text-sky-100">
            {item.label}
          </p>
        </NavLink>
      ))}
    </div>
  );
}

export { Sidebar };
