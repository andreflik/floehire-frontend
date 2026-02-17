import { useNavigate } from "react-router-dom";

type Props = {
    title: string;
    backTo?: string;
};

export default function PageHeader({ title, backTo }: Props) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-black">{title}</h2>

            {backTo && (
                <button
                    onClick={() => navigate(backTo)}
                    className="
            px-4 py-2 rounded-lg text-sm font-semibold
            bg-[#FFD700] text-black shadow-sm
            transition-colors duration-200
            hover:opacity-90
          "
                >
                    Voltar
                </button>
            )}
        </div>
    );
}