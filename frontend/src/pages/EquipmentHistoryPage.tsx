// src/pages/EquipmentHistoryPage.tsx
import { useParams } from "react-router-dom";

type HistoryRecord = {
    id: string;
    user: string;
    from: string;
    to: string;
    status: "completed" | "cancelled" | "active";
};

type EquipmentHistory = {
    equipmentId: number;
    equipmentName: string;
    serial: string;
    history: HistoryRecord[];
};

// ===== Mock: przykładowe dane historii =====
const MOCK_HISTORY: EquipmentHistory[] = [
    {
        equipmentId: 1,
        equipmentName: "Laptop Dell",
        serial: "LAP-12345",
        history: [
            { id: "h1", user: "Jan Kowalski", from: "2025-09-01", to: "2025-09-05", status: "completed" },
            { id: "h2", user: "Anna Nowak", from: "2025-09-10", to: "2025-09-12", status: "cancelled" },
            { id: "h3", user: "Piotr Wiśniewski", from: "2025-09-15", to: "2025-09-20", status: "active" },
        ],
    },
    {
        equipmentId: 2,
        equipmentName: "Kamera Sony",
        serial: "CAM-98765",
        history: [
            { id: "h4", user: "Katarzyna Zielińska", from: "2025-08-20", to: "2025-08-25", status: "completed" },
            { id: "h5", user: "Jan Kowalski", from: "2025-09-05", to: "2025-09-08", status: "completed" },
        ],
    },
    {
        equipmentId: 3,
        equipmentName: "Projektor Epson",
        serial: "PRJ-55555",
        history: [
            { id: "h6", user: "Anna Nowak", from: "2025-09-01", to: "2025-09-03", status: "completed" },
            { id: "h7", user: "Marek Nowicki", from: "2025-09-12", to: "2025-09-15", status: "completed" },
        ],
    },
    // 👉 możesz dodać więcej urządzeń do mocków (docelowo backend podmieni dane)
];

function statusLabel(s: string) {
    switch (s) {
        case "completed": return "Zakończona";
        case "cancelled": return "Anulowana";
        case "active": return "Aktywna";
        default: return s;
    }
}

function statusClass(s: string) {
    switch (s) {
        case "completed": return "bg-slate-100 text-slate-700";
        case "cancelled": return "bg-rose-100 text-rose-700";
        case "active": return "bg-emerald-100 text-emerald-700";
        default: return "bg-gray-100 text-gray-700";
    }
}

export default function EquipmentHistoryPage() {
    const { id } = useParams<{ id: string }>();
    const equipment = MOCK_HISTORY.find((e) => e.equipmentId.toString() === id);

    if (!equipment) {
        return (
            <section>
                <h1 className="text-xl font-bold">Historia wypożyczeń</h1>
                <p className="text-slate-600 mt-2">Nie znaleziono sprzętu o ID: {id}</p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <header>
                <h1 className="text-2xl font-bold">Historia wypożyczeń</h1>
                <p className="text-slate-600">
                    Sprzęt: <span className="font-semibold">{equipment.equipmentName}</span> (Nr seryjny:{" "}
                    {equipment.serial})
                </p>
            </header>

            {equipment.history.length === 0 ? (
                <p className="text-slate-600">Brak historii wypożyczeń dla tego sprzętu.</p>
            ) : (
                <ul className="divide-y rounded-xl border bg-white">
                    {equipment.history.map((h) => (
                        <li key={h.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{h.user}</p>
                                <p className="text-sm text-slate-600">
                                    Od: {h.from} — Do: {h.to}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${statusClass(h.status)}`}>
                {statusLabel(h.status)}
              </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
