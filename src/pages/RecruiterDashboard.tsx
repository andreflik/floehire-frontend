import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard do Recruiter</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    title="Criar nova vaga"
                    desc="Publique uma nova oportunidade para candidatos."
                    onClick={() => navigate("/recruiter/jobs/new")}
                />

                <Card
                    title="Minhas vagas"
                    desc="Gerencie suas vagas publicadas."
                    onClick={() => navigate("/recruiter/jobs")}
                />

                <Card
                    title="Candidatos"
                    desc="Acompanhe candidatos e etapas do processo."
                    onClick={() => navigate("/recruiter/candidates")}
                />

                <Card
                    title="Perfil da empresa"
                    desc="Edite as informações da sua empresa."
                    onClick={() => navigate("/recruiter/profile")}
                />
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