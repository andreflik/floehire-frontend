import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function CandidateDashboard() {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    return (
        <div className="min-h-screen bg-white">
            {/* Top bar */}
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Painel do Candidato</p>
                        <h1 className="text-lg font-bold text-black">
                            Olá, {auth.candidate?.full_name || "Candidato"} 👋
                        </h1>
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            navigate("/login/candidate");
                        }}
                        className="text-sm font-medium text-gray-700 hover:text-black"
                    >
                        Sair
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        title="Buscar vagas"
                        desc="Explore oportunidades e candidate-se com 1 clique."
                        onClick={() => alert("Depois: tela de vagas públicas")}
                    />
                    <Card
                        title="Minhas candidaturas"
                        desc="Acompanhe status e etapas do processo."
                        onClick={() => alert("Depois: tela de candidaturas")}
                    />
                    <Card
                        title="Meu perfil"
                        desc="Atualize seus dados, links e currículo."
                        onClick={() => alert("Depois: tela de perfil")}
                    />
                    <Card
                        title="Histórico"
                        desc="Veja suas candidaturas anteriores."
                        onClick={() => alert("Depois: histórico")}
                    />
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    desc,
    onClick,
}: {
    title: string;
    desc: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="text-left border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
        >
            <h2 className="text-lg font-semibold text-black">{title}</h2>
            <p className="text-gray-600 mt-1">{desc}</p>
            <div className="mt-4">
                <span className="inline-flex items-center text-sm font-semibold text-black bg-yellow-100 px-3 py-1.5 rounded-lg">
                    Acessar
                </span>
            </div>
        </button>
    );
}