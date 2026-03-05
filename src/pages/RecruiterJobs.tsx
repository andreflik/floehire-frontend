import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";
import { toast } from "sonner";
import { JOB_STATUS_CLASSES, JOB_STATUS_LABELS } from "../utils/labels";

type Job = {
    id: string;
    title: string;
    status: string;
    candidates: number;
    created_at: string;
};

export default function RecruiterJobs() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadJobs() {
        try {
            const res = await fetch(`${API_URL}/jobs`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erro ao carregar vagas");
            }

            setJobs(data);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadJobs();
    }, []);

    if (loading) {
        return <div className="p-6">Carregando vagas...</div>;
    }

    return (
        <div className="p-4 md:p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-2xl font-bold">Minhas vagas</h1>
                    <p className="text-gray-500 text-sm">
                        Gerencie as vagas da sua empresa
                    </p>
                </div>

                <button
                    onClick={() => navigate("/recruiter/jobs/new")}
                    className="
            bg-[#FFD700]
            text-black
            font-semibold
            px-4 py-2
            rounded-lg
            hover:opacity-90
            transition
          "
                >
                    + Nova vaga
                </button>
            </div>

            {/* LISTA */}
            {jobs.length === 0 ? (
                <div className="text-gray-500">
                    Você ainda não criou nenhuma vaga.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="
                bg-white
                border
                border-gray-200
                rounded-xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
              "
                        >
                            {/* Título */}
                            <h2 className="font-semibold text-lg text-black">
                                {job.title}
                            </h2>

                            {/* Status */}
                            <div className="mt-2 flex items-center gap-2">
                                <span
                                    className={`
                                        text-xs
                                        font-semibold
                                        px-2 py-1
                                        rounded-lg
                                        ${JOB_STATUS_CLASSES[job.status] ?? "bg-gray-100 text-gray-600"}
                                    `}
                                >
                                    {JOB_STATUS_LABELS[job.status] ?? job.status}
                                </span>

                                <span className="text-xs text-gray-500">
                                    {job.candidates} candidatos
                                </span>
                            </div>

                            {/* Data */}
                            <p className="text-xs text-gray-400 mt-2">
                                Criada em {new Date(job.created_at).toLocaleDateString()}
                            </p>

                            {/* BOTÕES */}
                            <div className="flex gap-2 mt-4">

                                <button
                                    onClick={() => navigate(`/recruiter/pipeline/${job.id}`)}
                                    className="
                    flex-1
                    bg-yellow-100
                    text-black
                    text-sm
                    font-semibold
                    py-2
                    rounded-lg
                    hover:bg-yellow-200
                    transition
                  "
                                >
                                    Pipeline
                                </button>

                                <button
                                    onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
                                    className="
                    flex-1
                    border
                    border-gray-200
                    text-sm
                    py-2
                    rounded-lg
                    hover:bg-gray-50
                    transition
                  "
                                >
                                    Editar
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}