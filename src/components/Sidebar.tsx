import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();
  const active = pathname === "/";

  return (
    <aside className="hidden md:flex md:flex-col w-56 border-r border-white/5 bg-bg/80 backdrop-blur">
      <div className="h-16 px-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-accent/15 grid place-items-center">
          <span className="text-accent font-bold">₹</span>
        </div>
        <div className="font-semibold">Jayant's Expenses</div>
      </div>
      <nav className="px-2 py-3 space-y-1">
        <Link
          to="/"
          className={`block px-3 py-2 rounded-lg transition ${
            active
              ? "bg-white/5 text-white"
              : "text-textMuted hover:bg-white/5 hover:text-white"
          }`}
        >
          Dashboard
        </Link>
      </nav>
      <div className="mt-auto p-4 text-xs text-textMuted/80">
        Local mode
      </div>
    </aside>
  );
}
