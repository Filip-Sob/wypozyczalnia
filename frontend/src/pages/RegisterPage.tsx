import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AUTH_KEY = "auth";
const API = (path: string) =>
    `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}${path}`;

async function safeJson(res: Response): Promise<any | null> {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        try { return await res.json(); } catch { return null; }
    }
    return null;
}

export default function RegisterPage() {
    const [username, setUsername]   = useState("");
    const [email, setEmail]         = useState("");
    const [password, setPassword]   = useState("");
    const [error, setError]         = useState("");
    const [success, setSuccess]     = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // 1) REJESTRACJA
            const reg = await fetch(API("/api/users/register"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!reg.ok) {
                const body = await safeJson(reg);
                if (reg.status === 409) {
                    setError(body?.komunikat || "Użytkownik o podanych danych już istnieje");
                } else {
                    setError(body?.komunikat || `Błąd rejestracji (${reg.status})`);
                }
                return;
            }

            // 2) AUTO-LOGIN (Basic) → /api/users/login
            const basic = btoa(`${username}:${password}`);
            const log = await fetch(API("/api/users/login"), {
                method: "POST",
                headers: { Authorization: `Basic ${basic}` },
            });

            if (!log.ok) {
                setSuccess("Konto zostało utworzone 🎉");
                setError("Nie udało się automatycznie zalogować – zaloguj się ręcznie.");
                setTimeout(() => navigate("/login"), 1200);
                return;
            }

            // 3) Zapis tokenu i redirect
            localStorage.setItem(AUTH_KEY, basic);
            setSuccess("Konto utworzone i zalogowano 🎉");
            setTimeout(() => navigate("/catalog"), 800);
        } catch (err) {
            console.error(err);
            setError("Błąd połączenia z serwerem");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white bg-opacity-90 p-12 rounded-lg shadow-md w-[800px]">
                <h2 className="text-3xl font-bold text-center mb-8">Rejestracja</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Login</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="np. jan.kowalski"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="np. jan.kowalski@edu.pl"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hasło</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
                        Zarejestruj się
                    </button>
                </form>

                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                {success && <p className="text-green-600 text-center mt-4">{success}</p>}

                <p className="text-sm text-center mt-6">
                    Masz już konto?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Zaloguj się
                    </Link>
                </p>
            </div>
        </div>
    );
}
