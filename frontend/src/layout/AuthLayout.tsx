import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* środek strony – idealne wyśrodkowanie formularza */}
            <main className="flex-1 flex items-center justify-center px-4">
                <Outlet />
            </main>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-slate-500">
                    © {new Date().getFullYear()} — Projekt zespołowy
                </div>
            </footer>
        </div>
    );
}
