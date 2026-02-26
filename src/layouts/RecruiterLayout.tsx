import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function RecruiterLayout() {
    const navigate = useNavigate();
    const { logout, auth } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login/recruiter");
    }

    const companyName =
        auth?.role === "recruiter" && auth.user && "company_name" in auth.user
            ? auth.user.company_name
            : "Recruiter";

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-black">FloeHire</h1>
                    <p className="text-sm text-gray-500 mt-1">{companyName}</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem to="/recruiter/dashboard" label="Dashboard" />
                    <NavItem to="/recruiter/jobs" label="Minhas Vagas" />
                    <NavItem to="/recruiter/pipeline" label="Pipeline de Seleção" />
                    <NavItem to="/recruiter/candidates" label="Candidatos" />
                    <NavItem to="/recruiter/profile" label="Perfil da Empresa" />
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-6 text-left text-red-600 font-semibold hover:underline"
                >
                    Sair
                </button>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `
        block px-4 py-2 rounded-lg font-medium transition
        ${isActive
                    ? "bg-yellow-100 text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }
      `
            }
        >
            {label}
        </NavLink>
    );
}