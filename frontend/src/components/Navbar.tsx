import { NavLink, Link } from 'react-router-dom';

const base =
    'rounded-md px-3 py-2 text-sm font-medium transition';
const inactive =
    'text-slate-700 hover:bg-slate-100';
const active =
    'bg-blue-100 text-blue-700 ring-1 ring-blue-200';

export default function Navbar() {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                {/* Logo / tytuł */}
                <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-700">
            Wypożyczalnia
          </span>
                    <span className="hidden text-slate-500 sm:inline">
            sprzętu uczelnianego
          </span>
                </Link>

                {/* Linki (desktop) */}
                <nav className="flex gap-2">
                    <NavLink to="/" end
                             className={({ isActive }) => [base, isActive ? active : inactive].join(' ')}
                    >
                        Katalog
                    </NavLink>
                    <NavLink to="/login"
                             className={({ isActive }) => [base, isActive ? active : inactive].join(' ')}
                    >
                        Logowanie
                    </NavLink>
                    <NavLink to="/me/reservations"
                             className={({ isActive }) => [base, isActive ? active : inactive].join(' ')}
                    >
                        Moje rezerwacje
                    </NavLink>
                    <NavLink to="/staff"
                             className={({ isActive }) => [base, isActive ? active : inactive].join(' ')}
                    >
                        Panel opiekuna
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
