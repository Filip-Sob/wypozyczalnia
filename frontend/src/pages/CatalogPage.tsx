import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/** ===== Mock: dane sprzętu ===== */
type EquipmentType = "laptop" | "camera" | "projector" | "microphone" | "other";
type EquipmentStatus = "available" | "reserved" | "borrowed" | "service" | "broken";
type EquipmentLocation = "Lab1" | "Lab2" | "warehouse";

type Equipment = {
    id: number;
    name: string;
    type: EquipmentType;
    status: EquipmentStatus;
    location: EquipmentLocation;
    serial: string;
    specs: string;
};

const MOCK_DATA: Equipment[] = [
    { id: 1, name: "Laptop Dell", type: "laptop", status: "available", location: "Lab1", serial: "LAP-12345", specs: "Intel i5, 8GB RAM, 256GB SSD" },
    { id: 2, name: "Kamera Sony", type: "camera", status: "borrowed", location: "Lab2", serial: "CAM-98765", specs: "Full HD, 60fps, zoom x10" },
    { id: 3, name: "Projektor Epson", type: "projector", status: "reserved", location: "warehouse", serial: "PRJ-55555", specs: "3000 lm, 1080p" },
    { id: 4, name: "Mikrofon USB", type: "microphone", status: "available", location: "Lab2", serial: "MIC-11223", specs: "Cardioid, USB-C" },
    { id: 5, name: "Tablet Samsung", type: "other", status: "service", location: "Lab1", serial: "TAB-65432", specs: "10.5\", 128GB" },
    { id: 6, name: "Laptop Lenovo", type: "laptop", status: "broken", location: "warehouse", serial: "LAP-77777", specs: "Ryzen 5, 16GB RAM, 512GB SSD" },
];

/** ===== Pomocnicze labelki ===== */
function labelType(t: EquipmentType) {
    switch (t) {
        case "laptop": return "Laptop";
        case "camera": return "Kamera";
        case "projector": return "Projektor";
        case "microphone": return "Mikrofon";
        default: return "Inny";
    }
}
function labelStatus(s: EquipmentStatus) {
    switch (s) {
        case "available": return "Dostępny";
        case "reserved": return "Zarezerwowany";
        case "borrowed": return "Wypożyczony";
        case "service": return "Serwis";
        case "broken": return "Uszkodzony";
    }
}
function labelLocation(l: EquipmentLocation) {
    switch (l) {
        case "Lab1": return "Laboratorium 1";
        case "Lab2": return "Laboratorium 2";
        case "warehouse": return "Magazyn";
    }
}
function pillForStatus(s: EquipmentStatus) {
    switch (s) {
        case "available": return "bg-emerald-100 text-emerald-700";
        case "reserved": return "bg-amber-100 text-amber-700";
        case "borrowed": return "bg-blue-100 text-blue-700";
        case "service": return "bg-purple-100 text-purple-700";
        case "broken": return "bg-rose-100 text-rose-700";
    }
}

/** ===== Komponent główny: Katalog ===== */
export default function CatalogPage() {
    // Filtry
    const [q, setQ] = useState("");
    const [type, setType] = useState<EquipmentType | "all">("all");
    const [status, setStatus] = useState<EquipmentStatus | "any">("any");
    const [location, setLocation] = useState<EquipmentLocation | "any">("any");

    // Wyniki pokazujemy DOPIERO po kliknięciu "Szukaj"
    const [allowShow, setAllowShow] = useState(false);

    // Modal rezerwacji
    const [reserveItem, setReserveItem] = useState<Equipment | null>(null);
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const MAX_DAYS = 14;

    const onSearch = () => setAllowShow(true);
    const onClear = () => {
        setQ("");
        setType("all");
        setStatus("any");
        setLocation("any");
        setAllowShow(false);
    };

    const results = useMemo(() => {
        if (!allowShow) return [];
        return MOCK_DATA.filter((it) => {
            const matchesQuery = !q || `${it.name} ${it.serial} ${it.specs}`.toLowerCase().includes(q.toLowerCase());
            const matchesType = type === "all" || it.type === type;
            const matchesStatus = status === "any" || it.status === status;
            const matchesLocation = location === "any" || it.location === location;
            return matchesQuery && matchesType && matchesStatus && matchesLocation;
        });
    }, [allowShow, q, type, status, location]);

    const openReserve = (item: Equipment) => {
        setReserveItem(item);
        setDateFrom("");
        setDateTo("");
    };
    const closeReserve = () => {
        setReserveItem(null);
        setDateFrom("");
        setDateTo("");
    };

    // prosta walidacja dat
    const daysBetween = (a: string, b: string) => {
        if (!a || !b) return 0;
        return Math.round((+new Date(b) - +new Date(a)) / (1000 * 60 * 60 * 24));
    };

    const canConfirm =
        !!dateFrom &&
        !!dateTo &&
        new Date(dateTo) >= new Date(dateFrom) &&
        daysBetween(dateFrom, dateTo) <= MAX_DAYS;

    const confirmReservation = () => {
        if (!reserveItem) return;
        console.log("REZERWACJA →", {
            itemId: reserveItem.id,
            name: reserveItem.name,
            from: dateFrom,
            to: dateTo,
        });
        alert(`Zarezerwowano: ${reserveItem.name}\nOd: ${dateFrom}\nDo: ${dateTo}`);
        closeReserve();
    };

    return (
        <section className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Katalog sprzętu</h1>
            <p className="text-slate-600">
                Wyszukuj i filtruj zasoby. (Na razie mock; backend podepniemy później).
            </p>

            {/* Pasek filtrów */}
            <div className="rounded-xl border bg-white p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Szukaj</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. Kamera Sony"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Typ</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={type}
                            onChange={(e) => setType(e.target.value as EquipmentType | "all")}
                        >
                            <option value="all">Wszystkie</option>
                            <option value="laptop">Laptop</option>
                            <option value="camera">Kamera</option>
                            <option value="projector">Projektor</option>
                            <option value="microphone">Mikrofon</option>
                            <option value="other">Inny</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as EquipmentStatus | "any")}
                        >
                            <option value="any">Dowolny</option>
                            <option value="available">Dostępny</option>
                            <option value="reserved">Zarezerwowany</option>
                            <option value="borrowed">Wypożyczony</option>
                            <option value="service">Serwis</option>
                            <option value="broken">Uszkodzony</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Lokalizacja</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={location}
                            onChange={(e) => setLocation(e.target.value as EquipmentLocation | "any")}
                        >
                            <option value="any">Dowolna</option>
                            <option value="Lab1">Laboratorium 1</option>
                            <option value="Lab2">Laboratorium 2</option>
                            <option value="warehouse">Magazyn</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClear}
                        className="rounded bg-black/5 text-slate-900 px-4 py-2"
                    >
                        Wyczyść
                    </button>
                    <button
                        onClick={onSearch}
                        className="rounded bg-black text-white px-4 py-2"
                    >
                        Szukaj
                    </button>
                </div>
            </div>

            {/* Wyniki */}
            {!allowShow ? (
                <div className="rounded-xl border bg-white p-3 text-slate-600">
                    Brak wyników (mock). Kliknij „Szukaj”, aby wyszukać sprzęt.
                </div>
            ) : results.length === 0 ? (
                <div className="rounded-xl border bg-white p-3 text-slate-600">
                    Nic nie znaleziono dla wybranych filtrów.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {results.map((it) => {
                        const available = it.status === "available";
                        return (
                            <div key={it.id} className="rounded-xl border bg-white p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{it.name}</h3>
                                        <p className="text-slate-500 text-sm">{labelType(it.type)}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded ${pillForStatus(it.status)}`}>
                                        {labelStatus(it.status)}
                                    </span>
                                </div>

                                <ul className="text-sm text-slate-700 space-y-1">
                                    <li><span className="text-slate-500">Lokalizacja:</span> {labelLocation(it.location)}</li>
                                    <li><span className="text-slate-500">Nr seryjny:</span> {it.serial}</li>
                                    <li><span className="text-slate-500">Specyfikacja:</span> {it.specs}</li>
                                </ul>

                                <div className="pt-2 flex gap-2">
                                    {available ? (
                                        <button
                                            onClick={() => openReserve(it)}
                                            className="rounded bg-black text-white px-4 py-2"
                                        >
                                            Zarezerwuj
                                        </button>
                                    ) : (
                                        <span className="inline-block rounded bg-slate-200 text-slate-700 px-3 py-1 text-sm">
                                            Niedostępny
                                        </span>
                                    )}

                                    {/* 🔹 Nowy przycisk Historia */}
                                    <Link
                                        to={`/history/${it.id}`}
                                        className="rounded bg-slate-700 text-white px-4 py-2 hover:bg-slate-900"
                                    >
                                        Historia
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ===== Modal rezerwacji ===== */}
            {reserveItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={closeReserve} />
                    <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white p-5">
                        <h3 className="text-lg font-semibold mb-1">Rezerwacja</h3>
                        <p className="text-slate-600 mb-4">
                            Sprzęt: <span className="font-medium">{reserveItem.name}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Od</label>
                                <input
                                    type="date"
                                    className="w-full rounded border px-3 py-2"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Do</label>
                                <input
                                    type="date"
                                    className="w-full rounded border px-3 py-2"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    min={dateFrom || undefined}
                                />
                            </div>
                        </div>

                        <div className="mt-3 text-sm">
                            {dateFrom && dateTo && new Date(dateTo) < new Date(dateFrom) && (
                                <p className="text-rose-600">Data „Do” nie może być wcześniejsza niż „Od”.</p>
                            )}
                            {dateFrom && dateTo && daysBetween(dateFrom, dateTo) > MAX_DAYS && (
                                <p className="text-rose-600">
                                    Maksymalny czas wypożyczenia to {MAX_DAYS} dni.
                                </p>
                            )}
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={closeReserve}
                                className="rounded bg-black/5 text-slate-900 px-4 py-2"
                            >
                                Anuluj
                            </button>
                            <button
                                disabled={!canConfirm}
                                onClick={confirmReservation}
                                className={`rounded px-4 py-2 text-white ${canConfirm ? "bg-black" : "bg-slate-400 cursor-not-allowed"}`}
                            >
                                Potwierdź
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
