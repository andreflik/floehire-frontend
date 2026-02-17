import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import PageHeader from "../components/PageHeader";

type Job = {
    id: string;
    title: string;
    city: string | null;
    state: string | null;
    work_model: string | null;
    contract_type: string | null;
};

export default function CandidateJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadJobs() {
            try {
                const res = await fetch(`${API_URL}/jobs/public`);
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.message || "Erro ao carregar vagas");
                }

                setJobs(json.data ?? json);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Erro inesperado");
            } finally {
                setLoading(false);
            }
        }

        loadJobs();
    }, []);

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
                                <button
                                    onClick={() => alert("Depois: detalhe da vaga / candidatar")}
                                    className="bg-[#FFD700] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}