// src/utils/colors.ts

const COLORES_OFICIALES: Record<string, string> = {
  gba: "from-emerald-500 via-teal-500 to-cyan-500",
  ds: "from-blue-500 via-indigo-500 to-purple-500",
  gamecube: "from-orange-500 via-amber-500 to-yellow-400",
};

const COLORES_MUTED = [
  "from-slate-600 to-slate-800",
  "from-zinc-600 to-zinc-700",
  "from-neutral-600 to-neutral-800",
  "from-stone-600 to-stone-700",
  "from-gray-600 to-gray-800",
  "from-blue-900/60 to-slate-800",
  "from-emerald-900/60 to-zinc-800",
];

export function getGameAccentColor(titulo: string, consola: string): string {
  const consolaKey = consola.toLowerCase();
  
  // Si es una consola conocida, devolvemos su color vibrante
  if (COLORES_OFICIALES[consolaKey]) {
    return COLORES_OFICIALES[consolaKey];
  }

  // Para otros, generamos un color "aleatorio" pero persistente basado en el título
  let hash = 0;
  for (let i = 0; i < titulo.length; i++) {
    hash = titulo.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % COLORES_MUTED.length;
  return COLORES_MUTED[index];
}