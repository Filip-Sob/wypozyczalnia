import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const linkBase =
        "relative px-3 py-2 rounded-md text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-white/70";
    const linkInactive =
        "text-white/80 hover:text-white hover:bg-white/10 border-b-2 border-transparent hover:border-white/50";
    const linkActive =
        "text-white bg-white/10 border-b-2 border-white";

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-700 via-blue-800 to-slate-900 shadow">

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="h-14 flex items-center justify-between">
                    {/* Brand */}
                    <NavLink
                        to="/catalog"
                        className="text-white font-semibold tracking-tight text-base sm:text-lg"
                    >
                        Wypożyczalnia sprzętu uczelnianego
                    </NavLink>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink
                            to="/catalog"
                            end
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                        >
                            Katalog
                        </NavLink>
                        <NavLink
                            to="/me/reservations"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                        >
                            Moje rezerwacje
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                        >
                            Logowanie
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                        >
                            Rejestracja
                        </NavLink>
                        <NavLink
                            to="/staff"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                        >
                            Panel opiekuna
                        </NavLink>
                    </nav>

                    {/* Mobile toggle */}
                    <button
                        aria-label="Otwórz menu"
                        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {/* prosta ikona burgera bez bibliotek */}
                        <span className="block w-5 h-0.5 bg-white mb-1.5 rounded"/>
                        <span className="block w-5 h-0.5 bg-white mb-1.5 rounded"/>
                        <span className="block w-5 h-0.5 bg-white rounded"/>
                    </button>
                </div>

                {/* Mobile nav */}
                {open && (
                    <nav className="md:hidden pb-3 flex flex-col gap-1">
                        <NavLink
                            to="/catalog"
                            end
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            Katalog
                        </NavLink>
                        <NavLink
                            to="/me/reservations"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            Moje rezerwacje
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            Logowanie
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            Rejestracja
                        </NavLink>
                        <NavLink
                            to="/staff"
                            className={({isActive}) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            Panel opiekuna
                        </NavLink>
                    </nav>
                )}
            </div>
        </header>
    );
}
