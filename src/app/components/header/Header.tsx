export default function Header() {
return (
      <header className="w-full bg-zinc-900/50 border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          🎬 CINECLUB AI
        </div>
        <nav className="flex gap-4 text-sm text-zinc-400">
          <a href="#" className="hover:text-zinc-200 transition-colors">Mis Ciclos</a>
          <a href="https://www.cinemark.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">Cartelera</a>
        </nav>
      </header>
  );
}