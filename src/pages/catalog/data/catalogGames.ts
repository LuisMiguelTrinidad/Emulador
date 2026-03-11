export type CatalogGame = {
  id: string;
  title: string;
  system: string;
  genre: string;
  year: number;
  players: string;
  accentClassName: string;
};

export const catalogGames: CatalogGame[] = [
  {
    id: "chrono-trigger",
    title: "Chrono Trigger",
    system: "SNES",
    genre: "RPG",
    year: 1995,
    players: "1 jugador",
    accentClassName: "from-fuchsia-500 via-violet-500 to-sky-500",
  },
  {
    id: "metal-slug-x",
    title: "Metal Slug X",
    system: "Neo Geo",
    genre: "Arcade",
    year: 1999,
    players: "2 jugadores",
    accentClassName: "from-orange-500 via-amber-500 to-yellow-400",
  },
  {
    id: "castlevania-sotn",
    title: "Castlevania: SOTN",
    system: "PlayStation",
    genre: "Metroidvania",
    year: 1997,
    players: "1 jugador",
    accentClassName: "from-rose-500 via-red-500 to-orange-500",
  },
  {
    id: "zelda-minish-cap",
    title: "The Minish Cap",
    system: "GBA",
    genre: "Aventura",
    year: 2004,
    players: "1 jugador",
    accentClassName: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: "street-fighter-iii",
    title: "Street Fighter III",
    system: "Arcade",
    genre: "Lucha",
    year: 1999,
    players: "2 jugadores",
    accentClassName: "from-blue-500 via-indigo-500 to-purple-500",
  },
  {
    id: "sonic-3-knuckles",
    title: "Sonic 3 & Knuckles",
    system: "Mega Drive",
    genre: "Plataformas",
    year: 1994,
    players: "2 jugadores",
    accentClassName: "from-sky-500 via-cyan-500 to-teal-400",
  },
];
