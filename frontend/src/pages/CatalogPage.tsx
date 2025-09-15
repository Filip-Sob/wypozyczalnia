import { useState } from "react";

export default function CatalogPage() {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("all");
    const [status, setStatus] = useState("all");
    const [location, setLocation] = useState("all");
    const [searched, setSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
    };

    const handleReset = () => {
        setQuery("");
        setType("all");
        setStatus("all");
        setLocation("all");
        setSearched(false);
    };

    return (
        <section className="space-y-6 w-full">
            <h2 className="text-2xl font-bold text-slate-900">Katalog sprzętu</h2>
            <p className="text-slate-600">
                Wyszukuj i filtruj zasoby. (Na razie sam interfejs — logikę i dane
                dodamy w kolejnym kroku.)
            </p>

            {/* Pasek wyszukiwania i filtrów */}
            <form
                onSubmit={handleSearch}
                className="rounded-xl border bg-white p-4 shadow-sm w-full"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5 items-end">
                    {/* Szukaj */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Szukaj
                        </label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="np. Kamera Sony"
                            className="w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400"
                        />
                    </div>

                    {/* Typ */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Typ
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-slate-900"
                        >
                            <option value="all">Wszystkie</option>
                            <option value="camera">Kamera</option>
                            <option value="laptop">Laptop</option>
                            <option value="microphone">Mikrofon</option>
                            <option value="projector">Projektor</option>
                            <option value="other">Inne</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-slate-900"
                        >
                            <option value="all">Dowolny</option>
                            <option value="available">Dostępny</option>
                            <option value="reserved">Zarezerwowany</option>
                            <option value="borrowed">Wypożyczony</option>
                            <option value="service">Serwis</option>
                            <option value="broken">Uszkodzony</option>
                        </select>
                    </div>

                    {/* Lokalizacja */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Lokalizacja
                        </label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-slate-900"
                        >
                            <option value="all">Dowolna</option>
                            <option value="lab1">Laboratorium 1</option>
                            <option value="lab2">Laboratorium 2</option>
                            <option value="warehouse">Magazyn</option>
                        </select>
                    </div>

                    {/* Przyciski */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 rounded-md bg-slate-500 px-3 py-2 text-white hover:bg-slate-600"
                        >
                            Wyczyść
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                        >
                            Szukaj
                        </button>
                    </div>
                </div>
            </form>

            {/* Wyniki */}
            <div className="rounded-md border bg-white p-4 text-slate-500">
                {!searched ? (
                    <>Brak wyników (mock). Kliknij „Szukaj”, aby wyszukać sprzęt.</>
                ) : (
                    <>Tutaj pojawią się wyniki wyszukiwania (jeszcze mockowe).</>
                )}
            </div>
        </section>
    );
}
