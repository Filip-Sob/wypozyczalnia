// src/pages/CatalogPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Device } from "../utils/api";
import { addReservation } from "../utils/reservationsStorage";

/* ===== Pomocnicze ===== */
function statusPillClasses(status: string) {
    const v = (status || "").toUpperCase();
    if (["DOSTĘPNY", "AVAILABLE"].includes(v)) return "bg-emerald-100 text-emerald-700";
    if (["WYPOŻYCZONY", "LOANED"].includes(v)) return "bg-indigo-100 text-indigo-700";
    if (["ZAREZERWOWANY", "RESERVED"].includes(v)) return "bg-amber-100 text-amber-700";
    if (["SERWIS", "MAINTENANCE"].includes(v)) return "bg-purple-100 text-purple-700";
    if (["USZKODZONY", "DAMAGED", "ZGUBIONY", "LOST"].includes(v)) return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-700";
}

// UI (PL) -> API (EN) dla parametru ?status=
function uiStatusToApi(s: string): string | undefined {
    switch (s) {
        case "Dostępny": return "AVAILABLE";
        case "Wypożyczony": return "LOANED";
        case "Zarezerwowany": return "RESERVED";
        case "Serwis": return "MAINTENANCE";
        case "Uszkodzony": return "DAMAGED";
        case "Zgubiony": return "LOST";
        case "Dowolny":
        case "":
            return undefined;
        default:
            return undefined;
    }
}

/* ===== Komponent ===== */
export default function CatalogPage() {
    // filtry
    const [q, setQ] = useState("");
    const [type, setType] = useState("Wszystkie");
    const [status, setStatus] = useState("Dowolny");
    const [location, setLocation] = useState("Dowolna");

    // wyniki
    const [results, setResults] = useState<Device[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // modal rezerwacji
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<Device | null>(null);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [busyReserve, setBusyReserve] = useState(false);

    useEffect(() => {
        // domyślnie pokaż wszystko posortowane nazwą
        void handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError(null);

            const params: any = {
                page: 0,
                size: 24,
                sort: "name,asc",
            };
            if (q.trim()) params.q = q.trim();
            if (type !== "Wszystkie") params.type = type;
            if (location !== "Dowolna") params.location = location;
            const st = uiStatusToApi(status);
            if (st) params.status = st;

            const page = await api.devices.search(params);
            setResults(page.content);
            setSearched(true);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Błąd pobierania sprzętu");
            setResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setQ("");
        setType("Wszystkie");
        setStatus("Dowolny");
        setLocation("Dowolna");
        setResults([]);
        setSearched(false);
    };

    const canReserve = (d: Device) => {
        const v = (d.status || "").toUpperCase();
        return ["DOSTĘPNY", "AVAILABLE"].includes(v);
    };

    const handleReserve = (d: Device) => {
        if (!canReserve(d)) return;
        setSelected(d);
        setDateFrom("");
        setDateTo("");
        setShowModal(true);
    };

    const confirmReserve = async () => {
        if (!selected || !dateFrom || !dateTo) return;

        // walidacje dat
        const start = new Date(dateFrom);
        const end = new Date(dateTo);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
            alert("Nieprawidłowy zakres dat.");
            return;
        }
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 14) {
            alert("⛔ Maksymalny okres rezerwacji to 14 dni.");
            return;
        }

        try {
            setBusyReserve(true);
            await addReservation({
                equipmentId: selected.id,
                dateFrom,
                dateTo,
            });
            setShowModal(false);
            setSelected(null);
            alert("✅ Rezerwacja utworzona! Sprawdź w „Moje rezerwacje”.");
        } catch (e: any) {
            alert(e?.message || "Nie udało się utworzyć rezerwacji");
        } finally {
            setBusyReserve(false);
        }
    };

    return (
        <section className="space-y-4">
            <header>
                <h1 className="text-xl font-bold">Katalog sprzętu</h1>
            </header>

            {/* Pasek wyszukiwania i filtrów */}
            <div className="rounded-xl border bg-white p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium">Szukaj</label>
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="np. Kamera Sony"
                            className="mt-2 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-2.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Typ</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-2 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-2.5"
                        >
                            <option>Wszystkie</option>
                            <option>Laptop</option>
                            <option>Kamera</option>
                            <option>Projektor</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-2 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-2.5"
                        >
                            <option>Dowolny</option>
                            <option>Dostępny</option>
                            <option>Wypożyczony</option>
                            <option>Zarezerwowany</option>
                            <option>Serwis</option>
                            <option>Uszkodzony</option>
                            <option>Zgubiony</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Lokalizacja</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-2 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-2.5"
                        >
                            <option>Dowolna</option>
                            <option>Sala 202</option>
                            <option>Sala 101</option>
                            <option>Magazyn</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleReset}
                        className="px-5 py-2.5 text-base rounded border border-slate-300 hover:bg-slate-50"
                    >
                        Wyczyść
                    </button>
                    <button
                        onClick={handleSearch}
                        className="px-5 py-2.5 text-base rounded bg-black text-white hover:bg-slate-800"
                    >
                        Szukaj
                    </button>
                </div>
            </div>

            {/* Wyniki */}
            <div className="rounded-xl border bg-white p-3">
                {loading ? (
                    <p className="text-slate-600">Wczytywanie…</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : !searched ? (
                    <p className="text-slate-600">Użyj filtrów, aby wyszukać sprzęt.</p>
                ) : results.length === 0 ? (
                    <p className="text-slate-600">Brak sprzętu dla wybranych kryteriów.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.map((eq) => (
                            <li key={eq.id} className="border rounded-lg p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{eq.name}</h3>
                                            <p className="text-sm text-slate-600">{eq.type}</p>
                                            <p className="text-xs text-slate-500 mt-1">Nr seryjny: {eq.serialNumber}</p>
                                            <p className="text-xs text-slate-500">Lokalizacja: {eq.location}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${statusPillClasses(eq.status)}`}>
                      {eq.status}
                    </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    {canReserve(eq) && (
                                        <button
                                            className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-slate-800"
                                            onClick={() => handleReserve(eq)}
                                        >
                                            Zarezerwuj
                                        </button>
                                    )}
                                    <Link
                                        to={`/equipment/${eq.id}/history`}
                                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
                                    >
                                        Historia
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal rezerwacji */}
            {showModal && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white p-5">
                        <h3 className="text-lg font-semibold mb-4">Rezerwacja: {selected.name}</h3>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Od kiedy:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-1 block w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Do kiedy:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-1 block w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-5 py-2.5 rounded border border-slate-300 hover:bg-slate-50"
                                onClick={() => setShowModal(false)}
                                disabled={busyReserve}
                            >
                                Anuluj
                            </button>
                            <button
                                className="px-5 py-2.5 rounded bg-black text-white hover:bg-slate-800 disabled:opacity-60"
                                onClick={confirmReserve}
                                disabled={busyReserve}
                            >
                                {busyReserve ? "Zapisywanie…" : "Potwierdź"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
