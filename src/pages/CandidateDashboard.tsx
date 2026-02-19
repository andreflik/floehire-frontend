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

    const [newEdu, setNewEdu] = useState({
        escolaridade: "",
        curso: "",
        instituicao: "",
        ano_conclusao: "",
        certificacoes: "",
        idiomas: "",
    });

    const [newExp, setNewExp] = useState({
        job_title: "",
        responsibilities: "",
        start_date: "",
        end_date: "",
    });

    async function loadProfile() {
        try {
            const json = await get<ProfileData>("/candidate/profile", auth.access_token);
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar perfil");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.access_token]);

    async function handleSave() {
        if (!data) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await put(
                "/candidate/updateProfile",
                {
                    full_name: data.full_name,
                    phone: data.phone,
                    city: data.city,
                    state: data.state,
                    linkedin_url: data.linkedin_url,
                    github_url: data.github_url,
                    portfolio_url: data.portfolio_url,
                },
                auth.access_token,
            );

            setSuccess("Perfil atualizado com sucesso!");
            await loadProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar perfil");
        } finally {
            setSaving(false);
        }
    }

    async function handleAddEducation() {
        try {
            await put(
                "/candidate/updateProfile",
                { education: [newEdu] },
                auth.access_token,
            );

            setNewEdu({
                escolaridade: "",
                curso: "",
                instituicao: "",
                ano_conclusao: "",
                certificacoes: "",
                idiomas: "",
            });

            await loadProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao adicionar formação");
        }
    }

    async function handleAddExperience() {
        try {
            await put(
                "/candidate/updateProfile",
                { experiences: [newExp] },
                auth.access_token,
            );

            setNewExp({
                job_title: "",
                responsibilities: "",
                start_date: "",
                end_date: "",
            });

            await loadProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao adicionar experiência");
        }
    }

    async function handleDeleteEducation(id: string) {
        if (!confirm("Remover esta formação?")) return;

        await del(`/candidate/education/${id}`, auth.access_token);
        await loadProfile();
    }

    async function handleDeleteExperience(id: string) {
        if (!confirm("Remover esta experiência?")) return;

        await del(`/candidate/experiences/${id}`, auth.access_token);
        await loadProfile();
    }

    if (loading) return <p className="text-gray-600">Carregando perfil...</p>;
    if (!data) return <p className="text-red-600">Erro ao carregar perfil</p>;

    return (
        <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Meu Perfil</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

            {/* Dados básicos */}
            <div className="space-y-4">
                <Input label="Nome completo" value={data.full_name} onChange={(v) => setData({ ...data, full_name: v })} />
                <Input label="E-mail" value={data.email} disabled />
                <Input label="Telefone" value={data.phone || ""} onChange={(v) => setData({ ...data, phone: v })} />
                <Input label="Cidade" value={data.city || ""} onChange={(v) => setData({ ...data, city: v })} />
                <Input label="Estado" value={data.state || ""} onChange={(v) => setData({ ...data, state: v })} />
                <Input label="LinkedIn" value={data.linkedin_url || ""} onChange={(v) => setData({ ...data, linkedin_url: v })} />
                <Input label="GitHub" value={data.github_url || ""} onChange={(v) => setData({ ...data, github_url: v })} />
                <Input label="Portfólio" value={data.portfolio_url || ""} onChange={(v) => setData({ ...data, portfolio_url: v })} />

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:opacity-90 disabled:opacity-60"
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>

            {/* Formação */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-3">Formação</h3>

                <div className="space-y-3 mb-6">
                    {data.candidate_education.map((edu) => (
                        <div key={edu.id} className="border p-3 rounded mb-2">
                            <div className="font-semibold">{edu.escolaridade}</div>
                            <div className="text-sm text-gray-600">{edu.curso}</div>

                            <button
                                onClick={() => {
                                    console.log("ID da education:", edu.id);
                                    handleDeleteEducation(edu.id);
                                }}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Remover
                            </button>
                        </div>
                    ))}
                </div>

                <div className="border p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold">Adicionar formação</h4>
                    <Input label="Escolaridade" value={newEdu.escolaridade} onChange={(v) => setNewEdu({ ...newEdu, escolaridade: v })} />
                    <Input label="Curso" value={newEdu.curso} onChange={(v) => setNewEdu({ ...newEdu, curso: v })} />
                    <Input label="Instituição" value={newEdu.instituicao} onChange={(v) => setNewEdu({ ...newEdu, instituicao: v })} />
                    <Input label="Ano" value={newEdu.ano_conclusao} onChange={(v) => setNewEdu({ ...newEdu, ano_conclusao: v })} />
                    <button onClick={handleAddEducation} className="px-4 py-2 bg-[#FFD700] rounded-lg font-semibold">
                        Adicionar formação
                    </button>
                </div>
            </div>

            {/* Experiências */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-3">Experiências</h3>

                <div className="space-y-3 mb-6">
                    {data.candidate_experiences.map((exp) => (
                        <div key={exp.id} className="border p-4 rounded-lg flex justify-between">
                            <div>
                                <p className="font-medium">{exp.job_title}</p>
                                <p className="text-sm text-gray-600">{exp.start_date} até {exp.end_date || "Atual"}</p>
                            </div>
                            <button onClick={() => handleDeleteExperience(exp.id)} className="text-red-600 text-sm">
                                Remover
                            </button>
                        </div>
                    ))}
                </div>

                <div className="border p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold">Adicionar experiência</h4>
                    <Input label="Cargo" value={newExp.job_title} onChange={(v) => setNewExp({ ...newExp, job_title: v })} />
                    <Input label="Início (YYYY-MM)" value={newExp.start_date} onChange={(v) => setNewExp({ ...newExp, start_date: v })} />
                    <Input label="Fim (YYYY-MM)" value={newExp.end_date} onChange={(v) => setNewExp({ ...newExp, end_date: v })} />
                    <Input label="Responsabilidades" value={newExp.responsibilities} onChange={(v) => setNewExp({ ...newExp, responsibilities: v })} />
                    <button onClick={handleAddExperience} className="px-4 py-2 bg-[#FFD700] rounded-lg font-semibold">
                        Adicionar experiência
                    </button>
                </div>
            </div>
        </div >
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