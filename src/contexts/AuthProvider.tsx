import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";
import { post } from "../services/api";

const STORAGE_KEY = "floehire:auth";

function getInitialAuth(): AuthState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return null;
    }

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
        if (auth?.refresh_token) {
            try {
                await post<{ message: string }, { refresh_token: string }>(
                    "/candidate/logout",
                    { refresh_token: auth.refresh_token }
                );
            } catch {
                console.warn("Erro ao deslogar no backend, limpando sessão local");
            }
        }

        // Limpa sessão local de qualquer forma
        setAuth(null);
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