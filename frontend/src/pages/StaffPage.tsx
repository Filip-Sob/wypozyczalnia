// src/pages/StaffPage.tsx
import { useEffect, useState } from "react";
import { api, type Device } from "../utils/api";

/* ===== Mapowanie statusów na ładne etykiety/kolory ===== */
function labelStatusUI(s: string) {
    const v = (s || "").toUpperCase();
    if (["DOSTĘPNY", "AVAILABLE"].includes(v)) return "Dostępny";
    if (["ZAREZERWOWANY", "RESERVED"].includes(v)) return "Zarezerwowany";
    if (["WYPOŻYCZONY", "LOANED"].includes(v)) return "Wypożyczony";
    if (["SERWIS", "MAINTENANCE"].includes(v)) return "Serwis";
    if (["USZKODZONY", "DAMAGED"].includes(v)) return "Uszkodzony";
    if (["ZGUBIONY", "LOST"].includes(v)) return "Zgubiony";
    return s || "-";
}
function labelStatusAscii(s: string) {
    const v = (s || "").toUpperCase();
    if (["DOSTĘPNY", "AVAILABLE"].includes(v)) return "Dostepny";
    if (["ZAREZERWOWANY", "RESERVED"].includes(v)) return "Zarezerwowany";
    if (["WYPOŻYCZONY", "LOANED"].includes(v)) return "Wypozyczony";
    if (["SERWIS", "MAINTENANCE"].includes(v)) return "Serwis";
    if (["USZKODZONY", "DAMAGED"].includes(v)) return "Uszkodzony";
    if (["ZGUBIONY", "LOST"].includes(v)) return "Zgubiony";
    return s || "-";
}
function statusPill(status: string) {
    const v = (status || "").toUpperCase();
    if (["DOSTĘPNY", "AVAILABLE"].includes(v)) return "bg-emerald-100 text-emerald-700";
    if (["ZAREZERWOWANY", "RESERVED"].includes(v)) return "bg-amber-100 text-amber-700";
    if (["WYPOŻYCZONY", "LOANED"].includes(v)) return "bg-blue-100 text-blue-700";
    if (["SERWIS", "MAINTENANCE"].includes(v)) return "bg-purple-100 text-purple-700";
    if (["USZKODZONY", "DAMAGED", "ZGUBIONY", "LOST"].includes(v))
        return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-700";
}

/* ===== Komponent ===== */
export default function StaffPage() {
    const [items, setItems] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dodawanie
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        type: "",
        serialNumber: "",
        location: "",
    });

    // Edycja
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        type: "",
        serialNumber: "",
        location: "",
    });

    /* ===== API ===== */
    const loadDevices = async () => {
        try {
            setLoading(true);
            setError(null);
            const page = await api.devices.search({ size: 100, sort: "id,desc" });
            setItems(page.content);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Błąd pobierania listy urządzeń");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.type.trim() || !form.serialNumber.trim() || !form.location.trim()) {
            alert("Wypełnij wszystkie pola: nazwa, typ, numer seryjny, lokalizacja.");
            return;
        }
        try {
            const created = await api.devices.create(form);
            setItems((prev) => [created, ...prev]);
            setForm({ name: "", type: "", serialNumber: "", location: "" });
            setShowAddForm(false);
        } catch (e: any) {
            alert("Błąd przy dodawaniu: " + (e?.message || "Nieznany"));
        }
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        if (!editForm.name.trim() || !editForm.type.trim() || !editForm.serialNumber.trim() || !editForm.location.trim()) {
            alert("Wypełnij wszystkie pola: nazwa, typ, numer seryjny, lokalizacja.");
            return;
        }
        try {
            const updated = await api.devices.update(editingId, editForm);
            setItems((prev) => prev.map((d) => (d.id === editingId ? updated : d)));
            setEditingId(null);
        } catch (e: any) {
            alert("Błąd przy zapisie: " + (e?.message || "Nieznany"));
        }
    };

    const deleteDevice = async (id: number) => {
        if (!window.confirm("Czy na pewno usunąć urządzenie?")) return;
        try {
            await api.devices.delete(id);
            setItems((prev) => prev.filter((d) => d.id !== id));
        } catch (e: any) {
            alert("Błąd przy usuwaniu: " + (e?.message || "Nieznany"));
        }
    };

    useEffect(() => {
        loadDevices();
    }, []);

    /* ===== Eksport CSV ===== */
    const exportCsv = () => {
        const header = ["name", "type", "status", "location", "serialNumber"];
        const rows = items.map((it) => ({
            name: it.name,
            type: it.type, // typ z BE – tekst
            status: labelStatusAscii(it.status),
            location: it.location,
            serialNumber: it.serialNumber,
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

    /* ===== Eksport PDF ===== */
    const exportPdf = async () => {
        const jsPDFModule = await import("jspdf");
        const JsPDFCtor: any = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default;
        const autoTableModule = await import("jspdf-autotable");
        const autoTable: any = (autoTableModule as any).default || (autoTableModule as any);

        const doc = new JsPDFCtor({ orientation: "portrait", unit: "pt", format: "a4" });

        doc.setFontSize(16);
        doc.text("Equipment list", 40, 40);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 58);

        const head = [["Name", "Type", "Status", "Location", "Serial no."]];
        const body = items.map((it) => [
            it.name,
            it.type,
            labelStatusAscii(it.status),
            it.location,
            it.serialNumber,
        ]);

        autoTable(doc, {
            head,
            body,
            startY: 80,
            styles: { fontSize: 9, cellPadding: 6 },
            headStyles: { fillColor: [248, 250, 252], textColor: 15 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { left: 40, right: 40 },
        });

        doc.save("equipment-list.pdf");
    };

    return (
        <section className="space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Panel opiekuna</h1>
                <div className="flex gap-2">
                    <button
                        onClick={exportPdf}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    >
                        Eksport PDF
                    </button>
                    <button
                        onClick={exportCsv}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    >
                        Eksport CSV
                    </button>
                    <button
                        onClick={() => setShowAddForm((s) => !s)}
                        className="px-4 py-2 rounded bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
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
                        <input
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. laptop / kamera / projektor"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Lokalizacja</label>
                        <input
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. Lab1 / Lab2 / Magazyn"
                            required
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Numer seryjny</label>
                        <input
                            value={form.serialNumber}
                            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            placeholder="np. LAP-12345"
                            required
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="rounded bg-gray-200 text-gray-900 px-4 py-2 hover:bg-gray-300 cursor-pointer"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        >
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
                            Edycja sprzętu
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
                        <input
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Lokalizacja</label>
                        <input
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Numer seryjny</label>
                        <input
                            value={editForm.serialNumber}
                            onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded bg-gray-200 text-gray-900 px-4 py-2 hover:bg-gray-300 cursor-pointer"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        >
                            Zapisz zmiany
                        </button>
                    </div>
                </form>
            )}

            {/* Lista */}
            <div className="rounded-xl border bg-white overflow-x-auto">
                {loading ? (
                    <p className="p-4">Ładowanie…</p>
                ) : error ? (
                    <p className="p-4 text-red-600">{error}</p>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="border-b bg-slate-50 text-left">
                            <th className="px-4 py-3 font-semibold">Nazwa</th>
                            <th className="px-4 py-3 font-semibold">Typ</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Lokalizacja</th>
                            <th className="px-4 py-3 font-semibold">Nr seryjny</th>
                            <th className="px-4 py-3 font-semibold text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td className="px-4 py-4 text-slate-600" colSpan={6}>
                                    Brak pozycji. Dodaj nowy sprzęt przyciskiem „Dodaj sprzęt”.
                                </td>
                            </tr>
                        ) : (
                            items.map((it) => (
                                <tr key={it.id} className="border-b last:border-0">
                                    <td className="px-4 py-3">{it.name}</td>
                                    <td className="px-4 py-3">{it.type}</td>
                                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${statusPill(it.status)}`}>
                        {labelStatusUI(it.status)}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">{it.location}</td>
                                    <td className="px-4 py-3">{it.serialNumber}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(it.id);
                                                    setEditForm({
                                                        name: it.name,
                                                        type: it.type,
                                                        serialNumber: it.serialNumber,
                                                        location: it.location,
                                                    });
                                                }}
                                                className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                                            >
                                                Edytuj
                                            </button>
                                            <button
                                                onClick={() => deleteDevice(it.id)}
                                                className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
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
                )}
            </div>
        </section>
    );
}
