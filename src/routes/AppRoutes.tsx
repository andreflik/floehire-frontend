import { Routes, Route, Navigate } from "react-router-dom";
import CandidateLogin from "../pages/CandidateLogin";
import CandidateRegisterWizard from "../pages/CandidateRegisterWizard";
import CandidateDashboard from "../pages/CandidateDashboard";
import CandidateJobs from "../pages/CandidateJobs";
import CandidateProfile from "../pages/CandidateProfile";
import ProtectedRoute from "./../routes/ProtectedRoutes";
import CandidateLayout from "../layouts/CandidateLayout";
import Home from "../pages/Home";
import CandidateApplications from "../pages/CandidateApplications";
import CandidateHistory from "../pages/CandidateHIstory";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/candidate" element={<CandidateLogin />} />
            <Route path="/register/candidate" element={<CandidateRegisterWizard />} />

            {/* Área protegida do candidato */}
            <Route
                path="/candidate"
                element={
                    <ProtectedRoute>
                        <CandidateLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="jobs" element={<CandidateJobs />} />
                <Route path="profile" element={<CandidateProfile />} />
                <Route path="applications" element={<CandidateApplications />} />
                <Route path="history" element={<CandidateHistory />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}