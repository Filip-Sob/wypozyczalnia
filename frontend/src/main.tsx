import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";

import CatalogPage from "./pages/CatalogPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import StaffPage from "./pages/StaffPage";
import EquipmentDetailsPage from "./pages/EquipmentDetailsPage";
import EquipmentHistoryPage from "./pages/EquipmentHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
    // Główny layout dla „normalnych” stron
    {
        element: <Layout />,
        children: [
            { path: "/", element: <CatalogPage /> },
            { path: "/catalog", element: <CatalogPage /> },
            { path: "/me/reservations", element: <MyReservationsPage /> },
            { path: "/staff", element: <StaffPage /> },
            { path: "/equipment/:id", element: <EquipmentDetailsPage /> },
            { path: "/equipment/:id/history", element: <EquipmentHistoryPage /> },
        ],
    },
    // Osobny layout dla logowania/rejestracji (inny gradient, białe linki)
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
