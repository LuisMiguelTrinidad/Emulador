import { Gamepad2, Info } from "lucide-react";
import { JuegoId } from "../../../hooks/api";

type Props = {
  juego: JuegoId | null;
};

export function GameDetailsSection({ juego }: Props) {
  // Mapeo simple para mostrar el nombre de la consola
  const SISTEMAS: Record<number, string> = { 1: "Game Boy Advance", 2: "Nintendo DS", 3: "GameCube" };

  return (
    <section className="flex flex-col rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Info size={18} className="text-slate-400" />
        Información técnica
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-slate-400 text-sm">Sistema</span>
          <div className="flex items-center gap-2 text-white font-medium">
            <Gamepad2 size={16} className="text-sky-400" />
            {juego ? SISTEMAS[juego.consola_id] : "Desconocido"}
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-slate-400 text-sm">Estado</span>
          <span className="text-white font-medium">
            {juego?.rom_file ? "Local (Sincronizado)" : "Remoto (Nube)"}
          </span>
        </div>
      </div>
    </section>
  );
}