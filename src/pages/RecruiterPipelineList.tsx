import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";

type Job = {
    id: string;
    title: string;
    status: string;
    created_at: string;
};

export default function RecruiterPipelineList() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadJobs() {
            const res = await fetch(`${API_URL}/jobs`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });

            const data = await res.json();
            setJobs(data);
            setLoading(false);
        }

        loadJobs();
    }, []);

    if (loading) {
        return <div className="p-6">Carregando vagas...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Selecione uma vaga</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                    <button
                        key={job.id}
                        onClick={() => navigate(`/recruiter/pipeline/${job.id}`)}
                        className="
              text-left
              border border-gray-200
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
              bg-white
            "
                    >
                        <h2 className="text-lg font-semibold text-black">
                            {job.title}
                        </h2>

                        <p className="text-sm text-gray-600 mt-1">
                            Status: {job.status}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}