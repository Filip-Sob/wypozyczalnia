import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    const linkBase =
        "px-3 py-1 rounded-md text-sm transition-colors";
    const linkInactive =
        "text-slate-700 hover:text-slate-900 hover:bg-slate-100";
    const linkActive =
        "bg-indigo-50 text-indigo-700";

    return (
        <header className="sticky top-0 z-40 border-b bg-white">
            <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
                {/* Brand w jednym kolorze */}
                <Link to="/" className="text-indigo-700 font-semibold tracking-tight">
                    Wypożyczalnia sprzętu uczelnianego
                </Link>

                <nav className="flex items-center gap-2">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Katalog
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Logowanie
                    </NavLink>
                    <NavLink
                        to="/me/reservations"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Moje rezerwacje
                    </NavLink>
                    <NavLink
                        to="/staff"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Panel opiekuna
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
