import { Link } from "react-router-dom";

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white bg-opacity-90 p-12 rounded-lg shadow-md w-[800px]">
                <h2 className="text-3xl font-bold text-center mb-8">Logowanie</h2>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Login</label>
                        <input
                            type="text"
                            placeholder="np. jan.kowalski"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hasło</label>
                        <input
                            type="password"
                            placeholder="••••••"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
                    >
                        Zaloguj się
                    </button>
                </form>

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
