import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Pasek nawigacji */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <a href="/" className="text-xl font-bold text-indigo-600">
                        Wypożyczalnia sprzętu uczelnianego
                    </a>
                    <nav className="space-x-6">
                        <a href="/" className="text-slate-600 hover:text-indigo-600">Katalog</a>
                        <a href="/me/reservations" className="text-slate-600 hover:text-indigo-600">Moje rezerwacje</a>
                        <a href="/login" className="text-slate-600 hover:text-indigo-600">Logowanie</a>
                        <a href="/register" className="text-slate-600 hover:text-indigo-600">Rejestracja</a>
                    </nav>
                </div>
            </header>

            {/* Główna treść */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
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
