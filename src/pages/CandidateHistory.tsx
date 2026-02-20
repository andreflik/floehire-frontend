import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import { STATUS_LABELS } from "../utils/labels";

type HistoryItem = {
    id: string;
    rating: number | null;
    notes: string | null;
    created_at: string;
    job: {
        id: string;
        title: string;
        description: string | null;
        status: string;
    };
    current_stage: {
        name: string;
        stage_order: number;
    };
};

export default function CandidateHistory() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    function getToken(): string | null {
        const authRaw = localStorage.getItem("floehire:auth");
        const auth = authRaw ? JSON.parse(authRaw) : null;
        return auth?.access_token ?? null;
    }

    useEffect(() => {
        async function loadHistory() {
            try {
                setLoading(true);

                const token = getToken();
                if (!token) throw new Error("Você precisa estar logado.");

                const res = await fetch(`${API_URL}/applications/me/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Erro ao carregar histórico");
                }

                const data = await res.json();
                setItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, []);

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("pt-BR");
    }

    function labelOf(map: Record<string, string>, value?: string | null) {
        if (!value) return "Não informado";
        return map[value] ?? value;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Histórico de Candidaturas</h1>

                {loading && <p className="text-gray-600">Carregando histórico...</p>}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {!loading && !error && items.length === 0 && (
                    <p className="text-gray-600">Você ainda não possui histórico.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
                        >
                            <h2 className="text-lg font-semibold text-black">
                                {item.job.title}
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                Status da vaga:{" "}
                                <strong>{labelOf(STATUS_LABELS, item.job.status)}</strong>
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                                Etapa final:{" "}
                                <strong className="text-blue-600">
                                    {item.current_stage.name}
                                </strong>
                            </p>

                            <p className="text-gray-400 text-xs mt-2">
                                Finalizado em: {formatDate(item.created_at)}
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setSelectedItem(item)}
                                    className="bg-[#FFD700] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-lg relative">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-2">
                            {selectedItem.job.title}
                        </h2>

                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>
                                Status da vaga:{" "}
                                {labelOf(STATUS_LABELS, selectedItem.job.status)}
                            </p>
                            <p>Etapa final: {selectedItem.current_stage.name}</p>
                            <p>
                                Avaliação:{" "}
                                {selectedItem.rating !== null
                                    ? `${selectedItem.rating}/5`
                                    : "Não informada"}
                            </p>
                        </div>

                        {selectedItem.notes && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-1">Observações</h3>
                                <p className="text-gray-700 text-sm">{selectedItem.notes}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="font-semibold mb-1">Descrição da vaga</h3>
                            <p className="text-gray-700 text-sm">
                                {selectedItem.job.description ?? "Sem descrição informada."}
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold transition hover:bg-red-600 hover:text-white"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}