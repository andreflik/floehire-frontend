import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";

const STORAGE_KEY = "floehire:auth";

function getInitialAuth(): AuthState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return { access_token: null, refresh_token: null, candidate: null };
    }
    try {
        return JSON.parse(raw) as AuthState;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return { access_token: null, refresh_token: null, candidate: null };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuthState] = useState<AuthState>(() => getInitialAuth());

    function setAuth(data: AuthState) {
        setAuthState(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function logout() {
        setAuthState({ access_token: null, refresh_token: null, candidate: null });
        localStorage.removeItem(STORAGE_KEY);
    }

    async function login(data: { email: string; password: string }) {
        const res = await fetch("http://localhost:3333/candidate/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || "Erro ao fazer login");
        }

        const newAuth: AuthState = {
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            candidate: json.candidate,
        };

        setAuth(newAuth);
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
}