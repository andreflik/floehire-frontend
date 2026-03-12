import React from "react";

type ExperienceItem = {
    job_title: string;
    start_date: string;
    end_date: string;
    responsibilities: string;
};

type ExperienceProps = {
    experiences: ExperienceItem[];
    onChange: (data: ExperienceItem[]) => void;
    onNext: () => void;
    onBack: () => void;
};

export default function StepExperience({
    experiences,
    onChange,
    onNext,
    onBack,
}: ExperienceProps) {

    function handleChange(
        index: number,
        field: keyof ExperienceItem,
        value: string
    ) {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }

    function addExperience() {
        onChange([
            ...experiences,
            {
                job_title: "",
                start_date: "",
                end_date: "",
                responsibilities: "",
            },
        ]);
    }

    function removeExperience(index: number) {
        const updated = experiences.filter((_, i) => i !== index);
        onChange(updated.length ? updated : experiences);
    }

    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">

            <h2 className="text-xl font-semibold mb-4">
                Experiência Profissional
            </h2>

            {experiences.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">
                            Cargo
                        </label>

                        <input
                            type="text"
                            value={exp.job_title}
                            onChange={(e) =>
                                handleChange(index, "job_title", e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Ex: Desenvolvedor Backend"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Data início
                            </label>

                            <input
                                type="month"
                                value={exp.start_date}
                                onChange={(e) =>
                                    handleChange(index, "start_date", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Data fim
                            </label>

                            <input
                                type="month"
                                value={exp.end_date}
                                onChange={(e) =>
                                    handleChange(index, "end_date", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">
                            Responsabilidades
                        </label>

                        <textarea
                            value={exp.responsibilities}
                            onChange={(e) =>
                                handleChange(index, "responsibilities", e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            rows={3}
                            placeholder="Descreva suas principais atividades..."
                        />
                    </div>

                    {experiences.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Remover experiência
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addExperience}
                className="text-yellow-500 font-medium hover:underline mb-6"
            >
                + Adicionar experiência
            </button>

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
                    onClick={onNext}
                    className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:opacity-90"
                >
                    Próximo
                </button>

            </div>
        </div>
    );
}