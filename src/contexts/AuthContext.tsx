import { createContext } from "react";

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
    auth: AuthState;
    setAuth: (data: AuthState) => void;
    logout: () => void;
    login: (data: { email: string; password: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);