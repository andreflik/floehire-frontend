import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";

/* =======================
   Types
======================= */

type Candidate = {
    id: string;
    full_name: string;
    email: string;
};

type PipelineApplication = {
    application_id: string;
    rating: number | null;
    notes: string | null;
    candidate: Candidate;
};

type PipelineStage = {
    id: string;
    name: string;
    order: number;
    candidates: PipelineApplication[];
};

type PipelineResponse = {
    job_id: string;
    stages: PipelineStage[];
};

/* =======================
   Component
======================= */

export default function RecruiterPipeline() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [pipeline, setPipeline] = useState<PipelineResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadPipeline() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_URL}/pipeline/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erro ao carregar pipeline");
            }

            setPipeline(data);
        } catch (err: any) {
            setError(err.message || "Erro inesperado ao carregar pipeline");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (jobId) {
            loadPipeline();
        }
    }, [jobId]);

    if (loading) {
        return <div className="p-6">Carregando pipeline...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                {error}
            </div>
        );
    }

    if (!pipeline) {
        return null;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/recruiter/pipeline")}
                    className="
            mr-4
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-[#FFD700] text-black
            shadow-sm
            hover:opacity-90
            transition
          "
                    title="Voltar"
                >
                    ←
                </button>

                <h1 className="text-2xl font-bold text-black">
                    Pipeline da Vaga
                </h1>
            </div>

            {/* Kanban */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {pipeline.stages.map((stage) => (
                    <div
                        key={stage.id}
                        className="
              min-w-[280px]
              bg-gray-50
              border border-gray-200
              rounded-2xl
              p-4
              shadow-sm
            "
                    >
                        {/* Column header */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-black">
                                {stage.name}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {stage.candidates.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3">
                            {stage.candidates.length === 0 && (
                                <div className="text-sm text-gray-400">
                                    Nenhum candidato nesta etapa
                                </div>
                            )}

                            {stage.candidates.map((app) => (
                                <div
                                    key={app.application_id}
                                    className="
                    bg-white
                    border border-gray-200
                    rounded-xl
                    p-3
                    shadow-sm
                    hover:shadow-md
                    transition
                  "
                                >
                                    <div className="font-medium text-black">
                                        {app.candidate.full_name}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {app.candidate.email}
                                    </div>

                                    {app.rating !== null && (
                                        <div className="text-sm mt-1">
                                            ⭐ {app.rating}/5
                                        </div>
                                    )}

                                    {app.notes && (
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {app.notes}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => alert("Depois ligamos o mover de etapa 😉")}
                                        className="
                      mt-2
                      text-sm
                      text-blue-600
                      hover:underline
                    "
                                    >
                                        Mover de etapa
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}