import type { CandidateFormData } from "../../pages/CandidateRegisterWizard";

type EducationItem = {
    escolaridade: string;
    curso: string;
    instituicao: string;
    ano_conclusao: string;
    certificacoes: string;
    idiomas: string;
};

type ExperienceItem = {
    job_title: string;
    start_date: string;
    end_date: string | null;
    responsibilities: string;
};

type Props = {
    basic: CandidateFormData;
    education: EducationItem[];
    experiences: ExperienceItem[];
    onBack: () => void;
    onSubmit: () => void;
    loading?: boolean;
};

export default function StepReview({
    basic,
    education,
    experiences,
    onBack,
    onSubmit,
    loading = false,
}: Props) {
    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Revisar cadastro</h2>

            {/* Dados básicos */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Dados pessoais</h3>
                <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Nome:</strong> {basic.full_name}</p>
                    <p><strong>Email:</strong> {basic.email}</p>
                    <p><strong>Telefone:</strong> {basic.phone || "-"}</p>
                    <p><strong>Cidade/Estado:</strong> {basic.city} / {basic.state}</p>
                    <p><strong>LinkedIn:</strong> {basic.linkedin_url || "-"}</p>
                    <p><strong>GitHub:</strong> {basic.github_url || "-"}</p>
                    <p><strong>Portfólio:</strong> {basic.portfolio_url || "-"}</p>
                </div>
            </div>

            {/* Formação */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Formação</h3>
                {education.map((edu, index) => (
                    <div key={index} className="mb-3 text-sm text-gray-700">
                        <p><strong>Escolaridade:</strong> {edu.escolaridade || "-"}</p>
                        <p><strong>Curso:</strong> {edu.curso || "-"}</p>
                        <p><strong>Instituição:</strong> {edu.instituicao || "-"}</p>
                        <p><strong>Ano de conclusão:</strong> {edu.ano_conclusao || "-"}</p>
                        <p><strong>Certificações:</strong> {edu.certificacoes || "-"}</p>
                        <p><strong>Idiomas:</strong> {edu.idiomas || "-"}</p>
                        <hr className="my-2" />
                    </div>
                ))}
            </div>

            {/* Experiências */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Experiência profissional</h3>
                {experiences.map((exp, index) => (
                    <div key={index} className="mb-3 text-sm text-gray-700">
                        <p><strong>Cargo:</strong> {exp.job_title || "-"}</p>
                        <p><strong>Início:</strong> {exp.start_date || "-"}</p>
                        <p>
                            <strong>Fim:</strong> {exp.end_date ? exp.end_date : "Atual"}
                        </p>
                        <p><strong>Responsabilidades:</strong> {exp.responsibilities || "-"}</p>
                        <hr className="my-2" />
                    </div>
                ))}
            </div>

            {/* Ações */}
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg border border-gray-300"
                >
                    Voltar
                </button>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Criando conta..." : "Criar conta"}
                </button>
            </div>
        </div>
    );
}
