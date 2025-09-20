import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AUTH_KEY = "auth";
const API = (path: string) =>
    `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/,"")}${path}`;

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const basic = btoa(`${username}:${password}`);

        try {
            const resp = await fetch(API("/api/users/login"), {
                method: "POST",
                headers: { Authorization: `Basic ${basic}` },
            });

            if (!resp.ok) {
                setError(resp.status === 401 ? "Nieprawidłowy login lub hasło" : `Błąd: ${resp.status}`);
                return;
            }

            localStorage.setItem(AUTH_KEY, basic);
            navigate("/catalog");
        } catch (err) {
            console.error(err);
            setError("Błąd połączenia z serwerem");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white bg-opacity-90 p-12 rounded-lg shadow-md w-[800px]">
                <h2 className="text-3xl font-bold text-center mb-8">Logowanie</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Login</label>
                        <input className="w-full border rounded px-3 py-2"
                               value={username} onChange={e=>setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hasło</label>
                        <input type="password" className="w-full border rounded px-3 py-2"
                               value={password} onChange={e=>setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
                        Zaloguj się
                    </button>
                </form>
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                <p className="text-sm text-center mt-6">
                    Nie masz konta? <Link to="/register" className="text-blue-600 hover:underline">Zarejestruj się</Link>
                </p>
            </div>
        </div>
    );
}
