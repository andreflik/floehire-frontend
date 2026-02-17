import { useState } from "react";
import StepBasicInfo from "../components/candidate-register/StepBasicInfo";
import StepEducation from "../components/candidate-register/StepEducation";
import StepExperience from "../components/candidate-register/StepExperience";
import StepReview from "../components/candidate-register/StepReview";
import { post } from "../services/api";

export type CandidateFormData = {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    state: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    lgpd_consent: boolean;
};

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
    end_date: string;
    responsibilities: string;
};

export default function CandidateRegisterWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<CandidateFormData>({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        state: "",
        linkedin_url: "",
        github_url: "",
        portfolio_url: "",
        lgpd_consent: false,
    });

    const [education, setEducation] = useState<EducationItem[]>([
        {
            escolaridade: "",
            curso: "",
            instituicao: "",
            ano_conclusao: "",
            certificacoes: "",
            idiomas: "",
        },
    ]);

    const [experiences, setExperiences] = useState<ExperienceItem[]>([
        {
            job_title: "",
            start_date: "",
            end_date: "",
            responsibilities: "",
        },
    ]);

    function nextStep() {
        setStep((prev) => prev + 1);
    }

    function prevStep() {
        setStep((prev) => prev - 1);
    }

    async function handleSubmit() {
        setLoading(true);
        setError(null);

        try {
            const edu = education[0];

            const payload = {
                ...formData,

                escolaridade: edu.escolaridade,
                curso: edu.curso,
                instituicao: edu.instituicao,
                ano_conclusao: edu.ano_conclusao,
                certificacoes: edu.certificacoes,
                idiomas: edu.idiomas,

                portfolio_file: {},
                portfolio_link: "",

                experiences,
            };

            await post<unknown, typeof payload>("/candidate/register", payload);

            setSuccess(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro inesperado ao criar conta");
            }
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-black mb-4">
                        Conta criada com sucesso! 🎉
                    </h1>
                    <p className="text-gray-600">
                        Agora você já pode fazer login.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-full max-w-2xl px-6">
                <div className="mb-8 text-center">
                    <p className="text-sm text-gray-500">Etapa {step} de 4</p>
                    <h1 className="text-2xl font-bold text-black mt-1">
                        Cadastro de Candidato
                    </h1>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <StepBasicInfo
                        data={formData}
                        onChange={setFormData}
                        onNext={nextStep}
                    />
                )}

                {step === 2 && (
                    <StepEducation
                        education={education}
                        onChange={setEducation}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {step === 3 && (
                    <StepExperience
                        experiences={experiences}
                        onChange={setExperiences}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {step === 4 && (
                    <StepReview
                        basic={formData}
                        education={education}
                        experiences={experiences}
                        onBack={prevStep}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}
