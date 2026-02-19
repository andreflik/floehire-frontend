import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { get, put, del } from "../services/api";

type Education = {
    id: string;
    escolaridade?: string;
    curso?: string;
    instituicao?: string;
    ano_conclusao?: string;
    certificacoes?: string;
    idiomas?: string;
};

type Experience = {
    id: string;
    job_title?: string;
    responsibilities?: string;
    start_date?: string;
    end_date?: string;
};

type ProfileData = {
    full_name: string;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    candidate_education: Education[];
    candidate_experiences: Experience[];
};

export default function CandidateProfile() {
    const { auth } = useAuth();
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const json = await get<ProfileData>("/candidate/profile", auth.access_token);
                setData(json);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro inesperado");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [auth.access_token]);

    async function refreshProfile() {
        const refreshed = await get<ProfileData>("/candidate/profile", auth.access_token);
        setData(refreshed);
    }

    async function handleDeleteEducation(id: string) {
        if (!data) return;
        if (!confirm("Remover esta formação?")) return;

        await del(`/candidate/education/${id}`, auth.access_token);

        setData({
            ...data,
            candidate_education: data.candidate_education.filter((e) => e.id !== id),
        });
    }

    async function handleDeleteExperience(id: string) {
        if (!data) return;
        if (!confirm("Remover esta experiência?")) return;

        await del(`/candidate/experiences/${id}`, auth.access_token);

        setData({
            ...data,
            candidate_experiences: data.candidate_experiences.filter((e) => e.id !== id),
        });
    }

    async function handleAddExperience(exp: {
        job_title?: string;
        responsibilities?: string;
        start_date?: string;
        end_date?: string;
    }) {
        await put(
            "/candidate/updateProfile",
            { experiences: [exp] },
            auth.access_token
        );

        await refreshProfile();
    }

    async function handleAddEducation(edu: {
        escolaridade?: string;
        curso?: string;
        instituicao?: string;
        ano_conclusao?: string;
        certificacoes?: string;
        idiomas?: string;
    }) {
        try {
            await put(
                "/candidate/updateProfile",
                { education: [edu] },
                auth.access_token
            );

            await refreshProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao adicionar formação");
        }
    }

    async function handleSave() {
        if (!data) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // 🔥 Monta payload só com campos definidos
            const payload: any = {
                full_name: data.full_name,
            };

            if (data.phone !== null) payload.phone = data.phone;
            if (data.city !== null) payload.city = data.city;
            if (data.state !== null) payload.state = data.state;
            if (data.linkedin_url !== null) payload.linkedin_url = data.linkedin_url;
            if (data.github_url !== null) payload.github_url = data.github_url;
            if (data.portfolio_url !== null) payload.portfolio_url = data.portfolio_url;

            await put("/candidate/updateProfile", payload, auth.access_token);

            setSuccess("Perfil atualizado com sucesso!");
            await refreshProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar perfil");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p className="text-gray-600">Carregando perfil...</p>;
    }

    if (!data) {
        return <p className="text-red-600">Erro ao carregar perfil</p>;
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Meu Perfil</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
            )}

            <div className="space-y-4">
                <Input
                    label="Nome completo"
                    value={data.full_name}
                    onChange={(v) => setData({ ...data, full_name: v })}
                />
                <Input label="E-mail" value={data.email} disabled />
                <Input
                    label="Telefone"
                    value={data.phone || ""}
                    onChange={(v) => setData({ ...data, phone: v })}
                />
                <Input
                    label="Cidade"
                    value={data.city || ""}
                    onChange={(v) => setData({ ...data, city: v })}
                />
                <Input
                    label="Estado"
                    value={data.state || ""}
                    onChange={(v) => setData({ ...data, state: v })}
                />
                <Input
                    label="LinkedIn"
                    value={data.linkedin_url || ""}
                    onChange={(v) => setData({ ...data, linkedin_url: v })}
                />
                <Input
                    label="GitHub"
                    value={data.github_url || ""}
                    onChange={(v) => setData({ ...data, github_url: v })}
                />
                <Input
                    label="Portfólio"
                    value={data.portfolio_url || ""}
                    onChange={(v) => setData({ ...data, portfolio_url: v })}
                />

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:opacity-90 disabled:opacity-60"
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange?: (v: string) => void;
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            <input
                value={value}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
        </div>
    );
}