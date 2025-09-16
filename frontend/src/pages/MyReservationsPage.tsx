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

    // Posortowane po dacie OD (rosnąco)
    const sorted = useMemo(() => {
        return [...results].sort(
            (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
        );
    }, [results]);

    // Filtrowanie po statusie (status wyliczany „on the fly”)
    const visible = useMemo(() => {
        if (!loaded) return [];
        if (filter === "all") return sorted;
        return sorted.filter((r) => deriveStatus(r) === filter);
    }, [filter, loaded, sorted]);

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

    // ===== Eksport CSV =====
    const exportCsv = () => {
        const rows = visible.map((r) => {
            const st = deriveStatus(r);
            return {
                id: r.id,
                equipmentId: r.equipmentId,
                equipmentName: r.equipmentName,
                equipmentType: r.equipmentType ?? "",
                serialNumber: r.serialNumber ?? "",
                location: r.location ?? "",
                dateFrom: fmt(r.dateFrom),
                dateTo: fmt(r.dateTo),
                status: statusLabel(st),
                createdAt: fmt(r.createdAt),
            };
        });

        const header = [
            "id",
            "equipmentId",
            "equipmentName",
            "equipmentType",
            "serialNumber",
            "location",
            "dateFrom",
            "dateTo",
            "status",
            "createdAt",
        ];

        const escape = (val: unknown) => {
            const s = String(val ?? "");
            const escaped = s.replace(/"/g, '""');
            return `"${escaped}"`;
        };

        const csv =
            header.join(",") +
            "\n" +
            rows.map((row) => header.map((h) => escape((row as any)[h])).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-reservations.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ===== Eksport PDF (jsPDF + autoTable) =====
    const exportPdf = async () => {
        const [{ default: jsPDF }, autoTableModule] = await Promise.all([
            import("jspdf"),
            import("jspdf-autotable"),
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const autoTable = (autoTableModule as any).default || (autoTableModule as any);

        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

        const title = "My Reservations";
        const subtitle =
            filter === "all" ? "All statuses" : `Status: ${statusLabel(filter as ReservationStatus)}`;
        const generated = new Date().toLocaleString();

        doc.setFontSize(16);
        doc.text(title, 40, 40);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${subtitle} • Generated: ${generated}`, 40, 58);
        doc.setTextColor(15);

        const head = [["#", "Equipment", "Type", "Serial no.", "Location", "From", "To", "Status"]];

        const body = visible.map((r, idx) => {
            const st = deriveStatus(r);
            return [
                String(idx + 1),
                r.equipmentName,
                r.equipmentType ?? "",
                r.serialNumber ?? "",
                r.location ?? "",
                fmt(r.dateFrom),
                fmt(r.dateTo),
                statusLabel(st),
            ];
        });

        autoTable(doc, {
            head,
            body,
            startY: 80,
            styles: { fontSize: 9, cellPadding: 6 },
            headStyles: { fillColor: [248, 250, 252], textColor: 15 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            // nie używamy parametru, więc bez 'data' -> brak TS6133
            didDrawPage: () => {
                doc.setFontSize(9);
                doc.setTextColor(120);
                const footer = `© ${new Date().getFullYear()} — UniRent (frontend export)`;
                doc.text(footer, 40, doc.internal.pageSize.getHeight() - 24);
                doc.setTextColor(15);
            },
            margin: { left: 40, right: 40 },
        });

        doc.save("my-reservations.pdf");
    };

    return (
        <section className="space-y-4">
            <header>
                <h1 className="text-xl font-bold">Moje rezerwacje</h1>
                <p className="text-slate-600">Dane z localStorage (frontend-only).</p>
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
                    <button onClick={exportPdf} className="px-4 py-2 rounded bg-indigo-700 text-white">
                        Eksport PDF
                    </button>
                    <button onClick={exportCsv} className="px-4 py-2 rounded bg-slate-800 text-white">
                        Eksport CSV
                    </button>
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
