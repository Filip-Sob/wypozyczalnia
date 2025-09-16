import { useState } from "react";

type Equipment = {
    id: number;
    name: string;
    type: "laptop" | "camera" | "projector" | "other";
    status: "available" | "reserved" | "borrowed" | "service" | "broken";
    location: "lab1" | "lab2" | "warehouse";
    serial: string;
    specs: string;
};

const mockData: Equipment[] = [
    {
        id: 1,
        name: "Laptop Dell",
        type: "laptop",
        status: "available",
        location: "lab1",
        serial: "LAP-12345",
        specs: "Intel i5, 8GB RAM, 256GB SSD",
    },
    {
        id: 2,
        name: "Kamera Sony",
        type: "camera",
        status: "borrowed",
        location: "lab2",
        serial: "CAM-98765",
        specs: "Full HD, 60fps, optyczny zoom 10x",
    },
    {
        id: 3,
        name: "Projektor Epson",
        type: "projector",
        status: "reserved",
        location: "warehouse",
        serial: "PRJ-55555",
        specs: "3000 lumenów, rozdzielczość 1080p",
    },
    {
        id: 4,
        name: "Mikrofon USB",
        type: "other",
        status: "available",
        location: "lab1",
        serial: "MIC-11111",
        specs: "USB, kardioidalny, 48kHz",
    },
];

function labelType(t: Equipment["type"]) {
    switch (t) {
        case "laptop":
            return "Laptop";
        case "camera":
            return "Kamera";
        case "projector":
            return "Projektor";
        default:
            return "Inny";
    }
}

function labelStatus(s: Equipment["status"]) {
    switch (s) {
        case "available":
            return "Dostępny";
        case "reserved":
            return "Zarezerwowany";
        case "borrowed":
            return "Wypożyczony";
        case "service":
            return "Serwis";
        case "broken":
            return "Uszkodzony";
    }
}

function labelLocation(l: Equipment["location"]) {
    switch (l) {
        case "lab1":
            return "Laboratorium 1";
        case "lab2":
            return "Laboratorium 2";
        case "warehouse":
            return "Magazyn";
    }
}

export default function CatalogPage() {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("all");
    const [status, setStatus] = useState("all");
    const [location, setLocation] = useState("all");
    const [results, setResults] = useState<Equipment[]>([]);

    const handleSearch = () => {
        let filtered = mockData;

        if (query.trim() !== "") {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (type !== "all") {
            filtered = filtered.filter((item) => item.type === type);
        }

        if (status !== "all") {
            filtered = filtered.filter((item) => item.status === status);
        }

        if (location !== "all") {
            filtered = filtered.filter((item) => item.location === location);
        }

        setResults(filtered);
    };

    const handleClear = () => {
        setQuery("");
        setType("all");
        setStatus("all");
        setLocation("all");
        setResults([]);
    };

    return (
        <section className="space-y-6 p-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Katalog sprzętu</h1>
                <p className="text-slate-600">
                    Wyszukuj i filtruj zasoby. (Na razie mock; backend podepniemy później.)
                </p>
            </header>

            {/* Filtry */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                className="rounded-xl border bg-white p-4 grid grid-cols-1 gap-3 md:grid-cols-5"
            >
                <input
                    type="text"
                    placeholder="np. Kamera Sony"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-md border p-2 md:col-span-2"
                />

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-md border p-2"
                >
                    <option value="all">Wszystkie</option>
                    <option value="laptop">Laptopy</option>
                    <option value="camera">Kamery</option>
                    <option value="projector">Projektory</option>
                    <option value="other">Inne</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border p-2"
                >
                    <option value="all">Dowolny</option>
                    <option value="available">Dostępny</option>
                    <option value="reserved">Zarezerwowany</option>
                    <option value="borrowed">Wypożyczony</option>
                    <option value="service">Serwis</option>
                    <option value="broken">Uszkodzony</option>
                </select>

                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-md border p-2"
                >
                    <option value="all">Dowolna</option>
                    <option value="lab1">Laboratorium 1</option>
                    <option value="lab2">Laboratorium 2</option>
                    <option value="warehouse">Magazyn</option>
                </select>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full rounded-md bg-black text-white py-2 hover:bg-slate-800"
                    >
                        Wyczyść
                    </button>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-black text-white py-2 hover:bg-slate-800"
                    >
                        Szukaj
                    </button>
                </div>
            </form>

            {/* Wyniki */}
            <div className="rounded-xl border bg-white p-4">
                {results.length === 0 ? (
                    <p className="text-slate-500">
                        Brak wyników (mock). Kliknij „Szukaj”, aby wyszukać sprzęt.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded p-4 shadow hover:shadow-md transition"
                            >
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li><strong>Typ:</strong> {labelType(item.type)}</li>
                                    <li><strong>Status:</strong> {labelStatus(item.status)}</li>
                                    <li><strong>Lokalizacja:</strong> {labelLocation(item.location)}</li>
                                    <li><strong>Numer seryjny:</strong> {item.serial}</li>
                                    <li><strong>Specyfikacja:</strong> {item.specs}</li>
                                </ul>

                                {item.status === "available" ? (
                                    <button
                                        onClick={() => console.log(`Rezerwacja sprzętu: ${item.name}`)}
                                        className="mt-3 w-full px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                        Zarezerwuj
                                    </button>
                                ) : (
                                    <span className="mt-3 block text-center px-3 py-2 rounded bg-gray-300 text-gray-700">
                    Niedostępny
                  </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
