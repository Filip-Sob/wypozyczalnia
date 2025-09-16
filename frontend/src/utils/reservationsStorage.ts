// src/utils/reservationsStorage.ts

/**
 * Prosty wrapper na localStorage dla rezerwacji.
 * Klucz jest namespacowany, żeby nie kolidować z innymi danymi.
 */

const STORAGE_KEY = 'unirent_reservations_v1';

export type ReservationStatus = 'scheduled' | 'active' | 'cancelled' | 'completed';

export interface Reservation {
    id: string;
    equipmentId: string;
    equipmentName: string;
    equipmentType?: string;
    serialNumber?: string;
    location?: string;

    // Identyfikator użytkownika (na razie mock — pod backend)
    userId?: string;
    userName?: string;

    // ISO stringi (UTC) — łatwe do serializacji
    dateFrom: string;
    dateTo: string;

    createdAt: string; // kiedy utworzono rezerwację
    status: ReservationStatus;
}

export interface NewReservationInput {
    equipmentId: string;
    equipmentName: string;
    equipmentType?: string;
    serialNumber?: string;
    location?: string;
    userId?: string;
    userName?: string;
    dateFrom: Date | string; // przyjmujemy Date lub ISO
    dateTo: Date | string;
}

/** Pomocniczo: generowanie prostego ID */
function genId(prefix = 'res'): string {
    const rand = Math.random().toString(36).slice(2, 8);
    const time = Date.now().toString(36);
    return `${prefix}_${time}_${rand}`;
}

/** Odczyt całej listy */
export function getReservations(): Reservation[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw) as Reservation[];
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

/** Zapis całej listy (prywatne) */
function setReservations(list: Reservation[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Dodanie nowej rezerwacji.
 * Walidacja zakresu (<=14 dni) zostaje po stronie UI, ale trzymamy tu lekką ochronę.
 */
export function addReservation(input: NewReservationInput): Reservation {
    const fromISO =
        input.dateFrom instanceof Date ? input.dateFrom.toISOString() : new Date(input.dateFrom).toISOString();
    const toISO =
        input.dateTo instanceof Date ? input.dateTo.toISOString() : new Date(input.dateTo).toISOString();

    const diffMs = new Date(toISO).getTime() - new Date(fromISO).getTime();
    const max14d = 14 * 24 * 60 * 60 * 1000;
    if (diffMs <= 0) {
        throw new Error('Zakres dat jest nieprawidłowy.');
    }
    if (diffMs > max14d) {
        throw new Error('Maksymalny czas rezerwacji to 14 dni.');
    }

    const reservation: Reservation = {
        id: genId(),
        equipmentId: input.equipmentId,
        equipmentName: input.equipmentName,
        equipmentType: input.equipmentType,
        serialNumber: input.serialNumber,
        location: input.location,
        userId: input.userId,
        userName: input.userName,
        dateFrom: fromISO,
        dateTo: toISO,
        createdAt: new Date().toISOString(),
        status: 'scheduled',
    };

    const list = getReservations();
    list.push(reservation);
    setReservations(list);
    return reservation;
}

/** Anulowanie (ustawiamy status na cancelled) */
export function cancelReservation(reservationId: string): void {
    const list = getReservations();
    const idx = list.findIndex((r) => r.id === reservationId);
    if (idx === -1) return;
    list[idx] = { ...list[idx], status: 'cancelled' };
    setReservations(list);
}

/** Zakończenie / zwrot (ustawiamy status na completed) */
export function completeReservation(reservationId: string): void {
    const list = getReservations();
    const idx = list.findIndex((r) => r.id === reservationId);
    if (idx === -1) return;
    list[idx] = { ...list[idx], status: 'completed' };
    setReservations(list);
}

/** Usunięcie rezerwacji (np. dla panelu opiekuna lub testów) */
export function removeReservation(reservationId: string): void {
    const list = getReservations().filter((r) => r.id !== reservationId);
    setReservations(list);
}

/** Utility dla developmentu/testów */
export function clearAllReservations(): void {
    setReservations([]);
}
