import { useNavigate } from "react-router-dom";

export default function CandidateDashboard() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
                title="Buscar vagas"
                desc="Explore oportunidades e candidate-se com 1 clique."
                onClick={() => navigate("/candidate/jobs")}
            />
            <Card
                title="Minhas candidaturas"
                desc="Acompanhe status e etapas do processo."
                onClick={() => navigate("/candidate/applications")}
            />
            <Card
                title="Meu perfil"
                desc="Atualize seus dados, links e currículo."
                onClick={() => navigate("/candidate/profile")}
            />
            <Card
                title="Histórico"
                desc="Veja suas candidaturas anteriores."
                onClick={() => navigate("/candidate/history")}
            />
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