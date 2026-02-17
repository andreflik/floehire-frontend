import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { auth } = useAuth();

    const isAuthenticated = Boolean(auth?.access_token);

    if (!isAuthenticated) return <Navigate to="/login/candidate" replace />;

    return <>{children}</>;
}