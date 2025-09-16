import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Pasek nawigacji */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                        Wypożyczalnia sprzętu uczelnianego
                    </Link>
                    <nav className="space-x-6">
                        <Link to="/" className="text-slate-600 hover:text-indigo-600">
                            Katalog
                        </Link>
                        <Link
                            to="/me/reservations"
                            className="text-slate-600 hover:text-indigo-600"
                        >
                            Moje rezerwacje
                        </Link>
                        <Link
                            to="/login"
                            className="text-slate-600 hover:text-indigo-600"
                        >
                            Logowanie
                        </Link>
                        <Link
                            to="/register"
                            className="text-slate-600 hover:text-indigo-600"
                        >
                            Rejestracja
                        </Link>
                        <Link
                            to="/staff"
                            className="text-slate-600 hover:text-indigo-600"
                        >
                            Panel opiekuna
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Główna zawartość */}
            <main className="flex-1 bg-white px-6 py-8">
                <Outlet />
            </main>

            {/* Stopka */}
            <footer className="border-t bg-white">
                <div className="max-w-7xl mx-auto px-6 py-3 text-sm text-slate-500">
                    © {new Date().getFullYear()} — Projekt zespołowy
                </div>
            </footer>
        </div>
    );
}
