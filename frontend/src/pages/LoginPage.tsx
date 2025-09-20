// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, makeBasic, saveAuth } from "../utils/api";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // zbuduj Basic, zapisz do localStorage pod "auth.basic" i zweryfikuj /me
            const token = makeBasic(username, password);
            saveAuth(token);
            await api.auth.me();

            navigate("/catalog");
        } catch (err: any) {
            // jeśli weryfikacja nie przeszła, wyczyść i pokaż błąd
            localStorage.removeItem("auth.basic");
            setError(err?.status === 401 ? "Nieprawidłowy login lub hasło" : "Błąd logowania");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white bg-opacity-90 p-12 rounded-lg shadow-md w-[800px]">
                <h2 className="text-3xl font-bold text-center mb-8">Logowanie</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Login</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hasło</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
                        Zaloguj się
                    </button>
                </form>

                {error && <p className="text-red-600 text-center mt-4">{error}</p>}

                <p className="text-sm text-center mt-6">
                    Nie masz konta?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Zarejestruj się
                    </Link>
                </p>
            </div>
        </div>
    );
}
