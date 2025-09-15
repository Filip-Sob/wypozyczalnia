import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Layout() {
    return (
        <div className="min-h-dvh bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-5xl p-4">
                <Outlet />
            </main>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-5xl px-4 py-3 text-sm text-slate-500">
                    © {new Date().getFullYear()} — Projekt zespołowy
                </div>
            </footer>
        </div>
    );
}
