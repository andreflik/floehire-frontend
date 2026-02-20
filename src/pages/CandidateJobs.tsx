import { useEffect, useState } from "react";
import { API_URL } from "../services/api";

type Job = {
    id: string;
    title: string;
    description?: string | null;
    requirements?: string | null;
    city: string | null;
    state: string | null;
    work_model: string | null;
    contract_type: string | null;
    hire_type?: string | null;
    seniority?: string | null;
    salary_min?: number | null;
    salary_max?: number | null;
    deadline?: string | null;
    opened_at?: string | null;
    status?: string;
    hasApplied?: boolean;
};

export default function CandidateJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applying, setApplying] = useState(false);

    function getToken(): string | null {
        const authRaw = localStorage.getItem("floehire:auth");
        const auth = authRaw ? JSON.parse(authRaw) : null;
        return auth?.access_token ?? null;
    }

    async function loadMyApplications(): Promise<string[]> {
        const token = getToken();
        if (!token) return [];

        const res = await fetch(`${API_URL}/applications/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return [];

        const data = await res.json();

        return data.map((app: any) => app.job_id);
    }

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                const [jobsRes, appliedJobIds] = await Promise.all([
                    fetch(`${API_URL}/public/jobs`).then((r) => r.json()),
                    loadMyApplications(),
                ]);

                const jobsData = jobsRes.data ?? jobsRes;

                const jobsWithAppliedFlag: Job[] = jobsData.map((job: Job) => ({
                    ...job,
                    hasApplied: appliedJobIds.includes(job.id),
                }));

                setJobs(jobsWithAppliedFlag);
            } catch {
                setError("Erro ao carregar vagas");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    async function openJobDetails(jobId: string) {
        try {
            const res = await fetch(`${API_URL}/jobs/public/${jobId}`);
            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Erro ao carregar detalhes da vaga");
            }

            const jobFromList = jobs.find((j) => j.id === jobId);

            setSelectedJob({
                ...(json.data ?? json),
                hasApplied: jobFromList?.hasApplied ?? false,
            });

            setIsModalOpen(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao abrir vaga");
        }
    }

    async function applyToJob(jobId: string) {
        try {
            setApplying(true);

            const token = getToken();

            if (!token) {
                throw new Error("Você precisa estar logado para se candidatar.");
            }

            const res = await fetch(`${API_URL}/applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    job_id: jobId,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || json.error || "Erro ao se candidatar");
            }

            setJobs((prev) =>
                prev.map((job) =>
                    job.id === jobId ? { ...job, hasApplied: true } : job
                )
            );

            if (selectedJob) {
                setSelectedJob({ ...selectedJob, hasApplied: true });
            }

            alert("Candidatura realizada com sucesso!");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao se candidatar");
        } finally {
            setApplying(false);
        }
    }

    function formatDate(date?: string | null) {
        if (!date) return "Não informado";
        return new Date(date).toLocaleDateString();
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {loading && <p className="text-gray-600">Carregando vagas...</p>}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {!loading && !error && jobs.length === 0 && (
                    <p className="text-gray-600">Nenhuma vaga disponível no momento.</p>
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
                                {job.work_model ?? "Modelo não informado"} •{" "}
                                {job.contract_type ?? "Contrato não informado"}
                            </p>

                            <div className="mt-4 flex justify-end">
                                {job.hasApplied ? (
                                    <span className="text-green-600 font-semibold text-sm">
                                        ✅ Já se inscreveu
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => openJobDetails(job.id)}
                                        className="bg-[#FFD700] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                                    >
                                        Ver detalhes
                                    </button>
                                )}
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
                            {selectedJob.work_model ?? "Modelo não informado"} •{" "}
                            {selectedJob.contract_type ?? "Contrato não informado"}
                        </p>

                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>Senioridade: {selectedJob.seniority ?? "Não informado"}</p>
                            <p>Tipo de contratação: {selectedJob.hire_type ?? "Não informado"}</p>
                            <p>
                                Salário:{" "}
                                {selectedJob.salary_min && selectedJob.salary_max
                                    ? `R$ ${selectedJob.salary_min} - R$ ${selectedJob.salary_max}`
                                    : "Não informado"}
                            </p>
                            <p>Prazo: {formatDate(selectedJob.deadline)}</p>
                            <p>Status: {selectedJob.status ?? "Não informado"}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-1">Descrição</h3>
                            <p className="text-gray-700 text-sm">
                                {selectedJob.description ?? "Sem descrição informada."}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold transition hover:bg-red-600 hover:text-white"
                            >
                                Fechar
                            </button>

                            {selectedJob.hasApplied ? (
                                <button
                                    disabled
                                    className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold opacity-70 cursor-not-allowed"
                                >
                                    Já inscrito
                                </button>
                            ) : (
                                <button
                                    onClick={() => applyToJob(selectedJob.id)}
                                    disabled={applying}
                                    className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold transition hover:bg-green-600 hover:text-white disabled:opacity-50"
                                >
                                    {applying ? "Candidatando..." : "Candidatar-se"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}