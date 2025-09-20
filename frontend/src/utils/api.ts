// frontend/src/utils/api.ts

/* ===== Konfiguracja ===== */
export const BASE_URL: string =
    (import.meta as any)?.env?.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

// Klucz pod którym trzymamy Base64("login:haslo")
export const AUTH_KEY = "auth.basic";

/* ===== Helpery auth ===== */
export function makeBasic(username: string, password: string): string {
    return btoa(`${username}:${password}`);
}

export function saveAuth(token: string): void {
    localStorage.setItem(AUTH_KEY, token);
}

export function clearAuth(): void {
    localStorage.removeItem(AUTH_KEY);
}

/** Nagłówek Authorization dla Basic Auth (lub pusty obiekt jeśli brak tokenu). */
export const authHeader = (): Record<string, string> => {
    const token = localStorage.getItem(AUTH_KEY);
    return token ? { Authorization: `Basic ${token}` } : ({} as Record<string, string>);
};

/** Skleja pełny URL do backendu (np. http://localhost:8080 + /api/...). */
export const API = (path: string): string => `${BASE_URL}${path}`;

/* ===== QueryString ===== */
export function toQuery(params: Record<string, unknown> | undefined): string {
    if (!params) return "";
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        usp.append(k, String(v));
    });
    const s = usp.toString();
    return s ? `?${s}` : "";
}

/* ===== HTTP wrapper ===== */
export async function http<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const url = API(path);
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...authHeader(),
        ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        let details: any = null;
        try {
            details = await res.json();
        } catch {
            /* no-op */
        }
        const err = new Error(
            details?.komunikat || details?.message || `HTTP ${res.status} ${res.statusText}`
        ) as Error & { status?: number; details?: any };
        err.status = res.status;
        err.details = details;
        throw err;
    }

    if (res.status === 204) {
        // no content
        return undefined as unknown as T;
    }

    const text = await res.text();
    if (!text) return undefined as unknown as T;

    try {
        return JSON.parse(text) as T;
    } catch {
        // serwer zwrócił plain text
        return text as unknown as T;
    }
}

/* ===== Typy (zgrubne) ===== */
export type UserMeDto = {
    id: number;
    username: string;
    email: string;
    role: string;
};

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export type Device = {
    id: number;
    name: string;
    type: string;
    serialNumber: string;
    location: string;
    status: string;
};

export type Loan = {
    id: number;
    device: Device;
    startDate: string; // ISO
    dueDate: string;   // ISO
    returnDate?: string;
    status: string;
    returnNote?: string | null;
    damageReported?: boolean | null;
};

/* ===== Wygodne API (opcjonalnie) ===== */
export const api = {
    /* --- AUTH --- */
    auth: {
        async login(username: string, password: string): Promise<UserMeDto> {
            const token = makeBasic(username, password);
            saveAuth(token);
            return this.me();
        },
        async me(): Promise<UserMeDto> {
            return http<UserMeDto>("/api/users/me");
        },
        logout(): void {
            clearAuth();
        },
    },

    /* --- DEVICES --- */
    devices: {
        search(params?: {
            status?: string;
            type?: string;
            location?: string;
            q?: string;
            page?: number;
            size?: number;
            sort?: string; // np. "name,asc"
        }): Promise<Page<Device>> {
            return http<Page<Device>>(`/api/devices${toQuery(params)}`);
        },

        getById(id: number): Promise<Device> {
            return http<Device>(`/api/devices/${id}`);
        },

        create(dto: {
            name: string;
            type: string;
            serialNumber: string;
            location: string;
        }): Promise<Device> {
            return http<Device>("/api/devices", {
                method: "POST",
                body: JSON.stringify(dto),
            });
        },

        update(
            id: number,
            dto: {
                name: string;
                type: string;
                serialNumber: string;
                location: string;
            }
        ): Promise<Device> {
            return http<Device>(`/api/devices/${id}`, {
                method: "PUT",
                body: JSON.stringify(dto),
            });
        },

        delete(id: number): Promise<void> {
            return http<void>(`/api/devices/${id}`, {
                method: "DELETE",
            });
        },
    },

    /* --- LOANS --- */
    loans: {
        create(dto: {
            deviceId: number;
            userId: number;
            startDate: string; // YYYY-MM-DD
            dueDate: string;   // YYYY-MM-DD
        }): Promise<Loan> {
            return http<Loan>("/api/loans", { method: "POST", body: JSON.stringify(dto) });
        },

        return(
            id: number,
            params?: { returnDate?: string; note?: string; damaged?: boolean }
        ): Promise<Loan> {
            return http<Loan>(`/api/loans/${id}/return${toQuery(params)}`, { method: "POST" });
        },

        list(params?: { page?: number; size?: number; sort?: string }) {
            return http<Page<Loan>>(`/api/loans${toQuery(params)}`);
        },

        /** Historia wypożyczeń dla danego urządzenia */
        historyByDevice(deviceId: number, params?: { page?: number; size?: number; sort?: string }) {
            return http<Page<Loan>>(`/api/loans/device/${deviceId}${toQuery(params)}`);
        },
    },


    /* --- RESERVATIONS (jeśli potrzebne) --- */
    reservations: {
        listMine(params?: { page?: number; size?: number; sort?: string }) {
            return http<Page<any>>(`/api/reservations${toQuery(params)}`);
        },
    },
};
