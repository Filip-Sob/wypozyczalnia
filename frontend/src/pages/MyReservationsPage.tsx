import { useState } from "react";

type ReservationStatus = "upcoming" | "active" | "returned" | "canceled";

type Reservation = {
    id: number;
    equipmentName: string;
    from: string; // ISO date
    to: string;   // ISO date
    status: ReservationStatus;
};

const MOCK_RESERVATIONS: Reservation[] = [
    { id: 1, equipmentName: "Laptop Dell",    from: "2025-09-20", to: "2025-09-25", status: "upcoming" },
    { id: 2, equipmentName: "Kamera Sony",    from: "2025-09-10", to: "2025-09-15", status: "returned" },
    { id: 3, equipmentName: "Mikrofon USB",   from: "2025-09-16", to: "2025-09-19", status: "active" },
    { id: 4, equipmentName: "Projektor Epson",from: "2025-08-28", to: "2025-08-30", status: "canceled" },
];

function statusLabel(s: ReservationStatus) {
    switch (s) {
        case "upcoming": return "Zaplanowana";
        case "active":   return "Aktywna";
        case "returned": return "Zwrócona";
        case "canceled": return "Anulowana";
    }
}

function statusPillClasses(s: ReservationStatus) {
    switch (s) {
        case "upcoming": return "bg-indigo-100 text-indigo-700";
        case "active":   return "bg-emerald-100 text-emerald-700";
        case "returned": return "bg-slate-100 text-slate-700";
        case "canceled": return "bg-rose-100 text-rose-700";
    }
}

export default function MyReservationsPage() {
    const [pendingStatus, setPendingStatus] = useState<"all" | ReservationStatus>("all");
    const [hasLoaded, setHasLoaded] = useState(false);
    const [results, setResults] = useState<Reservation[]>([]);

    const handleFetch = () => {
        const filtered =
            pendingStatus === "all"
                ? MOCK_RESERVATIONS
                : MOCK_RESERVATIONS.filter(r => r.status === pendingStatus);

        setResults(filtered);
        setHasLoaded(true);
    };

    const handleClear = () => {
        setPendingStatus("all");
        setResults([]);
        setHasLoaded(false);
    };

    return (
        <section className="space-y-4">
            <header>
                <h1 className="text-xl font-bold">Moje rezerwacje</h1>
                <p className="text-slate-600">Przeglądaj i zarządzaj swoimi rezerwacjami (mock).</p>
            </header>

            {/* Pasek filtra i akcji */}
            <div className="rounded-xl border bg-white p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        value={pendingStatus}
                        onChange={(e) => setPendingStatus(e.target.value as any)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">Wszystkie</option>
                        <option value="upcoming">Zaplanowane</option>
                        <option value="active">Aktywne</option>
                        <option value="returned">Zwrócone</option>
                        <option value="canceled">Anulowane</option>
                    </select>
                </div>

                <div className="ml-auto flex gap-2">
                    <button onClick={handleClear} className="px-4 py-2 rounded bg-black/5 text-slate-900">
                        Wyczyść
                    </button>
                    <button onClick={handleFetch} className="px-4 py-2 rounded bg-black text-white">
                        Pokaż
                    </button>
                </div>
            </div>

            {/* Lista wyników */}
            <div className="rounded-xl border bg-white p-3">
                {!hasLoaded ? (
                    <p className="text-slate-600">Kliknij „Pokaż”, aby wczytać rezerwacje.</p>
                ) : results.length === 0 ? (
                    <p className="text-slate-600">Brak rezerwacji dla wybranych kryteriów.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.map((r) => (
                            <li key={r.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{r.equipmentName}</h3>
                                        <p className="text-sm text-slate-600">
                                            Od: {r.from} — Do: {r.to}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${statusPillClasses(r.status)}`}>
                    {statusLabel(r.status)}
                  </span>
                                </div>

                                {(r.status === "upcoming" || r.status === "active") && (
                                    <div className="mt-3">
                                        <button
                                            onClick={() => alert("Mock: anulowanie rezerwacji")}
                                            className="text-sm px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                                        >
                                            Anuluj
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
