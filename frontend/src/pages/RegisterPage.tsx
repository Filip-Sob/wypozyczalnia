import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            alert("Wypełnij wszystkie pola.");
            return;
        }

        console.log("REGISTER →", form);

        // przekierowanie do katalogu
        navigate("/catalog");
    };

    return (
        <section className="w-full max-w-md bg-white p-6 rounded-xl border">
            <h1 className="text-2xl font-bold mb-4">Rejestracja</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Login</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full rounded border px-3 py-2"
                        placeholder="np. jan.kowalski"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded border px-3 py-2"
                        placeholder="np. jan.kowalski@edu.pl"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Hasło</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full rounded border px-3 py-2"
                        placeholder="••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded bg-black text-white px-4 py-2"
                >
                    Zarejestruj się
                </button>
            </form>
        </section>
    );
}
