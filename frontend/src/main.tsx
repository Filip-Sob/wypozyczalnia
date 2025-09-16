import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';

import Layout from './layout/Layout';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyReservationsPage from './pages/MyReservationsPage';
import StaffPage from './pages/StaffPage';
import EquipmentHistoryPage from './pages/EquipmentHistoryPage'; // 🔹 nowa strona

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Pasek nawigacji */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <a href="/" className="text-xl font-bold text-indigo-600">
                        Wypożyczalnia sprzętu uczelnianego
                    </a>
                    <nav className="space-x-6">
                        <a href="/" className="text-slate-600 hover:text-indigo-600">Katalog</a>
                        <a href="/login" className="text-slate-600 hover:text-indigo-600">Logowanie</a>
                        <a href="/register" className="text-slate-600 hover:text-indigo-600">Rejestracja</a>
                    </nav>
                </div>
            </header>

            {/* Środek */}
            <main className="flex flex-1 items-center justify-center bg-white px-4">
                {children}
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

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <CatalogPage /> },               // /
            { path: 'catalog', element: <CatalogPage /> },           // alias /catalog
            { path: 'me/reservations', element: <MyReservationsPage /> },
            { path: 'staff', element: <StaffPage /> },
            { path: 'history/:id', element: <EquipmentHistoryPage /> }, // 🔹 nowa trasa historia sprzętu
        ],
    },
    {
        path: '/login',
        element: (
            <AuthLayout>
                <LoginPage />
            </AuthLayout>
        ),
    },
    {
        path: '/register',
        element: (
            <AuthLayout>
                <RegisterPage />
            </AuthLayout>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
