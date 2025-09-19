// src/layout/AuthLayout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function AuthLayout() {
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path
            ? "text-white font-semibold border-b-2 border-white"
            : "text-white";

    return (
        <div
            className="h-screen flex flex-col bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('/santlo.png')",
                backgroundSize: "870px 870px", // mniejsze ikonki
                backgroundRepeat: "repeat",   // powtarzanie
                backgroundPosition: "center",
        }}
        >
            {/* Pasek nawigacji */}
            <nav className="bg-gradient-to-r from-indigo-700 to-blue-500 px-6 py-3 flex items-center shadow">
                <div className="text-white font-bold text-lg">
                    Wypożyczalnia sprzętu uczelnianego
                </div>
                <div className="flex-grow" />
                <div className="flex gap-8 pr-40">
                    <Link to="/" className={isActive("/")}>
                        Katalog
                    </Link>
                    <Link to="/login" className={isActive("/login")}>
                        Logowanie
                    </Link>
                    <Link to="/register" className={isActive("/register")}>
                        Rejestracja
                    </Link>
                </div>
            </nav>

            {/* Zawartość strony */}
            <main className="flex-1 p-6 flex items-center justify-center overflow-hidden">
                <Outlet />
            </main>

            {/* Stopka */}
            <footer className="bg-slate-100 text-slate-600 py-6 text-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} — Projekt zespołowy</div>
                    <div className="flex flex-col md:flex-row gap-4 items-center text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <PhoneIcon className="h-5 w-5" />
                            <span>882 137 861 , 512 563 578</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-5 w-5" />
                            <span>karbowski_kacper@o2.pl</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5" />
                            <span>płk. Jana Kilińskiego 98, 90-011 Łódź</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
