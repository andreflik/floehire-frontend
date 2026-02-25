import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

type Props = {
    children: ReactNode;
    role?: "candidate" | "recruiter";
};

export default function ProtectedRoute({ children, role }: Props) {
    const { auth } = useAuth();

    const isAuthenticated = Boolean(auth?.access_token);

    if (!isAuthenticated) {
        if (role === "recruiter") {
            return <Navigate to="/login/recruiter" replace />;
        }
        return <Navigate to="/login/candidate" replace />;
    }

    if (role && auth?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}