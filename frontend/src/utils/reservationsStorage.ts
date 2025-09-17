// src/utils/reservationsStorage.ts

export type ReservationStatus =
    | "scheduled"
    | "active"
    | "completed"
    | "cancelled";

export type Reservation = {
    id: string;
    equipmentId: number;
    equipmentName: string;
    equipmentType?: string;
    serialNumber?: string;
    location?: string;
    dateFrom: string; // ISO YYYY-MM-DD
    dateTo: string;   // ISO YYYY-MM-DD
    createdAt: string; // ISO
    status: ReservationStatus;
    returnNotes?: string; // nowe pole – uwagi przy zwrocie
};

const KEY = "reservations";

/* ===== internal helpers ===== */

function load(): Reservation[] {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as Reservation[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function save(list: Reservation[]): void {
    localStorage.setItem(KEY, JSON.stringify(list));
}

/* ===== public API ===== */

export function getReservations(): Reservation[] {
    return load();
}

export type NewReservationInput = {
    equipmentId: number;
    equipmentName: string;
    equipmentType?: string;
    serialNumber?: string;
    location?: string;
    dateFrom: string;
    dateTo: string;
};

/** Dodaj rezerwację (status startowy: scheduled). */
export function addReservation(input: NewReservationInput): Reservation {
    const list = load();
    const newRes: Reservation = {
        ...input,
        id: Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        status: "scheduled",
    };
    list.push(newRes);
    save(list);
    return newRes;
}

/** Oznacz rezerwację jako anulowaną. */
export function cancelReservation(id: string): void {
    const list: Reservation[] = load().map((r) =>
        r.id === id ? { ...r, status: "cancelled" as const } : r
    );
    save(list);
}

/** Oznacz rezerwację jako zakończoną (zwrot). Można dodać uwagi. */
export function completeReservation(id: string, notes?: string): void {
    const list: Reservation[] = load().map((r) =>
        r.id === id ? { ...r, status: "completed" as const, returnNotes: notes } : r
    );
    save(list);
}
