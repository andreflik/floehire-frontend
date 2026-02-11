import React from "react";

type EducationItem = {
    escolaridade: string;
    curso: string;
    instituicao: string;
    ano_conclusao: string;
    certificacoes: string;
    idiomas: string;
};

type Props = {
    education: EducationItem[];
    onChange: (education: EducationItem[]) => void;
    onNext: () => void;
    onBack: () => void;
};

export default function StepEducation({
    education,
    onChange,
    onNext,
    onBack,
}: Props) {
    function handleChange(
        index: number,
        field: keyof EducationItem,
        value: string
    ) {
        const updated = [...education];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }

    function addEducation() {
        onChange([
            ...education,
            {
                escolaridade: "",
                curso: "",
                instituicao: "",
                ano_conclusao: "",
                certificacoes: "",
                idiomas: "",
            },
        ]);
    }

    function removeEducation(index: number) {
        const updated = education.filter((_, i) => i !== index);
        onChange(updated);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onNext();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6"
        >
            <div>
                <h2 className="text-xl font-semibold text-black">Formação</h2>
                <p className="text-sm text-gray-600">
                    Adicione suas formações acadêmicas (opcional)
                </p>
            </div>

            {education.length === 0 && (
                <p className="text-sm text-gray-500">
                    Nenhuma formação adicionada ainda.
                </p>
            )}

            {education.map((item, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 space-y-3"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-black">
                            Formação {index + 1}
                        </h3>
                        <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Remover
                        </button>
                    </div>

                    <input
                        placeholder="Escolaridade (ex: Graduação, Pós, etc)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        value={item.escolaridade}
                        onChange={(e) =>
                            handleChange(index, "escolaridade", e.target.value)
                        }
                    />

                    <input
                        placeholder="Curso"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        value={item.curso}
                        onChange={(e) =>
                            handleChange(index, "curso", e.target.value)
                        }
                    />

                    <input
                        placeholder="Instituição"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        value={item.instituicao}
                        onChange={(e) =>
                            handleChange(index, "instituicao", e.target.value)
                        }
                    />

                    <input
                        placeholder="Ano de conclusão"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        value={item.ano_conclusao}
                        onChange={(e) =>
                            handleChange(index, "ano_conclusao", e.target.value)
                        }
                    />

                    <input
                        placeholder="Certificações"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        value={item.certificacoes}
                        onChange={(e) =>
                            handleChange(index, "certificacoes", e.target.value)
                        }
                    />

                    <input
                        placeholder="Idiomas"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        value={item.idiomas}
                        onChange={(e) =>
                            handleChange(index, "idiomas", e.target.value)
                        }
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={addEducation}
                className="w-full border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition"
            >
                + Adicionar formação
            </button>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                    Voltar
                </button>

                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#FFD700] text-black font-semibold hover:opacity-90 transition"
                >
                    Próximo
                </button>
            </div>
        </form>
    );
}
