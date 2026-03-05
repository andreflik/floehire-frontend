import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";
import { toast } from "sonner";

type Job = {
    id: string;
    title: string;
    description?: string;
    seniority?: string;
    work_model?: string;
    contract_type?: string;
    city?: string;
    state?: string;
    salary_min?: number;
    salary_max?: number;
};

export default function RecruiterEditJob() {
    const { jobId } = useParams<{ jobId: string }>();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState<Job | null>(null);

    async function loadJob() {
        try {
            const res = await fetch(`${API_URL}/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error);

            setJob(data);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateJob() {
        try {
            const res = await fetch(`${API_URL}/jobs/${jobId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth?.access_token}`,
                },
                body: JSON.stringify(job),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error);

            toast.success("Vaga atualizada com sucesso 🚀");

            navigate("/recruiter/jobs");
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if (jobId) loadJob();
    }, [jobId]);

    if (loading) return <div className="p-6">Carregando vaga...</div>;

    if (!job) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                Editar vaga
            </h1>

            <div className="space-y-4">

                {/* Título */}
                <div>
                    <label className="text-sm font-medium">Título</label>
                    <input
                        value={job.title}
                        onChange={(e) =>
                            setJob({ ...job, title: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 mt-1"
                    />
                </div>

                {/* Senioridade */}
                <div>
                    <label className="text-sm font-medium">Senioridade</label>
                    <select
                        value={job.seniority || ""}
                        onChange={(e) =>
                            setJob({ ...job, seniority: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 mt-1"
                    >
                        <option value="">Selecione</option>
                        <option value="Junior">Junior</option>
                        <option value="Pleno">Pleno</option>
                        <option value="Senior">Senior</option>
                    </select>
                </div>

                {/* Modelo de trabalho */}
                <div>
                    <label className="text-sm font-medium">
                        Modelo de trabalho
                    </label>
                    <select
                        value={job.work_model || ""}
                        onChange={(e) =>
                            setJob({ ...job, work_model: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 mt-1"
                    >
                        <option value="">Selecione</option>
                        <option value="REMOTE">Remoto</option>
                        <option value="HYBRID">Híbrido</option>
                        <option value="ONSITE">Presencial</option>
                    </select>
                </div>

                {/* Cidade */}
                <div>
                    <label className="text-sm font-medium">Cidade</label>
                    <input
                        value={job.city || ""}
                        onChange={(e) =>
                            setJob({ ...job, city: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 mt-1"
                    />
                </div>

                {/* Descrição */}
                <div>
                    <label className="text-sm font-medium">
                        Descrição
                    </label>
                    <textarea
                        rows={5}
                        value={job.description || ""}
                        onChange={(e) =>
                            setJob({ ...job, description: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 mt-1"
                    />
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">

                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={updateJob}
                        className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold"
                    >
                        Salvar alterações
                    </button>

                </div>

            </div>
        </div>
    );
}