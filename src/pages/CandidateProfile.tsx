import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { get, put, del } from "../services/api";
import DatePicker from "react-datepicker";

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
    company?: string | null;
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

    const [showAddEdu, setShowAddEdu] = useState(false);
    const [showAddExp, setShowAddExp] = useState(false);

    const [editEdu, setEditEdu] = useState<Education | null>(null);
    const [editExp, setEditExp] = useState<Experience | null>(null);

    const [newEdu, setNewEdu] = useState({
        escolaridade: "",
        curso: "",
        instituicao: "",
        ano_conclusao: "",
        certificacoes: "",
        idiomas: "",
    });

    const [newExp, setNewExp] = useState({
        company: "",
        job_title: "",
        responsibilities: "",
        start_date: "",
        end_date: "",
    });

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.access_token]);

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

    async function refreshProfile() {
        const refreshed = await get<ProfileData>("/candidate/profile", auth.access_token);
        setData(refreshed);
    }

    async function handleSaveProfile() {
        if (!data) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
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

    async function handleDeleteEducation(id: string) {
        if (!confirm("Remover esta formação?")) return;
        await del(`/candidate/education/${id}`, auth.access_token);
        await refreshProfile();
    }

    async function handleDeleteExperience(id: string) {
        if (!confirm("Remover esta experiência?")) return;
        await del(`/candidate/experiences/${id}`, auth.access_token);
        await refreshProfile();
    }

    async function handleAddEducation() {
        await put("/candidate/updateProfile", { education: [newEdu] }, auth.access_token);
        setShowAddEdu(false);
        setNewEdu({
            escolaridade: "",
            curso: "",
            instituicao: "",
            ano_conclusao: "",
            certificacoes: "",
            idiomas: "",
        });
        await refreshProfile();
    }

    async function handleAddExperience() {
        await put("/candidate/updateProfile", { experiences: [newExp] }, auth.access_token);
        setShowAddExp(false);
        setNewExp({
            company: "",
            job_title: "",
            responsibilities: "",
            start_date: "",
            end_date: "",
        });
        await refreshProfile();
    }

    async function handleUpdateEducation() {
        if (!editEdu) return;

        await del(`/candidate/education/${editEdu.id}`, auth.access_token);
        const { id, ...payload } = editEdu;

        await put("/candidate/updateProfile", { education: [payload] }, auth.access_token);
        setEditEdu(null);
        await refreshProfile();
    }

    async function handleUpdateExperience() {
        if (!editExp) return;

        await del(`/candidate/experiences/${editExp.id}`, auth.access_token);
        const { id, ...payload } = editExp;

        await put("/candidate/updateProfile", { experiences: [payload] }, auth.access_token);
        setEditExp(null);
        await refreshProfile();
    }

    if (loading) return <p>Carregando perfil...</p>;
    if (!data) return <p>Erro ao carregar perfil</p>;

    return (
        <div className="max-w-5xl mx-auto space-y-10">

            {/* ===== Card: Dados do Perfil ===== */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
                <h2 className="text-xl font-bold">Meu Perfil</h2>

                {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
                {success && <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nome" value={data.full_name} onChange={(v: string) => setData({ ...data, full_name: v })} />
                    <Input label="E-mail" value={data.email} disabled />
                    <Input label="Telefone" value={data.phone || ""} onChange={(v: string) => setData({ ...data, phone: v })} />
                    <Input label="Cidade" value={data.city || ""} onChange={(v: string) => setData({ ...data, city: v })} />
                    <Input label="Estado" value={data.state || ""} onChange={(v: string) => setData({ ...data, state: v })} />
                    <Input label="LinkedIn" value={data.linkedin_url || ""} onChange={(v: string) => setData({ ...data, linkedin_url: v })} />
                    <Input label="GitHub" value={data.github_url || ""} onChange={(v: string) => setData({ ...data, github_url: v })} />
                    <Input label="Portfólio" value={data.portfolio_url || ""} onChange={(v: string) => setData({ ...data, portfolio_url: v })} />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-6 py-2 bg-yellow-400 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        {saving ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </div>

            {/* ===== Formação ===== */}
            <Section title="Formação" onAdd={() => setShowAddEdu(true)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.candidate_education.map((edu) => (
                        <CardItem
                            key={edu.id}
                            onEdit={() => setEditEdu({ ...edu })}
                            onDelete={() => handleDeleteEducation(edu.id)}
                        >
                            <p className="font-semibold">{edu.escolaridade}</p>
                            <p>{edu.curso}</p>
                            <p className="text-sm text-gray-600">{edu.instituicao}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {edu.ano_conclusao ? `Conclusão: ${edu.ano_conclusao}` : "Em andamento"}
                            </p>
                        </CardItem>
                    ))}
                </div>
            </Section>

            {/* ===== Experiência ===== */}
            <Section title="Experiência" onAdd={() => setShowAddExp(true)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.candidate_experiences.map((exp) => (
                        <CardItem
                            key={exp.id}
                            onEdit={() =>
                                setEditExp({
                                    ...exp,
                                    start_date: exp.start_date ? exp.start_date.slice(0, 7) : "",
                                    end_date: exp.end_date ? exp.end_date.slice(0, 7) : "",
                                })
                            }
                            onDelete={() => handleDeleteExperience(exp.id)}
                        >
                            <p className="font-semibold">{exp.job_title}</p>
                            {exp.company && <p className="text-sm text-gray-600">{exp.company}</p>}
                            <p>{exp.responsibilities}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {formatMonthYear(exp.start_date)} – {exp.end_date ? formatMonthYear(exp.end_date) : "Emprego atual"}
                            </p>
                        </CardItem>
                    ))}
                </div>
            </Section>

            {/* ===== Modais (os mesmos que você já tinha) ===== */}
            {/* Mantive exatamente a lógica que você já estava usando */}

            {editEdu && (
                <Modal title="Editar formação" onClose={() => setEditEdu(null)}>
                    <Input label="Escolaridade" value={editEdu.escolaridade || ""} onChange={(v: string) => setEditEdu({ ...editEdu, escolaridade: v })} />
                    <Input label="Curso" value={editEdu.curso || ""} onChange={(v: string) => setEditEdu({ ...editEdu, curso: v })} />
                    <Input label="Instituição" value={editEdu.instituicao || ""} onChange={(v: string) => setEditEdu({ ...editEdu, instituicao: v })} />
                    <Input label="Ano" type="number" value={editEdu.ano_conclusao || ""} onChange={(v: string) => setEditEdu({ ...editEdu, ano_conclusao: v })} />
                    <ModalActions onCancel={() => setEditEdu(null)} onConfirm={handleUpdateEducation} />
                </Modal>
            )}

            {editExp && (
                <Modal title="Editar experiência" onClose={() => setEditExp(null)}>
                    <Input label="Empresa" value={editExp.company || ""} onChange={(v: string) => setEditExp({ ...editExp, company: v })} />
                    <Input label="Cargo" value={editExp.job_title || ""} onChange={(v: string) => setEditExp({ ...editExp, job_title: v })} />
                    <Input label="Descrição" value={editExp.responsibilities || ""} onChange={(v: string) => setEditExp({ ...editExp, responsibilities: v })} />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Início</label>

                            <DatePicker
                                selected={editExp.start_date ? new Date(editExp.start_date) : null}
                                onChange={(date: Date | null) =>
                                    setEditExp({
                                        ...editExp,
                                        start_date: date ? date.toISOString().slice(0, 10) : "",
                                    })
                                }
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className="w-full border rounded px-3 py-2"
                                placeholderText="Selecione o mês e ano"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Fim</label>

                            <DatePicker
                                selected={editExp.end_date ? new Date(editExp.end_date) : null}
                                onChange={(date: Date | null) =>
                                    setEditExp({
                                        ...editExp,
                                        end_date: date ? date.toISOString().slice(0, 10) : "",
                                    })
                                }
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className="w-full border rounded px-3 py-2"
                                placeholderText="Selecione o mês e ano"
                            />
                        </div>
                    </div>
                    <ModalActions onCancel={() => setEditExp(null)} onConfirm={handleUpdateExperience} />
                </Modal>
            )}

            {showAddEdu && (
                <Modal title="Adicionar formação" onClose={() => setShowAddEdu(false)}>
                    <Input label="Escolaridade" value={newEdu.escolaridade} onChange={(v: string) => setNewEdu({ ...newEdu, escolaridade: v })} />
                    <Input label="Curso" value={newEdu.curso} onChange={(v: string) => setNewEdu({ ...newEdu, curso: v })} />
                    <Input label="Instituição" value={newEdu.instituicao} onChange={(v: string) => setNewEdu({ ...newEdu, instituicao: v })} />
                    <Input label="Ano" type="number" value={newEdu.ano_conclusao} onChange={(v: string) => setNewEdu({ ...newEdu, ano_conclusao: v })} />
                    <ModalActions onCancel={() => setShowAddEdu(false)} onConfirm={handleAddEducation} />
                </Modal>
            )}

            {showAddExp && (
                <Modal title="Adicionar experiência" onClose={() => setShowAddExp(false)}>
                    <Input label="Empresa" value={newExp.company} onChange={(v: string) => setNewExp({ ...newExp, company: v })} />
                    <Input label="Cargo" value={newExp.job_title} onChange={(v: string) => setNewExp({ ...newExp, job_title: v })} />
                    <Input label="Descrição" value={newExp.responsibilities} onChange={(v: string) => setNewExp({ ...newExp, responsibilities: v })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Início</label>

                            <DatePicker
                                selected={newExp.start_date ? new Date(newExp.start_date) : null}
                                onChange={(date: Date | null) =>
                                    setNewExp({
                                        ...newExp,
                                        start_date: date ? date.toISOString().slice(0, 10) : "",
                                    })
                                }
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className="w-full border rounded px-3 py-2"
                                placeholderText="Selecione o mês e ano"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Fim</label>

                            <DatePicker
                                selected={newExp.end_date ? new Date(newExp.end_date) : null}
                                onChange={(date: Date | null) =>
                                    setNewExp({
                                        ...newExp,
                                        end_date: date ? date.toISOString().slice(0, 10) : "",
                                    })
                                }
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className="w-full border rounded px-3 py-2"
                                placeholderText="Selecione o mês e ano"
                            />
                        </div>
                    </div>
                    <ModalActions onCancel={() => setShowAddExp(false)} onConfirm={handleAddExperience} />
                </Modal>
            )}
        </div>
    );
}

/* ===== Componentes auxiliares ===== */

function Input({ label, value, onChange, disabled = false, type = "text" }: any) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full border rounded px-3 py-2"
            />
        </div>
    );
}

function Section({ title, onAdd, children }: any) {
    return (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{title}</h3>
                <button onClick={onAdd} className="px-3 py-1 bg-yellow-400 rounded font-bold">+</button>
            </div>
            {children}
        </div>
    );
}

function CardItem({ children, onEdit, onDelete }: any) {
    return (
        <div className="border rounded-lg p-4 shadow-sm flex justify-between">
            <div>{children}</div>
            <div className="flex flex-col gap-2">
                <button onClick={onEdit} className="px-3 py-1 bg-yellow-400 rounded text-sm font-semibold hover:bg-blue-600 hover:text-white transition">Editar</button>
                <button onClick={onDelete} className="px-3 py-1 bg-yellow-400 rounded text-sm font-semibold hover:bg-red-600 hover:text-white transition">Remover</button>
            </div>
        </div>
    );
}

function Modal({ title, children, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow">
                <h3 className="text-lg font-semibold">{title}</h3>
                {children}
            </div>
        </div>
    );
}

function ModalActions({ onCancel, onConfirm }: any) {
    return (
        <div className="flex justify-end gap-3">
            <button
                onClick={onCancel}
                className="
          px-4 py-2 rounded font-semibold
          bg-yellow-400 text-black
          hover:bg-red-600 hover:text-white
          transition-colors
        "
            >
                Cancelar
            </button>

            <button
                onClick={onConfirm}
                className="
          px-4 py-2 rounded font-semibold
          bg-yellow-400 text-black
          hover:bg-blue-600 hover:text-white
          transition-colors
        "
            >
                Salvar
            </button>
        </div>
    );
}

function isoToMonth(value?: string | null) {
    if (!value) return "";
    return value.substring(0, 7);
}

function monthToIso(value?: string | null) {
    if (!value) return "";
    return `${value}-01`;
}

function formatMonthYear(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}