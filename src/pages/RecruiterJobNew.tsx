import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";

export default function RecruiterJobNew() {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [form, setForm] = useState({
        title: "",
        description: "",
        seniority: "PLENO",
        work_model: "REMOTE",
        contract_type: "CLT",
        hire_type: "NEW_POSITION", // backend espera: REPLACEMENT | NEW_POSITION
        city: "",
        state: "",
        salary_min: "",
        salary_max: "",
        deadline: "", // yyyy-mm-dd vindo do input
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth?.access_token}`,
                },
                body: JSON.stringify({
                    ...form,
                    salary_min: form.salary_min ? Number(form.salary_min) : null,
                    salary_max: form.salary_max ? Number(form.salary_max) : null,
                    // ✅ CONVERSÃO PARA ISO DATETIME (corrige o erro do backend)
                    deadline: form.deadline
                        ? new Date(form.deadline).toISOString()
                        : null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erro ao criar vaga");
            }

            navigate("/recruiter/dashboard");
        } catch (err: any) {
            setError(err.message || "Erro inesperado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative">

                    {/* Botão voltar */}
                    <button
                        onClick={() => navigate("/recruiter/dashboard")}
                        className="
              absolute top-4 left-4
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

                    {/* Header */}
                    <div className="text-center mb-6 mt-4">
                        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-yellow-100 mb-3">
                            <span className="text-xl">💼</span>
                        </div>
                        <h1 className="text-2xl font-bold text-black">Criar nova vaga</h1>
                        <p className="text-gray-600 text-sm">
                            Preencha os dados para publicar uma nova oportunidade
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título da vaga
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Ex: DevOps Pleno"
                                required
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                rows={4}
                                placeholder="Descreva a vaga..."
                            />
                        </div>

                        {/* Selects principais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Senioridade" name="seniority" value={form.seniority} onChange={handleChange}>
                                <option value="JUNIOR">Júnior</option>
                                <option value="PLENO">Pleno</option>
                                <option value="SENIOR">Sênior</option>
                            </Select>

                            <Select label="Modelo de trabalho" name="work_model" value={form.work_model} onChange={handleChange}>
                                <option value="REMOTE">Remoto</option>
                                <option value="HYBRID">Híbrido</option>
                                <option value="ONSITE">Presencial</option>
                            </Select>

                            <Select label="Tipo de contrato" name="contract_type" value={form.contract_type} onChange={handleChange}>
                                <option value="CLT">CLT</option>
                                <option value="PJ">PJ</option>
                            </Select>

                            <Select label="Tipo de contratação" name="hire_type" value={form.hire_type} onChange={handleChange}>
                                <option value="NEW_POSITION">Nova posição</option>
                                <option value="REPLACEMENT">Reposição</option>
                            </Select>
                        </div>

                        {/* Localização */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Cidade" name="city" value={form.city} onChange={handleChange} placeholder="Ex: Salvador" />
                            <Input label="Estado" name="state" value={form.state} onChange={handleChange} placeholder="Ex: BA" />
                        </div>

                        {/* Salários */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Salário mínimo" name="salary_min" type="number" value={form.salary_min} onChange={handleChange} />
                            <Input label="Salário máximo" name="salary_max" type="number" value={form.salary_max} onChange={handleChange} />
                        </div>

                        {/* Deadline */}
                        <Input
                            label="Data limite"
                            name="deadline"
                            type="date"
                            value={form.deadline}
                            onChange={handleChange}
                        />

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Salvando..." : "Criar vaga"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* Componentes auxiliares */

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    const { label, ...rest } = props;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                {...rest}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
        </div>
    );
}

function Select(
    props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
) {
    const { label, children, ...rest } = props;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                {...rest}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                {children}
            </select>
        </div>
    );
}