import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";

const STORAGE_KEY = "floehire:auth";

function getInitialAuth(): AuthState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthState;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuthState] = useState<AuthState | null>(() => getInitialAuth());

    function setAuth(data: AuthState | null) {
        setAuthState(data);

        if (data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    async function logout() {
        setAuth(null);
    }

    // 🔹 Login CANDIDATO
    async function login({ email, password }: { email: string; password: string }) {
        const res = await fetch("http://localhost:3333/candidate/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || "Erro ao fazer login");
        }

        const newAuth: AuthState = {
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            role: "candidate",
            user: json.candidate,
        };

        setAuth(newAuth);
    }

    // 🔹 Login RECRUITER
    async function loginRecruiter({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) {
        const res = await fetch("http://localhost:3333/recruiter/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || "Erro ao fazer login");
        }

        const newAuth: AuthState = {
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            role: "recruiter",
            user: json.recruiter,
        };

        setAuth(newAuth);
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