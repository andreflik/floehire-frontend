import { createContext, useState } from "react";
import { API_URL } from "../services/api";

export type Candidate = {
    id: string;
    full_name: string;
    email: string;
};

export type Recruiter = {
    id: string;
    company_name: string;
    email: string;
};

export type User = Candidate | Recruiter;

export type AuthState = {
    access_token: string | null;
    refresh_token: string | null;
    role: "candidate" | "recruiter" | null;
    user: User | null;
};

export type AuthContextType = {
    auth: AuthState | null;
    setAuth: (data: AuthState) => void;
    logout: () => void;
    login: (data: { email: string; password: string }) => Promise<void>;
    loginRecruiter: (data: { email: string; password: string }) => Promise<void>;
    isAuthenticated: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    access: "auth_access_token",
    refresh: "auth_refresh_token",
    user: "auth_user",
    role: "auth_role",
};

function loadAuthFromStorage(): AuthState | null {
    const access_token = localStorage.getItem(STORAGE_KEYS.access);
    const refresh_token = localStorage.getItem(STORAGE_KEYS.refresh);
    const userStr = localStorage.getItem(STORAGE_KEYS.user);
    const role = localStorage.getItem(STORAGE_KEYS.role) as
        | "candidate"
        | "recruiter"
        | null;

    if (access_token && userStr && role) {
        try {
            return {
                access_token,
                refresh_token,
                role,
                user: JSON.parse(userStr),
            };
        } catch {
            localStorage.removeItem(STORAGE_KEYS.access);
            localStorage.removeItem(STORAGE_KEYS.refresh);
            localStorage.removeItem(STORAGE_KEYS.user);
            localStorage.removeItem(STORAGE_KEYS.role);
            return null;
        }
    }

    return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuthState] = useState<AuthState | null>(() =>
        loadAuthFromStorage(),
    );

    function setAuth(data: AuthState) {
        setAuthState(data);

        if (data.access_token) {
            localStorage.setItem(STORAGE_KEYS.access, data.access_token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.access);
        }

        if (data.refresh_token) {
            localStorage.setItem(STORAGE_KEYS.refresh, data.refresh_token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.refresh);
        }

        if (data.user && data.role) {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
            localStorage.setItem(STORAGE_KEYS.role, data.role);
        } else {
            localStorage.removeItem(STORAGE_KEYS.user);
            localStorage.removeItem(STORAGE_KEYS.role);
        }
    }

    function logout() {
        setAuthState(null);
        localStorage.removeItem(STORAGE_KEYS.access);
        localStorage.removeItem(STORAGE_KEYS.refresh);
        localStorage.removeItem(STORAGE_KEYS.user);
        localStorage.removeItem(STORAGE_KEYS.role);
    }

    async function login({ email, password }: { email: string; password: string }) {
        const res = await fetch(`${API_URL}/auth/candidate/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Erro ao fazer login");
        }

        const authData: AuthState = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            role: "candidate",
            user: data.candidate,
        };

        setAuth(authData);
    }

    async function loginRecruiter({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) {
        const res = await fetch(`${API_URL}/recruiter/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Erro ao fazer login");
        }

        const authData: AuthState = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            role: "recruiter",
            user: data.recruiter,
        };

        setAuth(authData);
    }

    const isAuthenticated = !!auth?.access_token;

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                login,
                loginRecruiter,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}