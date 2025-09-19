import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<CatalogPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
