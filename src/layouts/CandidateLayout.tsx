import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function CandidateLayout() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const TITLES_BY_PATH: Record<string, string> = {
        "/candidate/dashboard": "Painel do Candidato",
        "/candidate/jobs": "Buscar Vagas",
        "/candidate/applications": "Minhas Candidaturas",
        "/candidate/profile": "Meu Perfil",
        "/candidate/history": "Histórico",
    };

    const title = TITLES_BY_PATH[location.pathname] || "Área do Candidato";

    const isDashboard = location.pathname === "/candidate/dashboard";

    function handleLogout() {
        logout();
        navigate("/login/candidate");
    }

    function handleBack() {
        navigate(-1);
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Top bar */}
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{title}</p>
                        <h1 className="text-lg font-bold text-black">
                            Olá, {auth.candidate?.full_name || "Candidato"} 👋
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isDashboard && (
                            <button
                                onClick={handleBack}
                                className="
                                    px-4 py-2 rounded-lg text-sm font-semibold
                                    bg-[#FFD700] text-black shadow-sm
                                    transition-colors duration-200
                                    hover:opacity-90
                                "
                            >
                                Voltar
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="
                px-4 py-2 rounded-lg text-sm font-semibold
                bg-[#FFD700] text-black shadow-sm
                transition-colors duration-200
                hover:bg-red-600 hover:text-white
              "
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo da página */}
            <main className="max-w-5xl mx-auto px-4 py-10">
                <Outlet />
            </main>
        </div>
    );
}