// src/layout/Layout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path
            ? "text-white font-semibold border-b-2 border-white"
            : "text-white/90 hover:text-yellow-200";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Pasek nawigacji */}
            <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-white mb-3 md:mb-0">
                        Wypożyczalnia sprzętu uczelnianego
                    </h1>
                    <nav className="flex space-x-6 text-sm">
                        <Link to="/catalog" className={isActive("/catalog")}>
                            Katalog
                        </Link>
                        <Link to="/me/reservations" className={isActive("/me/reservations")}>
                            Moje rezerwacje
                        </Link>
                        <Link to="/login" className={isActive("/login")}>
                            Logowanie
                        </Link>
                        <Link to="/register" className={isActive("/register")}>
                            Rejestracja
                        </Link>
                        <Link to="/staff" className={isActive("/staff")}>
                            Panel opiekuna
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Główna treść */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
                <Outlet />
            </main>

            {/* Stopka */}
            <footer className="bg-slate-100 border-t">
                <div className="max-w-7xl mx-auto px-6 py-3 text-sm text-slate-600 text-center">
                    © {new Date().getFullYear()} — Projekt zespołowy
                </div>
            </footer>
        </div>
    );
}
