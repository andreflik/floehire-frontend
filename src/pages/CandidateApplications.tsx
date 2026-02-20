import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import {
    STATUS_LABELS,
    HIRE_TYPE_LABELS,
    WORK_MODEL_LABELS,
    CONTRACT_TYPE_LABELS,
    SENIORITY_LABELS,
} from "../utils/labels";

type Job = {
    id: string;
    title: string;
    description?: string | null;
    city: string | null;
    state: string | null;
    work_model: string | null;
    contract_type: string | null;
    hire_type?: string | null;
    seniority?: string | null;
    salary_min?: number | null;
    salary_max?: number | null;
    deadline?: string | null;
    status?: string | null;
};

export default function CandidateApplications() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🔐 Helper para pegar token
    function getToken(): string | null {
        const authRaw = localStorage.getItem("floehire:auth");
        const auth = authRaw ? JSON.parse(authRaw) : null;
        return auth?.access_token ?? null;
    }

    // 📌 Carrega minhas candidaturas e depois busca os detalhes das vagas
    useEffect(() => {
        async function loadMyJobs() {
            try {
                setLoading(true);

                const token = getToken();
                if (!token) {
                    throw new Error("Você precisa estar logado.");
                }

                // 1) Busca minhas candidaturas
                const resApps = await fetch(`${API_URL}/applications/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!resApps.ok) {
                    throw new Error("Erro ao carregar suas candidaturas");
                }

                const applications = await resApps.json();
                // Esperado: [{ job_id: "..." }, ...]

                const jobIds: string[] = applications.map((app: any) => app.job_id);

                if (jobIds.length === 0) {
                    setJobs([]);
                    return;
                }

                // 2) Busca detalhes de cada vaga
                const jobsPromises = jobIds.map((jobId) =>
                    fetch(`${API_URL}/jobs/public/${jobId}`).then((r) => r.json())
                );

                const jobsResults = await Promise.all(jobsPromises);

                const jobsData: Job[] = jobsResults.map((j: any) => j.data ?? j);

                setJobs(jobsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }

        loadMyJobs();
    }, []);

    async function openJobDetails(jobId: string) {
        try {
            const res = await fetch(`${API_URL}/jobs/public/${jobId}`);
            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Erro ao carregar detalhes da vaga");
            }

            setSelectedJob(json.data ?? json);
            setIsModalOpen(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao abrir vaga");
        }
    }

    function formatDate(date?: string | null) {
        if (!date) return "Não informado";
        return new Date(date).toLocaleDateString("pt-BR");
    }

    function formatMoney(min?: number | null, max?: number | null) {
        if (!min || !max) return "Não informado";
        return `R$ ${min.toLocaleString("pt-BR")} - R$ ${max.toLocaleString("pt-BR")}`;
    }

    function labelOf(map: Record<string, string>, value?: string | null) {
        if (!value) return "Não informado";
        return map[value] ?? value;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Minhas Candidaturas</h1>

                {loading && <p className="text-gray-600">Carregando suas vagas...</p>}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {!loading && !error && jobs.length === 0 && (
                    <p className="text-gray-600">
                        Você ainda não se candidatou a nenhuma vaga.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
                        >
                            <h2 className="text-lg font-semibold text-black">{job.title}</h2>

                            <p className="text-gray-600 text-sm mt-1">
                                {job.city && job.state
                                    ? `${job.city} - ${job.state}`
                                    : "Localização não informada"}
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                                {labelOf(WORK_MODEL_LABELS, job.work_model)} •{" "}
                                {labelOf(CONTRACT_TYPE_LABELS, job.contract_type)}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-green-600 font-semibold text-sm flex items-center gap-2">
                                    ✅ Já se inscreveu
                                </span>

                                <button
                                    onClick={() => openJobDetails(job.id)}
                                    className="bg-[#FFD700] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-2">{selectedJob.title}</h2>

                        <p className="text-gray-600 text-sm mb-2">
                            {selectedJob.city && selectedJob.state
                                ? `${selectedJob.city} - ${selectedJob.state}`
                                : "Localização não informada"}
                        </p>

                        <p className="text-gray-500 text-sm mb-2">
                            {labelOf(WORK_MODEL_LABELS, selectedJob.work_model)} •{" "}
                            {labelOf(CONTRACT_TYPE_LABELS, selectedJob.contract_type)}
                        </p>

                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>Senioridade: {labelOf(SENIORITY_LABELS, selectedJob.seniority)}</p>
                            <p>
                                Tipo de contratação:{" "}
                                {labelOf(HIRE_TYPE_LABELS, selectedJob.hire_type)}
                            </p>
                            <p>Salário: {formatMoney(selectedJob.salary_min, selectedJob.salary_max)}</p>
                            <p>Prazo: {formatDate(selectedJob.deadline)}</p>
                            <p>Status: {labelOf(STATUS_LABELS, selectedJob.status)}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-1">Descrição</h3>
                            <p className="text-gray-700 text-sm">
                                {selectedJob.description ?? "Sem descrição informada."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-green-600 font-semibold flex items-center gap-2">
                                ✅ Candidatou
                            </span>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold transition hover:bg-red-600 hover:text-white"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}