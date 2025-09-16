import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="w-full max-w-md bg-white shadow rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Logowanie</h2>

            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Login</label>
                    <input
                        type="text"
                        placeholder="Wpisz login"
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Hasło</label>
                    <input
                        type="password"
                        placeholder="Wpisz hasło"
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white font-medium py-2 px-4 rounded-md hover:bg-slate-800"
                >
                    Zaloguj się
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
                Nie masz konta?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-800">
                    Zarejestruj się
                </Link>
            </p>
        </div>
    );
}
