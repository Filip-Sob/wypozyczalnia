// src/pages/EquipmentHistoryPage.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { api, type Loan } from "../utils/api";
import {
    getReservations,
    type Reservation,
} from "../utils/reservationsStorage";

// ====== Typ połączony ======
type HistoryEntry = {
    id: string;
    type: "reservation" | "loan";
    from: string;
    to: string;
    status: string;
    notes?: string;
};

// ====== Pomocnicze formatowanie ======
function fmt(dateISO: string) {
    try {
        return new Date(dateISO).toISOString().slice(0, 10);
    } catch {
        return dateISO;
    }
}

// Mapowanie statusów
function statusLabel(e: HistoryEntry) {
    if (e.type === "reservation") {
        switch (e.status) {
            case "scheduled": return "Zaplanowana";
            case "active": return "Aktywna";
            case "completed": return "Zakończona";
            case "cancelled": return "Anulowana";
            default: return e.status;
        }
    } else {
        // loan
        switch (e.status.toUpperCase()) {
            case "ACTIVE": return "Aktywne wypożyczenie";
            case "RETURNED": return "Zwrócone";
            case "OVERDUE": return "Przeterminowane";
            default: return e.status;
        }
    }
}

export default function EquipmentHistoryPage() {
    const { id } = useParams<{ id: string }>();
    const equipmentId = Number(id);

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);

    // ====== Pobieranie danych ======
    useEffect(() => {
        if (!equipmentId || Number.isNaN(equipmentId)) return;

        async function fetchData() {
            try {
                // rezerwacje
                const resData = await getReservations({ deviceId: equipmentId });
                setReservations(resData);

                // wypożyczenia
                const loanPage = await api.loans.historyByDevice(equipmentId, { size: 50 });
                setLoans(loanPage.content || []);
            } catch (err) {
                console.error("Błąd pobierania historii:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [equipmentId]);

    // ====== Połączenie obu źródeł ======
    const history: HistoryEntry[] = useMemo(() => {
        const resEntries: HistoryEntry[] = reservations.map(r => ({
            id: r.id,
            type: "reservation",
            from: r.dateFrom,
            to: r.dateTo,
            status: r.status,
            notes: r.returnNotes,
        }));

        const loanEntries: HistoryEntry[] = loans.map(l => ({
            id: String(l.id),
            type: "loan",
            from: l.startDate,
            to: l.dueDate,
            status: l.status,
            notes: l.returnNote ?? undefined,
        }));

        return [...resEntries, ...loanEntries].sort(
            (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
        );
    }, [reservations, loans]);

    // ====== Widoki ======
    if (!id || Number.isNaN(equipmentId)) {
        return (
            <section className="p-6">
                <h1 className="text-xl font-bold">Błąd</h1>
                <p>Nieprawidłowy identyfikator sprzętu.</p>
                <Link to="/catalog" className="text-indigo-600 hover:underline">
                    Wróć do katalogu
                </Link>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="p-6">
                <p className="text-slate-600">Wczytywanie historii…</p>
            </section>
        );
    }

    if (history.length === 0) {
        return (
            <section className="p-6">
                <h1 className="text-2xl font-bold">Historia wypożyczeń i rezerwacji</h1>
                <p className="text-slate-600">Brak historii dla tego sprzętu.</p>
                <Link
                    to="/catalog"
                    className="inline-block mt-4 px-4 py-2 rounded bg-black text-white hover:bg-slate-800"
                >
                    Wróć do katalogu
                </Link>
            </section>
        );
    }

    return (
        <section className="space-y-4 p-6">
            <header>
                <h1 className="text-2xl font-bold">Historia sprzętu #{equipmentId}</h1>
                <p className="text-slate-600">
                    Wszystkie rezerwacje i wypożyczenia powiązane z tym urządzeniem.
                </p>
            </header>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 text-sm text-slate-700">
                    <tr>
                        <th className="px-3 py-2 border">Od</th>
                        <th className="px-3 py-2 border">Do</th>
                        <th className="px-3 py-2 border">Rodzaj</th>
                        <th className="px-3 py-2 border">Status</th>
                        <th className="px-3 py-2 border">Uwagi</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {history.map((h) => (
                        <tr key={`${h.type}-${h.id}`} className="hover:bg-slate-50">
                            <td className="px-3 py-2 border">{fmt(h.from)}</td>
                            <td className="px-3 py-2 border">{fmt(h.to)}</td>
                            <td className="px-3 py-2 border">
                                {h.type === "reservation" ? "Rezerwacja" : "Wypożyczenie"}
                            </td>
                            <td className="px-3 py-2 border">{statusLabel(h)}</td>
                            <td className="px-3 py-2 border text-slate-600 italic">
                                {h.notes ?? "—"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Link
                to="/catalog"
                className="inline-block mt-4 px-4 py-2 rounded bg-black text-white hover:bg-slate-800"
            >
                Wróć do katalogu
            </Link>
        </section>
    );
}
