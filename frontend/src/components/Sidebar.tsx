export default function Sidebar() {
    return (
        <aside className="hidden md:block md:col-span-3 lg:col-span-3">
            <div className="sticky top-0 space-y-3 rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700">Nawigacja</h3>
                <ul className="text-sm text-slate-600 leading-6">
                    <li>• Katalog – filtry (wkrótce)</li>
                    <li>• Rezerwacje – skróty</li>
                    <li>• Raporty – dostęp opiekuna</li>
                </ul>
                <p className="text-xs text-slate-400">
                    Panel boczny jest widoczny od szerokości <code>md</code>.
                </p>
            </div>
        </aside>
    );
}
