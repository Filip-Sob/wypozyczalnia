// src/pages/EquipmentDetailsPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../utils/api";
import { addReservation } from "../utils/reservationsStorage";
import Button from "../components/ui/Button";

type Device = {
    id: number;
    name: string;
    type: string;
    serialNumber: string;
    location: string;
    status: string; // BE zwraca enum: AVAILABLE / BORROWED / RESERVED
};

// mapowanie statusu BE -> polski tekst + kolory
function statusLabel(s: string) {
    switch (s) {
        case "AVAILABLE": return "Dostępny";
        case "BORROWED": return "Wypożyczony";
        case "RESERVED": return "Zarezerwowany";
        default: return s;
    }
}
function statusClass(s: string) {
    switch (s) {
        case "AVAILABLE": return "bg-emerald-100 text-emerald-700";
        case "BORROWED": return "bg-indigo-100 text-indigo-700";
        case "RESERVED": return "bg-amber-100 text-amber-700";
        default: return "bg-slate-100 text-slate-700";
    }
}

export default function EquipmentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // modal rezerwacji
    const [showModal, setShowModal] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        if (!id) return;
        api.devices.getById(Number(id))
            .then(setDevice)
            .catch(err => {
                console.error(err);
                setError("Nie udało się pobrać szczegółów urządzenia");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const confirmReserve = async () => {
        if (!device || !dateFrom || !dateTo) return;

        const diffDays =
            (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) /
            (1000 * 60 * 60 * 24);

        if (diffDays > 14) {
            alert("⛔ Maksymalny okres rezerwacji to 14 dni.");
            return;
        }

        try {
            await addReservation({
                equipmentId: device.id,
                dateFrom,
                dateTo,
            });
            alert("✅ Rezerwacja zapisana! Sprawdź w 'Moje rezerwacje'.");
            setShowModal(false);
            setDateFrom("");
            setDateTo("");
        } catch (err) {
            console.error(err);
            alert("❌ Błąd przy rezerwacji");
        }
    };

    if (loading) {
        return <p className="p-6 text-center">⏳ Ładowanie...</p>;
    }
    if (error) {
        return <p className="p-6 text-center text-red-600">{error}</p>;
    }
    if (!device) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-600">Nie znaleziono sprzętu</h2>
                <Link to="/catalog" className="text-blue-600 hover:underline mt-4 block">
                    Wróć do katalogu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-4">{device.name}</h1>
            <ul className="space-y-2 text-slate-700">
                <li><strong>Typ:</strong> {device.type}</li>
                <li>
                    <strong>Status:</strong>{" "}
                    <span className={`px-2 py-1 rounded text-sm ${statusClass(device.status)}`}>
            {statusLabel(device.status)}
          </span>
                </li>
                <li><strong>Lokalizacja:</strong> {device.location}</li>
                <li><strong>Numer seryjny:</strong> {device.serialNumber}</li>
            </ul>

            {device.status === "AVAILABLE" ? (
                <Button className="mt-6 w-full" onClick={() => setShowModal(true)}>
                    Zarezerwuj
                </Button>
            ) : (
                <p className="mt-6 text-red-500 font-medium">
                    Ten sprzęt nie jest dostępny do rezerwacji
                </p>
            )}

            <Link to="/catalog" className="block mt-4 text-blue-600 hover:underline text-center">
                ← Powrót do katalogu
            </Link>

            {/* Modal rezerwacji */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white p-5">
                        <h3 className="text-lg font-semibold mb-4">Rezerwacja: {device.name}</h3>

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
                            <Button variant="outline" onClick={() => setShowModal(false)}>
                                Anuluj
                            </Button>
                            <Button onClick={confirmReserve}>Potwierdź</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
