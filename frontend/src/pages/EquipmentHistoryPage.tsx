// src/pages/EquipmentHistoryPage.tsx
import { useParams, Link } from "react-router-dom";
import { getReservations, type Reservation } from "../utils/reservationsStorage";
import { useMemo } from "react";

// Formatowanie daty
function fmt(dateISO: string) {
    try {
        return new Date(dateISO).toISOString().slice(0, 10);
    } catch {
        return dateISO;
    }
}

// Mapowanie statusów na etykiety PL
function statusLabel(s: Reservation["status"]) {
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

export default function EquipmentHistoryPage() {
    const { id } = useParams<{ id: string }>();
    const equipmentId = Number(id);

    // pobranie rezerwacji z localStorage dla danego urządzenia
    const history = useMemo(() => {
        return getReservations().filter((r) => r.equipmentId === equipmentId);
    }, [equipmentId]);

    if (!id || Number.isNaN(equipmentId)) {
        return (
            <section className="p-6">
                <h1 className="text-xl font-bold">Błąd</h1>
                <p>Nieprawidłowy identyfikator sprzętu.</p>
                <Link to="/" className="text-indigo-600 hover:underline">
                    Wróć do katalogu
                </Link>
            </section>
        );
    }

    if (history.length === 0) {
        return (
            <section className="p-6">
                <h1 className="text-2xl font-bold">Historia wypożyczeń</h1>
                <p className="text-slate-600">Brak historii dla tego sprzętu.</p>
                <Link
                    to="/"
                    className="inline-block mt-4 px-4 py-2 rounded bg-black text-white hover:bg-slate-800"
                >
                    Wróć do katalogu
                </Link>
            </section>
        );
    }

    const equipmentName = history[0].equipmentName;

    return (
        <section className="space-y-4 p-6">
            <header>
                <h1 className="text-2xl font-bold">Historia: {equipmentName}</h1>
                <p className="text-slate-600">
                    Wszystkie rezerwacje dla tego urządzenia.
                </p>
            </header>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 text-sm text-slate-700">
                    <tr>
                        <th className="px-3 py-2 border">Od</th>
                        <th className="px-3 py-2 border">Do</th>
                        <th className="px-3 py-2 border">Status</th>
                        <th className="px-3 py-2 border">Uwagi</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {history.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 border">{fmt(r.dateFrom)}</td>
                            <td className="px-3 py-2 border">{fmt(r.dateTo)}</td>
                            <td className="px-3 py-2 border">{statusLabel(r.status)}</td>
                            <td className="px-3 py-2 border text-slate-600 italic">
                                {r.returnNotes ?? "—"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Link
                to="/"
                className="inline-block mt-4 px-4 py-2 rounded bg-black text-white hover:bg-slate-800"
            >
                Wróć do katalogu
            </Link>
        </section>
    );
}
