// src/pages/CatalogPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { addReservation } from "../utils/reservationsStorage";
import { api, type Device } from "../utils/api";
import { Laptop, Video, Projector } from "lucide-react";

/** Mapowanie statusów BE -> label PL */
function statusLabelPL(status?: string) {
    switch ((status || "").toUpperCase()) {
        case "AVAILABLE": return "Dostępny";
        case "RESERVED":  return "Zarezerwowany";
        case "LOANED":    return "Wypożyczony";
        case "SERVICE":   return "Serwis";
        case "DAMAGED":   return "Uszkodzony";
        default:          return status || "—";
    }
}

/** Pigułki statusu (po PL labelu) */
function statusPillClassesPL(label: string) {
    switch (label) {
        case "Dostępny":      return "bg-emerald-100 text-emerald-700";
        case "Zarezerwowany": return "bg-amber-100 text-amber-700";
        case "Wypożyczony":   return "bg-indigo-100 text-indigo-700";
        case "Serwis":        return "bg-slate-100 text-slate-700";
        case "Uszkodzony":    return "bg-rose-100 text-rose-700";
        default:              return "bg-slate-100 text-slate-700";
    }
}

/** Mapowanie wyboru z selecta (PL) -> status BE (EN) do filtra */
function filterPLtoApiStatus(val: string): string | undefined {
    switch (val) {
        case "Dostępny":      return "AVAILABLE";
        case "Zarezerwowany": return "RESERVED";
        case "Wypożyczony":   return "LOANED";
        case "Serwis":        return "SERVICE";
        case "Uszkodzony":    return "DAMAGED";
        case "Dowolny":
        default:
            return undefined;
    }
}

/** Ikony według typu (opcjonalnie) */
function equipmentIcon(type?: string) {
    const t = (type || "").toLowerCase();
    if (t.includes("laptop")) return <Laptop className="w-6 h-6 text-slate-600" />;
    if (t.includes("kamer"))  return <Video className="w-6 h-6 text-slate-600" />;
    if (t.includes("projekt"))return <Projector className="w-6 h-6 text-slate-600" />;
    return null;
}

export default function CatalogPage() {
    // filtry
    const [search, setSearch]   = useState("");
    const [type, setType]       = useState("Wszystkie");
    const [status, setStatus]   = useState("Dowolny");
    const [location, setLocation] = useState("Dowolna");

    // dane
    const [results, setResults] = useState<Device[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // modal rezerwacji
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<Device | null>(null);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [busyId, setBusyId] = useState<number | null>(null);

    // wczytaj pierwszą stronę na start (opcjonalnie)
    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async () => {
        try {
            setErr("");
            setLoading(true);
            const page = await api.devices.search({
                q: search || undefined,
                type: type !== "Wszystkie" ? type : undefined,
                location: location !== "Dowolna" ? location : undefined,
                status: filterPLtoApiStatus(status),
                page: 0,
                size: 24,
                sort: "name,asc",
            });
            setResults(page.content);
            setSearched(true);
        } catch (e: any) {
            setErr(e?.message || "Błąd pobierania urządzeń");
            setResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearch("");
        setType("Wszystkie");
        setStatus("Dowolny");
        setLocation("Dowolna");
        setResults([]);
        setSearched(false);
        setErr("");
    };

    const handleReserve = (eq: Device) => {
        setSelected(eq);
        setDateFrom("");
        setDateTo("");
        setShowModal(true);
    };

    const confirmReserve = async () => {
        if (!selected || !dateFrom || !dateTo) return;

        const ms = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
        const diffDays = ms / (1000 * 60 * 60 * 24);
        if (diffDays > 14) {
            alert("⛔ Maksymalny okres rezerwacji to 14 dni.");
            return;
        }

        try {
            setBusyId(selected.id);
            await addReservation({
                equipmentId: selected.id,
                dateFrom,
                dateTo,
            });
            setShowModal(false);
            setSelected(null);
            alert("✅ Rezerwacja utworzona! Sprawdź w „Moje rezerwacje”.");
        } catch (e: any) {
            alert(e?.message || "Błąd tworzenia rezerwacji");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="space-y-4">
            <header>
                <h1 className="text-xl font-bold">Katalog sprzętu</h1>
            </header>

            {/* Pasek wyszukiwania i filtrów */}
            <div className="rounded-xl border bg-white p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
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
                            <option>Zarezerwowany</option>
                            <option>Wypożyczony</option>
                            <option>Serwis</option>
                            <option>Uszkodzony</option>
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
                            {/* jeśli chcesz dynamicznie: pobierz distinct locations z BE */}
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
                    <Button className="px-5 py-2.5 text-base" onClick={handleSearch} disabled={loading}>
                        {loading ? "Szukam…" : "Szukaj"}
                    </Button>
                </div>
            </div>

            {err && <p className="text-red-600">{err}</p>}

            {/* Lista sprzętu */}
            {searched && (
                <div className="rounded-xl border bg-white p-3">
                    {results.length === 0 ? (
                        <p className="text-slate-600">Brak sprzętu dla wybranych kryteriów.</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {results.map((eq) => {
                                const label = statusLabelPL(eq.status);
                                return (
                                    <li key={eq.id} className="border rounded-lg p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-2">
                                                    {equipmentIcon(eq.type)}
                                                    <div>
                                                        <h3 className="font-semibold">{eq.name}</h3>
                                                        <p className="text-sm text-slate-600">{eq.type}</p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Nr seryjny: {eq.serialNumber}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Lokalizacja: {eq.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded ${statusPillClassesPL(label)}`}>
                          {label}
                        </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            {eq.status?.toUpperCase() === "AVAILABLE" && (
                                                <Button
                                                    className="px-3 py-1 text-sm"
                                                    onClick={() => handleReserve(eq)}
                                                    disabled={busyId === eq.id}
                                                >
                                                    {busyId === eq.id ? "Rezerwuję…" : "Zarezerwuj"}
                                                </Button>
                                            )}
                                            <Link
                                                to={`/equipment/${eq.id}/history`}
                                                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
                                            >
                                                Historia
                                            </Link>
                                        </div>
                                    </li>
                                );
                            })}
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
                                disabled={busyId === selected.id}
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
