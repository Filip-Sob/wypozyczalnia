import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';

import Layout from './layout/Layout';
import CatalogPage from './pages/CatalogPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <CatalogPage /> },
            {
                path: 'login',
                element: (
                    <section className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Logowanie</h2>
                        <p className="text-slate-600">Placeholder logowania.</p>
                    </section>
                ),
            },
            {
                path: 'me/reservations',
                element: (
                    <section className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Moje rezerwacje</h2>
                        <p className="text-slate-600">Placeholder listy rezerwacji.</p>
                    </section>
                ),
            },
            {
                path: 'staff',
                element: (
                    <section className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Panel opiekuna</h2>
                        <p className="text-slate-600">Placeholder panelu opiekuna.</p>
                    </section>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
