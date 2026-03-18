import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseYearMonth, formatToYearMonth } from "../../utils/date";
import CustomDateInput from "../CustomDateInput";

type ExperienceItem = {
    company: string;
    job_title: string;
    start_date: string;
    end_date: string | null;
    responsibilities: string;
    is_current?: boolean;
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
                company: "",
                job_title: "",
                start_date: "",
                end_date: null,
                responsibilities: "",
            },
        ]);
    }

    function removeExperience(index: number) {
        const updated = experiences.filter((_, i) => i !== index);
        onChange(updated.length ? updated : experiences);
    }

    function toggleCurrent(index: number) {
        const updated = [...experiences];

        updated[index].is_current = !updated[index].is_current;

        if (updated[index].is_current) {
            updated[index].end_date = null;
        }

        onChange(updated);
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
                            Empresa
                        </label>

                        <input
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                                handleChange(index, "company", e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Ex: Google, Nubank, Startup X"
                        />
                    </div>

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

                            <DatePicker
                                selected={parseYearMonth(exp.start_date)}
                                onChange={(date: Date | null) =>
                                    handleChange(index, "start_date", formatToYearMonth(date))
                                }
                                showMonthYearPicker
                                dateFormat="MM/yyyy"
                                maxDate={new Date()}
                                customInput={<CustomDateInput placeholder="Selecione mês/ano" />}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Data fim
                            </label>

                            <DatePicker
                                selected={parseYearMonth(exp.end_date)}
                                onChange={(date: Date | null) =>
                                    handleChange(index, "end_date", formatToYearMonth(date))
                                }
                                showMonthYearPicker
                                dateFormat="MM/yyyy"
                                maxDate={new Date()}
                                disabled={exp.is_current}
                                customInput={<CustomDateInput placeholder="Selecione mês/ano" />}
                            />

                            <label className="flex items-center mt-2 text-sm gap-2">
                                <input
                                    type="checkbox"
                                    checked={exp.is_current || false}
                                    onChange={() => toggleCurrent(index)}
                                />
                                Emprego atual
                            </label>
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