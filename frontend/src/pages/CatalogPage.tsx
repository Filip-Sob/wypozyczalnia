// src/pages/CatalogPage.tsx
import { useState } from "react";
import Button from "../components/ui/Button";
import { addReservation } from "../utils/reservationsStorage";
import { Laptop, Video, Projector } from "lucide-react"; // ikonki

type Equipment = {
    id: number;
    name: string;
    type: "Laptop" | "Kamera" | "Projektor";
    specification: string;
    serialNumber: string;
    location: string;
    status: "Dostępny" | "Wypożyczony" | "Zarezerwowany";
};

const MOCK_DATA: Equipment[] = [
    {
        id: 1,
        name: "Laptop Dell",
        type: "Laptop",
        specification: "Intel i5, 8GB RAM, 256GB SSD",
        serialNumber: "LAP-12345",
        location: "Laboratorium 1",
        status: "Dostępny",
    },
    {
        id: 2,
        name: "Kamera Sony",
        type: "Kamera",
        specification: "Full HD, 60fps, zoom x10",
        serialNumber: "CAM-98765",
        location: "Laboratorium 2",
        status: "Wypożyczony",
    },
    {
        id: 3,
        name: "Projektor Epson",
        type: "Projektor",
        specification: "3000 lm, 1080p",
        serialNumber: "PRJ-55555",
        location: "Magazyn",
        status: "Zarezerwowany",
    },
];

// === Mapowanie statusu na wygląd pigułki ===
function statusPillClasses(status: Equipment["status"]) {
    switch (status) {
        case "Dostępny":
            return "bg-emerald-100 text-emerald-700";
        case "Wypożyczony":
            return "bg-indigo-100 text-indigo-700";
        case "Zarezerwowany":
            return "bg-amber-100 text-amber-700";
    }
}

// === Mapowanie typów na ikonki ===
function equipmentIcon(type: Equipment["type"]) {
    switch (type) {
        case "Laptop":
            return <Laptop className="w-6 h-6 text-slate-600" />;
        case "Kamera":
            return <Video className="w-6 h-6 text-slate-600" />;
        case "Projektor":
            return <Projector className="w-6 h-6 text-slate-600" />;
        default:
            return null;
    }
}

export default function CatalogPage() {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("Wszystkie");
    const [status, setStatus] = useState("Dowolny");
    const [location, setLocation] = useState("Dowolna");

    const [results, setResults] = useState<Equipment[]>([]);
    const [searched, setSearched] = useState(false); // 👈 kontrola wyświetlania listy

    // modal rezerwacji
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<Equipment | null>(null);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const handleSearch = () => {
        let filtered = MOCK_DATA;

        if (search) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (type !== "Wszystkie") {
            filtered = filtered.filter((item) => item.type === type);
        }
        if (status !== "Dowolny") {
            filtered = filtered.filter((item) => item.status === status);
        }
        if (location !== "Dowolna") {
            filtered = filtered.filter((item) => item.location === location);
        }

        setResults(filtered);
        setSearched(true);
    };

    const handleReset = () => {
        setSearch("");
        setType("Wszystkie");
        setStatus("Dowolny");
        setLocation("Dowolna");
        setResults([]);
        setSearched(false);
    };

    const handleReserve = (eq: Equipment) => {
        setSelected(eq);
        setDateFrom("");
        setDateTo("");
        setShowModal(true);
    };

    const confirmReserve = () => {
        if (!selected || !dateFrom || !dateTo) return;
        const diffDays =
            (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) /
            (1000 * 60 * 60 * 24);

        if (diffDays > 14) {
            alert("⛔ Maksymalny okres rezerwacji to 14 dni.");
            return;
        }

        addReservation({
            equipmentId: selected.id,
            equipmentName: selected.name,
            equipmentType: selected.type,
            serialNumber: selected.serialNumber,
            location: selected.location,
            dateFrom,
            dateTo,
        });

        setShowModal(false);
        setSelected(null);
        alert("✅ Rezerwacja zapisana! Sprawdź w 'Moje rezerwacje'.");
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                            <option>Laboratorium 1</option>
                            <option>Laboratorium 2</option>
                            <option>Magazyn</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="px-5 py-2.5 text-base" onClick={handleReset}>
                        Wyczyść
                    </Button>
                    <Button className="px-5 py-2.5 text-base" onClick={handleSearch}>
                        Szukaj
                    </Button>
                </div>
            </div>

            {/* Lista sprzętu */}
            {searched && (
                <div className="rounded-xl border bg-white p-3">
                    {results.length === 0 ? (
                        <p className="text-slate-600">Brak sprzętu dla wybranych kryteriów.</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {results.map((eq) => (
                                <li key={eq.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-2">
                                            {equipmentIcon(eq.type)}
                                            <div>
                                                <h3 className="font-semibold">{eq.name}</h3>
                                                <p className="text-sm text-slate-600">{eq.type}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Specyfikacja: {eq.specification}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Nr seryjny: {eq.serialNumber}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Lokalizacja: {eq.location}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${statusPillClasses(eq.status)}`}
                                        >
                      {eq.status}
                    </span>
                                    </div>

                                    {eq.status === "Dostępny" && (
                                        <div className="mt-3">
                                            <Button className="px-3 py-1 text-sm" onClick={() => handleReserve(eq)}>
                                                Zarezerwuj
                                            </Button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Modal rezerwacji */}
            {showModal && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white p-5">
                        <h3 className="text-lg font-semibold mb-4">
                            Rezerwacja: {selected.name}
                        </h3>

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
                            <Button
                                variant="outline"
                                className="px-5 py-2.5 text-base"
                                onClick={() => setShowModal(false)}
                            >
                                Anuluj
                            </Button>
                            <Button
                                className="px-5 py-2.5 text-base"
                                onClick={confirmReserve}
                            >
                                Potwierdź
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
}
