import { Link } from "react-router-dom";

export default function RegisterPage() {
    return (
        <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow text-center">
            <h1 className="text-xl font-bold mb-4">Rejestracja</h1> {/* zmniejszone i wyśrodkowane */}

            <form className="space-y-4">
                <div className="text-left">
                    <label className="block text-sm font-medium mb-1">Login</label>
                    <input
                        type="text"
                        placeholder="np. jan.kowalski"
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <input
                        type="email"
                        placeholder="np. jan.kowalski@edu.pl"
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm font-medium mb-1">Hasło</label>
                    <input
                        type="password"
                        placeholder="••••••"
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded bg-black text-white px-4 py-2 hover:bg-slate-800"
                >
                    Zarejestruj się
                </button>
            </form>

            <p className="text-sm text-slate-600 mt-4">
                Masz już konto?{" "}
                <Link
                    to="/login"
                    className="text-blue-600 hover:underline font-medium"
                >
                    Zaloguj się
                </Link>
            </p>
        </div>
    );
}
