export default function RegisterPage() {
    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-center text-2xl font-bold text-slate-900">
                Rejestracja
            </h2>

            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Imię i nazwisko
                    </label>
                    <input
                        type="text"
                        placeholder="Wpisz imię i nazwisko"
                        className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Wpisz email"
                        className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Login
                    </label>
                    <input
                        type="text"
                        placeholder="Wpisz login"
                        className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Hasło
                    </label>
                    <input
                        type="password"
                        placeholder="Wpisz hasło"
                        className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-slate-800"
                >
                    Zarejestruj się
                </button>
            </form>

            <p className="text-center text-sm text-slate-600">
                Masz już konto?{" "}
                <a href="/login" className="text-indigo-600 hover:underline">
                    Zaloguj się
                </a>
            </p>
        </div>
    );
}


