export default function BarraLateral() {
  return (
    <div className="hidden lg:block lg:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3">Tus Conversaciones</h2>
          <div className="space-y-2">
            <div className="p-2.5 bg-zinc-900 rounded-lg text-xs font-medium border border-zinc-800 text-indigo-400 cursor-pointer">
              🍿 Ciclo de Comedias 80s
            </div>
            <div className="p-2.5 hover:bg-zinc-900 rounded-lg text-xs font-medium text-zinc-500 cursor-pointer transition-colors">
              🎃 Noche de Terror Clásico
            </div>
          </div>
        </div>
  );
}