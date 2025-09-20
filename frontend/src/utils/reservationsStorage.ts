// src/utils/reservationsStorage.ts

import { API, authHeader } from "./api";

// ===== Typy po stronie FE =====
export type ReservationStatus = "scheduled" | "active" | "completed" | "cancelled";

export type Reservation = {
    id: string;
    equipmentId: number;
    equipmentName: string;
    equipmentType?: string;
    serialNumber?: string;
    location?: string;
    dateFrom: string;   // ISO / YYYY-MM-DD
    dateTo: string;     // ISO / YYYY-MM-DD
    createdAt: string;  // ISO (BE nie zwraca — ustawimy "teraz")
    status: ReservationStatus;
    returnNotes?: string;
};

// ===== Mapowanie statusu BE (PL) -> FE =====
// BE: "AKTYWNA" | "ANULOWANA" | "WYGASŁA" | "ZREALIZOWANA"
function mapStatusFromBE(s: unknown): ReservationStatus {
    const v = String(s ?? "").trim().toUpperCase();
    if (["AKTYWNA", "ACTIVE"].includes(v)) return "active";
    if (["ANULOWANA", "CANCELED", "CANCELLED"].includes(v)) return "cancelled";
    if (["WYGASŁA", "EXPIRED", "ZREALIZOWANA", "FULFILLED", "COMPLETED"].includes(v)) return "completed";
    return "scheduled";
}

// ===== Adapter BE -> FE =====
// BE: { id, device{ id,name,type,serialNumber,location }, fromDate, toDate, status }
function adaptReservation(be: any): Reservation {
    const d: any = be?.device ?? {};
    return {
        id: String(be?.id),
        equipmentId: Number(d?.id ?? 0),
        equipmentName: String(d?.name ?? "Sprzęt"),
        equipmentType: d?.type ?? undefined,
        serialNumber: d?.serialNumber ?? undefined,
        location: d?.location ?? undefined,
        dateFrom: String(be?.fromDate ?? new Date().toISOString()),
        dateTo: String(be?.toDate ?? new Date().toISOString()),
        createdAt: new Date().toISOString(),
        status: mapStatusFromBE(be?.status),
        returnNotes: undefined,
    };
}

// ===== LISTA =====
export async function getReservations(params: {
    userId?: number;
    deviceId?: number;
    status?: string;
    page?: number;
    size?: number;
} = {}): Promise<Reservation[]> {
    const url = new URL(API("/api/reservations"));
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });

    const res = await fetch(url.toString(), { headers: { ...authHeader() } });
    if (!res.ok) throw new Error(`GET /api/reservations ${res.status}`);
    const data = await res.json();

    const content: any[] = Array.isArray(data)
        ? data
        : (Array.isArray((data as any)?.content) ? (data as any).content : []);
    return content.map(adaptReservation);
}

// ===== CREATE =====
export type NewReservationInput = {
    equipmentId: number;
    dateFrom: string; // "YYYY-MM-DD" lub ISO
    dateTo: string;   // "YYYY-MM-DD" lub ISO
};

export async function addReservation(input: NewReservationInput): Promise<Reservation> {
    const payload = {
        deviceId: input.equipmentId,
        fromDate: input.dateFrom,
        toDate: input.dateTo,
    };

    const res = await fetch(API("/api/reservations"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`POST /api/reservations ${res.status}: ${t}`);
    }
    const be = await res.json();
    return adaptReservation(be);
}

// ===== CANCEL =====
export async function cancelReservation(id: string): Promise<Reservation> {
    const res = await fetch(API(`/api/reservations/${id}/cancel`), {
        method: "POST",
        headers: { ...authHeader() },
    });
    if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`POST /api/reservations/${id}/cancel ${res.status}: ${t}`);
    }
    const be = await res.json();
    return adaptReservation(be);
}

// ===== COMPLETE (zwrot) =====
// Brak endpointu w BE — rzuć czytelnym błędem, aby UI mógł pokazać info.
export async function completeReservation(_id: string, _notes?: string): Promise<never> {
    throw new Error("Zwrot rezerwacji nie jest obsługiwany w backendzie. Użyj zwrotu wypożyczenia (Loans).");
}
