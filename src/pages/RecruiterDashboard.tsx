import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
    const navigate = useNavigate();

    const metrics = {
        openJobs: 5,
        closedJobs: 12,
        activeCandidates: 34,
        avgTimeToHire: 18, // dias
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Dashboard do Recrutador</h1>

            {/* 🔢 Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Vagas abertas" value={metrics.openJobs} />
                <MetricCard title="Vagas concluídas" value={metrics.closedJobs} />
                <MetricCard title="Candidatos ativos" value={metrics.activeCandidates} />
                <MetricCard title="Tempo médio (dias)" value={metrics.avgTimeToHire} />
            </div>

            {/* 🚀 Ações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard
                    title="Criar nova vaga"
                    desc="Publique uma nova oportunidade para candidatos."
                    onClick={() => navigate("/recruiter/jobs/new")}
                />

                <ActionCard
                    title="Minhas vagas"
                    desc="Gerencie suas vagas e pipelines de seleção."
                    onClick={() => navigate("/recruiter/jobs")}
                />

                <ActionCard
                    title="Pipeline de seleção"
                    desc="Visualize e mova candidatos pelas etapas."
                    onClick={() => navigate("/recruiter/pipeline")}
                />

                <ActionCard
                    title="Relatórios e insights"
                    desc="Acompanhe métricas de performance do recrutamento."
                    onClick={() => navigate("/recruiter/reports")}
                />

                <ActionCard
                    title="Banco de talentos"
                    desc="Gerencie candidatos e currículos."
                    onClick={() => navigate("/recruiter/candidates")}
                />

                <ActionCard
                    title="Perfil da empresa"
                    desc="Edite as informações da sua empresa."
                    onClick={() => navigate("/recruiter/profile")}
                />
            </div>
        </div>
    );
}

/* =======================
   Componentes auxiliares
======================= */

function MetricCard({ title, value }: { title: string; value: number | string }) {
    return (
        <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-black mt-1">{value}</p>
        </div>
    );
}

function ActionCard({
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