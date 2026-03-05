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
import CandidateHistory from "../pages/CandidateHistory";
import RecruiterLogin from "../pages/RecruiterLogin";
import RecruiterRegister from "../pages/RecruiterRegister";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import RecruiterLayout from "../layouts/RecruiterLayout";
import RecruiterJobNew from "../pages/RecruiterJobNew";
import RecruiterPipeline from "../pages/RecruiterPipeline";
import RecruiterPipelineList from "../pages/RecruiterPipelineList";
import RecruiterJobs from "../pages/RecruiterJobs";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/candidate" element={<CandidateLogin />} />
            <Route path="/login/recruiter" element={<RecruiterLogin />} />
            <Route path="/register/candidate" element={<CandidateRegisterWizard />} />
            <Route path="/register/recruiter" element={<RecruiterRegister />} />

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

            <Route
                path="/recruiter"
                element={
                    <ProtectedRoute role="recruiter">
                        <RecruiterLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
                <Route path="jobs/new" element={<RecruiterJobNew />} />
                <Route path="pipeline" element={<RecruiterPipelineList />} />
                <Route path="pipeline/:jobId" element={<RecruiterPipeline />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}