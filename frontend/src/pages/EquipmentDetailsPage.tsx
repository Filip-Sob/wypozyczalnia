import { useParams, Link } from "react-router-dom";

type Equipment = {
    id: number;
    name: string;
    type: string;
    status: string;
    location: string;
    serial?: string;
};

// Tymczasowe mocki (docelowo dane będą z backendu)
const mockData: Equipment[] = [
    { id: 1, name: "Laptop Dell", type: "laptop", status: "available", location: "lab1", serial: "LAP12345" },
    { id: 2, name: "Kamera Sony", type: "camera", status: "borrowed", location: "lab2", serial: "CAM98765" },
    { id: 3, name: "Projektor Epson", type: "projector", status: "reserved", location: "warehouse", serial: "PRJ55555" },
];

export default function EquipmentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const equipment = mockData.find((e) => e.id === Number(id));

    if (!equipment) {
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
            <h1 className="text-3xl font-bold mb-4">{equipment.name}</h1>
            <ul className="space-y-2 text-slate-700">
                <li><strong>Typ:</strong> {equipment.type}</li>
                <li><strong>Status:</strong> {equipment.status}</li>
                <li><strong>Lokalizacja:</strong> {equipment.location}</li>
                <li><strong>Numer seryjny:</strong> {equipment.serial}</li>
            </ul>

            {equipment.status === "available" ? (
                <button className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-slate-800">
                    Zarezerwuj
                </button>
            ) : (
                <p className="mt-6 text-red-500 font-medium">Ten sprzęt nie jest dostępny do rezerwacji</p>
            )}

            <Link to="/catalog" className="block mt-4 text-blue-600 hover:underline text-center">
                ← Powrót do katalogu
            </Link>
        </div>
    );
}
