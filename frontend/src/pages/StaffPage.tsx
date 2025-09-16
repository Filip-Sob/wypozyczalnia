import { useState } from "react";

// ====== Typy i mocki ======
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

const INITIAL_ITEMS: Equipment[] = [
    {
        id: 1,
        name: "Laptop Dell",
        type: "laptop",
        status: "available",
        location: "Lab1",
        serial: "LAP-12345",
        specs: "Intel i5, 8GB RAM, 256GB SSD",
    },
    {
        id: 2,
        name: "Kamera Sony",
        type: "camera",
        status: "borrowed",
        location: "Lab2",
        serial: "CAM-98765",
        specs: "Full HD, 60fps, zoom x10",
    },
    {
        id: 3,
        name: "Projektor Epson",
        type: "projector",
        status: "reserved",
        location: "warehouse",
        serial: "PRJ-55555",
        specs: "3000 lm, 1080p",
    },
];

// ====== Pomocnicze labelki (UI) ======
function labelType(t: EquipmentType) {
    switch (t) {
        case "laptop": return "Laptop";
        case "camera": return "Kamera";
        case "projector": return "Projektor";
        case "microphone": return "Mikrofon";
        default: return "Inny";
    }
}
function labelStatusUI(s: EquipmentStatus) {
    // UI może mieć ogonki
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
function statusPill(status: EquipmentStatus) {
    switch (status) {
        case "available": return "bg-emerald-100 text-emerald-700";
        case "reserved": return "bg-amber-100 text-amber-700";
        case "borrowed": return "bg-blue-100 text-blue-700";
        case "service": return "bg-purple-100 text-purple-700";
        case "broken": return "bg-rose-100 text-rose-700";
    }
}

// ====== Etykiety bez ogonków (do PDF) ======
function labelStatusAscii(s: EquipmentStatus) {
    switch (s) {
        case "available": return "Dostepny";
        case "reserved":  return "Zarezerwowany";
        case "borrowed":  return "Wypozyczony";
        case "service":   return "Serwis";
        case "broken":    return "Uszkodzony";
    }
}

export default function StaffPage() {
    // Lista sprzętu (mock) — później fetch z backendu
    const [items, setItems] = useState<Equipment[]>(INITIAL_ITEMS);

    // ===== Dodawanie =====
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState<Equipment>({
        id: 0,
        name: "",
        type: "laptop",
        status: "available",
        location: "Lab1",
        serial: "",
        specs: "",
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.serial.trim()) {
            alert("Nazwa i numer seryjny są wymagane.");
            return;
        }
        const newItem: Equipment = { ...form, id: Date.now() };
        setItems((prev) => [newItem, ...prev]);
        // reset
        setForm({
            id: 0,
            name: "",
            type: "laptop",
            status: "available",
            location: "Lab1",
            serial: "",
            specs: "",
        });
        setShowAddForm(false);
    };

    // ===== Edycja =====
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Equipment>({
        id: 0,
        name: "",
        type: "laptop",
        status: "available",
        location: "Lab1",
        serial: "",
        specs: "",
    });

    const startEdit = (it: Equipment) => {
        setEditingId(it.id);
        setEditForm({ ...it });
        setTimeout(() => {
            document.getElementById("edit-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
    };

    const cancelEdit = () => setEditingId(null);

    const saveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.name.trim() || !editForm.serial.trim()) {
            alert("Nazwa i numer seryjny są wymagane.");
            return;
        }
        setItems((prev) => prev.map((x) => (x.id === editingId ? { ...editForm } : x)));
        setEditingId(null);
    };

    // ===== Eksport CSV =====
    const exportCsv = () => {
        const header = ["name", "type", "status", "location", "serial", "specs"];
        const rows = items.map((it) => ({
            name: it.name,
            type: labelType(it.type),
            status: labelStatusAscii(it.status), // bez ogonków
            location: labelLocation(it.location),
            serial: it.serial,
            specs: it.specs,
        }));

        const escape = (val: unknown) => {
            const s = String(val ?? "");
            const escaped = s.replace(/"/g, '""');
            return `"${escaped}"`;
        };

        const csv =
            header.join(",") +
            "\n" +
            rows.map((r) => header.map((h) => escape((r as any)[h])).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "equipment-list.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ===== Eksport PDF (jsPDF + autoTable) =====
    const exportPdf = async () => {
        // defensywne ładowanie modułów (działa i dla default, i dla named export)
        const jsPDFModule = await import("jspdf");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const JsPDFCtor: any = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default;

        const autoTableModule = await import("jspdf-autotable");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const autoTable: any = (autoTableModule as any).default || (autoTableModule as any);

        const doc = new JsPDFCtor({ orientation: "portrait", unit: "pt", format: "a4" });

        doc.setFontSize(16);
        doc.text("Equipment list", 40, 40);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 58);
        doc.setTextColor(15);

        const head = [["Name", "Type", "Status", "Location", "Serial no.", "Specs"]];
        const body = items.map((it) => [
            it.name,
            labelType(it.type),
            labelStatusAscii(it.status), // bez ogonków w PDF
            labelLocation(it.location),
            it.serial,
            it.specs,
        ]);

        autoTable(doc, {
            head,
            body,
            startY: 80,
            styles: { fontSize: 9, cellPadding: 6 },
            headStyles: { fillColor: [248, 250, 252], textColor: 15 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            didDrawPage: () => {
                doc.setFontSize(9);
                doc.setTextColor(120);
                doc.text(`© ${new Date().getFullYear()} — UniRent`, 40, doc.internal.pageSize.getHeight() - 24);
                doc.setTextColor(15);
            },
            margin: { left: 40, right: 40 },
        });

        doc.save("equipment-list.pdf");
    };

    return (
        <section className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Panel opiekuna</h1>
                    <p className="text-slate-600">Zarządzaj sprzętem: dodawaj, edytuj, eksportuj.</p>
                </div>

                <div className="flex gap-2">
                    <button onClick={exportPdf} className="rounded bg-indigo-700 text-white px-4 py-2">
                        Eksport PDF
                    </button>
                    <button onClick={exportCsv} className="rounded bg-slate-800 text-white px-4 py-2">
                        Eksport CSV
                    </button>
                    <button
                        onClick={() => setShowAddForm((s) => !s)}
                        className="rounded bg-black text-white px-4 py-2 hover:bg-slate-800"
                    >
                        {showAddForm ? "Ukryj formularz" : "Dodaj sprzęt"}
                    </button>
                </div>
            </header>

            {/* Formularz dodawania */}
            {showAddForm && (
                <form
                    onSubmit={handleAdd}
                    className="rounded-xl border bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Nazwa</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. Laptop Dell"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Typ</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value as EquipmentType })}
                            className="w-full rounded border px-3 py-2"
                        >
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
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value as EquipmentStatus })}
                            className="w-full rounded border px-3 py-2"
                        >
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
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value as EquipmentLocation })}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="Lab1">Laboratorium 1</option>
                            <option value="Lab2">Laboratorium 2</option>
                            <option value="warehouse">Magazyn</option>
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Numer seryjny</label>
                        <input
                            value={form.serial}
                            onChange={(e) => setForm({ ...form, serial: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. LAP-12345"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Specyfikacja</label>
                        <input
                            value={form.specs}
                            onChange={(e) => setForm({ ...form, specs: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. i5 / 16GB / 512GB SSD"
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddForm(false)} className="rounded bg-black/5 text-slate-900 px-4 py-2">
                            Anuluj
                        </button>
                        <button type="submit" className="rounded bg-black text-white px-4 py-2">
                            Zapisz
                        </button>
                    </div>
                </form>
            )}

            {/* Formularz edycji */}
            {editingId !== null && (
                <form
                    id="edit-form"
                    onSubmit={saveEdit}
                    className="rounded-xl border bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                    <div className="md:col-span-3">
                        <h2 className="text-sm font-semibold text-slate-700">
                            Edycja sprzętu: <span className="font-bold">{editForm.name}</span>
                        </h2>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Nazwa</label>
                        <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Typ</label>
                        <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value as EquipmentType })}
                            className="w-full rounded border px-3 py-2"
                        >
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
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as EquipmentStatus })}
                            className="w-full rounded border px-3 py-2"
                        >
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
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value as EquipmentLocation })}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="Lab1">Laboratorium 1</option>
                            <option value="Lab2">Laboratorium 2</option>
                            <option value="warehouse">Magazyn</option>
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Numer seryjny</label>
                        <input
                            value={editForm.serial}
                            onChange={(e) => setEditForm({ ...editForm, serial: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Specyfikacja</label>
                        <input
                            value={editForm.specs}
                            onChange={(e) => setEditForm({ ...editForm, specs: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2">
                        <button type="button" onClick={cancelEdit} className="rounded bg-black/5 text-slate-900 px-4 py-2">
                            Anuluj
                        </button>
                        <button type="submit" className="rounded bg-black text-white px-4 py-2">
                            Zapisz zmiany
                        </button>
                    </div>
                </form>
            )}

            {/* Lista sprzętu */}
            <div className="rounded-xl border bg-white overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="border-b bg-slate-50 text-left">
                        <th className="px-4 py-3 font-semibold">Nazwa</th>
                        <th className="px-4 py-3 font-semibold">Typ</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Lokalizacja</th>
                        <th className="px-4 py-3 font-semibold">Nr seryjny</th>
                        <th className="px-4 py-3 font-semibold">Specyfikacja</th>
                        <th className="px-4 py-3 font-semibold text-right">Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td className="px-4 py-4 text-slate-600" colSpan={7}>
                                Brak pozycji. Dodaj nowy sprzęt przyciskiem „Dodaj sprzęt”.
                            </td>
                        </tr>
                    ) : (
                        items.map((it) => (
                            <tr key={it.id} className="border-b last:border-0">
                                <td className="px-4 py-3">{it.name}</td>
                                <td className="px-4 py-3">{labelType(it.type)}</td>
                                <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${statusPill(it.status)}`}>
                      {labelStatusUI(it.status)}
                    </span>
                                </td>
                                <td className="px-4 py-3">{labelLocation(it.location)}</td>
                                <td className="px-4 py-3">{it.serial}</td>
                                <td className="px-4 py-3">{it.specs}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => startEdit(it)}
                                            className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            Edytuj
                                        </button>
                                        <button
                                            onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
                                            className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
