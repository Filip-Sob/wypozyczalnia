// src/layout/Layout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path
            ? "text-white font-semibold border-b-2 border-white"
            : "text-white";
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Pasek nawigacji */}
            <nav className="bg-gradient-to-r from-indigo-900 to-blue-700 px-6 py-3 flex items-center justify-between shadow">
                <div className="text-white font-bold text-lg">
                    Wypożyczalnia sprzętu uczelnianego
                </div>
                <div className="flex gap-6">
                    <Link to="/" className={isActive("/")}>
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
                </div>
            </nav>

            {/* Zawartość strony */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>

            {/* Stopka */}
            <footer className="bg-slate-100 text-center text-slate-600 py-4 text-sm">
                © {new Date().getFullYear()} — Projekt zespołowy
            </footer>
        </div>
    );
}
