import { Compass, Library, Settings } from "lucide-react";
import type { ReactNode } from "react";

export type NavigationId = "catalog" | "explore" | "settings";

export type NavigationItem = {
  id: NavigationId;
  label: string;
  title: string;
  to: string;
  icon: ReactNode;
};

export const navigationItems: NavigationItem[] = [
  {
    id: "catalog",
    label: "Catálogo",
    title: "Catálogo",
    to: "/catalog",
    icon: <Library className="h-full w-auto p-2" strokeWidth={2} />,
  },
  {
    id: "explore",
    label: "Explorar",
    title: "Explorar",
    to: "/explore",
    icon: <Compass className="h-full w-auto p-2" strokeWidth={2} />,
  },
  {
    id: "settings",
    label: "Ajustes",
    title: "Ajustes",
    to: "/settings",
    icon: <Settings className="h-full w-auto p-2" strokeWidth={2} />,
  },
];
