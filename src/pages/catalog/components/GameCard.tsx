import { Link } from "react-router";
import { getGameAccentColor } from "../../../utils/colors";

type Props = {
  juego?: any; // Propiedad en español (Catálogo y Explorar)
  game?: any;  // Propiedad en inglés (Por si quedó en alguna vista vieja)
  to?: string;
  topLeftBadge?: string;
};

export function GameCard({ juego, game, to, topLeftBadge }: Props) {
  // 1. Unificamos los datos venga de la propiedad que venga
  const datos = juego || game;

  // 2. Sistema de seguridad: si no hay datos, no renderizamos nada y evitamos el pantallazo en blanco
  if (!datos) {
    return null; 
  }

  // 3. Extraemos las variables probando ambos idiomas
  const id = datos.id;
  const titulo = datos.titulo || datos.title || "Desconocido";
  const consola = datos.consola || datos.system || datos.source || "Retro";

  // 4. Obtenemos el color dinámico
  const accentColor = getGameAccentColor(titulo, consola);

  // 5. Si no nos pasan un enlace específico, asumimos que va al catálogo
  // OJO: Si el id es 0 o undefined (como en los juegos del scrapper), usamos el título
  const rutaDestino = to ?? (id ? `/catalog/${id}` : `/explore/${encodeURIComponent(titulo)}`);

  return (
    <article className="aspect-square">
      <Link
        to={rutaDestino}
        aria-label={`Abrir ${titulo}`}
        className="group relative block h-full w-full rounded-2xl outline-offset-4 focus:outline-2 focus:outline-amber-400"
      >
        <div
          className={`h-full w-full rounded-2xl bg-linear-to-br transition-opacity group-hover:opacity-95 ${accentColor}`}
        />

        {topLeftBadge ? (
          <div className="pointer-events-none absolute left-2 top-2 rounded-full border border-white/15 bg-slate-950/25 px-2 py-1 text-[11px] font-semibold text-white/85">
            {topLeftBadge}
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-linear-to-t from-slate-950 to-transparent p-2">
          <h3 className="truncate text-sm font-semibold text-white">
            {titulo}
          </h3>
        </div>
      </Link>
    </article>
  );
}