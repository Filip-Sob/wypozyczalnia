import { useEffect, useMemo, useState } from "react";
import {
    getReservations,
    cancelReservation,
    completeReservation,
    type Reservation,
    type ReservationStatus,
} from "../utils/reservationsStorage";

type FilterStatus = "all" | ReservationStatus;

// Etykiety dla statusów
function statusLabel(s: ReservationStatus) {
    switch (s) {
        case "scheduled":
            return "Zaplanowana";
        case "active":
            return "Aktywna";
        case "completed":
            return "Zakończona";
        case "cancelled":
            return "Anulowana";
    }
}

// Kolory „pigułek” statusu
function statusPillClasses(s: ReservationStatus) {
    switch (s) {
        case "scheduled":
            return "bg-indigo-100 text-indigo-700";
        case "active":
            return "bg-emerald-100 text-emerald-700";
        case "completed":
            return "bg-slate-100 text-slate-700";
        case "cancelled":
            return "bg-rose-100 text-rose-700";
    }
}

// Format daty YYYY-MM-DD
function fmt(dateISO: string) {
    try {
        return new Date(dateISO).toISOString().slice(0, 10);
    } catch {
        return dateISO;
    }
}

// Status wyliczany z dat (do UI). Jeśli w storage jest completed/cancelled — respektujemy to.
function deriveStatus(r: Reservation): ReservationStatus {
    if (r.status === "cancelled" || r.status === "completed") return r.status;
    const now = new Date();
    const from = new Date(r.dateFrom);
    const to = new Date(r.dateTo);
    if (now < from) return "scheduled";
    if (now >= from && now <= to) return "active";
    return "completed";
}

export default function MyReservationsPage() {
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [results, setResults] = useState<Reservation[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Auto-wczytanie listy po wejściu
    useEffect(() => {
        const list = getReservations();
        setResults(list);
        setLoaded(true);
    }, []);

    // Filtrowanie po statusie (status wyliczany „on the fly”)
    const visible = useMemo(() => {
        if (!loaded) return [];
        if (filter === "all") return results;
        return results.filter((r) => deriveStatus(r) === filter);
    }, [filter, loaded, results]);

    // Odświeżenie
    const refresh = () => {
        const list = getReservations();
        setResults(list);
        setLoaded(true);
    };

    const handleClear = () => {
        setFilter("all");
    };

    const handleCancel = (id: string) => {
        cancelReservation(id);
        refresh();
    };

    const handleReturn = (id: string) => {
        completeReservation(id);
        refresh();
    };

    return (
        <section className="space-y-4">
            <header>
                <h1 className="text-xl font-bold">Moje rezerwacje</h1>
                <p className="text-slate-600">Dane z localStorage (mock, bez backendu).</p>
            </header>

            {/* Pasek filtra i akcji */}
            <div className="rounded-xl border bg-white p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as FilterStatus)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">Wszystkie</option>
                        <option value="scheduled">Zaplanowane</option>
                        <option value="active">Aktywne</option>
                        <option value="completed">Zakończone</option>
                        <option value="cancelled">Anulowane</option>
                    </select>
                </div>

                <div className="ml-auto flex gap-2">
                    <button onClick={refresh} className="px-4 py-2 rounded bg-black text-white">
                        Odśwież
                    </button>
                    <button onClick={handleClear} className="px-4 py-2 rounded bg-black/5 text-slate-900">
                        Wyczyść filtr
                    </button>
                </div>
            </div>

            {/* Lista wyników */}
            <div className="rounded-xl border bg-white p-3">
                {!loaded ? (
                    <p className="text-slate-600">Wczytywanie…</p>
                ) : visible.length === 0 ? (
                    <p className="text-slate-600">Brak rezerwacji dla wybranych kryteriów.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visible.map((r) => {
                            const dStatus = deriveStatus(r);
                            const canCancel = dStatus === "scheduled" || dStatus === "active";
                            const canReturn = dStatus === "active";

                            return (
                                <li key={r.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{r.equipmentName}</h3>
                                            <p className="text-sm text-slate-600">
                                                Od: {fmt(r.dateFrom)} — Do: {fmt(r.dateTo)}
                                            </p>
                                            {r.location && (
                                                <p className="text-xs text-slate-500 mt-1">Lokalizacja: {r.location}</p>
                                            )}
                                            {r.serialNumber && (
                                                <p className="text-xs text-slate-500">Nr seryjny: {r.serialNumber}</p>
                                            )}
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${statusPillClasses(dStatus)}`}>
                      {statusLabel(dStatus)}
                    </span>
                                    </div>

                                    {(canCancel || canReturn) && (
                                        <div className="mt-3 flex gap-2">
                                            {canCancel && (
                                                <button
                                                    onClick={() => handleCancel(r.id)}
                                                    className="text-sm px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                                                >
                                                    Anuluj
                                                </button>
                                            )}
                                            {canReturn && (
                                                <button
                                                    onClick={() => handleReturn(r.id)}
                                                    className="text-sm px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                                >
                                                    Zwróć
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}
