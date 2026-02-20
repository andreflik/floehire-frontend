import { createContext, useState } from "react";
import { API_URL } from "../services/api";

export type Candidate = {
    id: string;
    full_name: string;
    email: string;
};

export type AuthState = {
    access_token: string | null;
    refresh_token: string | null;
    candidate: Candidate | null;
};

export type AuthContextType = {
    auth: AuthState | null;
    setAuth: (data: AuthState) => void;
    logout: () => void;
    login: (data: { email: string; password: string }) => Promise<void>;
    isAuthenticated: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔑 Chaves separadas para CANDIDATE
const STORAGE_KEYS = {
    access: "candidate_access_token",
    refresh: "candidate_refresh_token",
    user: "candidate_user",
};

function loadAuthFromStorage(): AuthState | null {
    const access_token = localStorage.getItem(STORAGE_KEYS.access);
    const refresh_token = localStorage.getItem(STORAGE_KEYS.refresh);
    const candidateStr = localStorage.getItem(STORAGE_KEYS.user);

    if (access_token && candidateStr) {
        try {
            return {
                access_token, // ⚠️ SEM stringify, é string pura
                refresh_token,
                candidate: JSON.parse(candidateStr),
            };
        } catch {
            // Se der erro de parse, limpa tudo
            localStorage.removeItem(STORAGE_KEYS.access);
            localStorage.removeItem(STORAGE_KEYS.refresh);
            localStorage.removeItem(STORAGE_KEYS.user);
            return null;
        }
    }

    return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // ✅ Inicializa direto do localStorage (sem useEffect)
    const [auth, setAuthState] = useState<AuthState | null>(() => loadAuthFromStorage());

    function setAuth(data: AuthState) {
        setAuthState(data);

        if (data.access_token) {
            // ⚠️ Salva token PURO (sem JSON.stringify)
            localStorage.setItem(STORAGE_KEYS.access, data.access_token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.access);
        }

        if (data.refresh_token) {
            localStorage.setItem(STORAGE_KEYS.refresh, data.refresh_token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.refresh);
        }

        if (data.candidate) {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.candidate));
        } else {
            localStorage.removeItem(STORAGE_KEYS.user);
        }
    }

    function logout() {
        setAuthState(null);
        localStorage.removeItem(STORAGE_KEYS.access);
        localStorage.removeItem(STORAGE_KEYS.refresh);
        localStorage.removeItem(STORAGE_KEYS.user);
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
            candidate: data.candidate,
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
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}