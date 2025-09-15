import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Layout() {
    return (
        <div className="min-h-dvh bg-slate-50">
            <Navbar />

            <main className="p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    <Sidebar />
                    <section className="md:col-span-9 lg:col-span-9">
                        <Outlet />
                    </section>
                </div>
            </main>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-5xl px-4 py-3 text-sm text-slate-500">
                    © {new Date().getFullYear()} — Projekt zespołowy
                </div>
            </footer>
        </div>
    );
}
