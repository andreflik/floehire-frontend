import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";
import { STAGE_LABELS, STAGE_BADGE_CLASSES } from "../utils/labels";
import { toast } from "sonner";

import {
    DndContext,
    type DragEndEvent,
    useDraggable,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

/* =======================
   Types
======================= */

type Candidate = {
    id: string;
    full_name: string;
    email: string;
};

type PipelineApplication = {
    application_id: string;
    rating: number | null;
    notes: string | null;
    candidate: Candidate;
};

type PipelineStage = {
    id: string;
    name: string;
    order: number;
    candidates: PipelineApplication[];
};

type PipelineResponse = {
    job_id: string;
    stages: PipelineStage[];
};

/* =======================
   Droppable Column
======================= */

function DroppableColumn({
    stageId,
    stageName,
    title,
    count,
    children,
}: {
    stageId: string;
    stageName: string; // <- chave real (Applied, Screening...)
    title: string;     // <- label traduzida
    count: number;
    children: React.ReactNode;
}) {
    // IMPORTANTE: id do droppable = stageId (real)
    const { setNodeRef, isOver } = useDroppable({ id: stageId });

    return (
        <div
            ref={setNodeRef}
            className={`
        w-full
        md:min-w-[280px]
        bg-gray-50
        border border-gray-200
        rounded-2xl
        p-4
        shadow-sm
        transition
        ${isOver ? "ring-2 ring-yellow-400" : ""}
      `}
        >
            <div className="flex items-center justify-between mb-3">
                <span
                    className={`
                        px-3 py-1
                        text-xs font-semibold
                        rounded-full
                        ${STAGE_BADGE_CLASSES[stageName] ?? "bg-gray-100 text-gray-600"}
                        `}
                >
                    {title}
                </span>

                <span
                    className={`
                        text-xs font-semibold
                        px-2 py-1
                        rounded-lg
                        ${STAGE_BADGE_CLASSES[stageName] ?? "bg-gray-100 text-gray-600"}
                    `}
                >
                    {count}
                </span>
            </div>

            {children}
        </div>
    );
}

/* =======================
   Draggable Card
======================= */

function DraggableCard({
    app,
    fromStageId,
    isMoving,
    onMoveNext,
    onMovePrevious,
}: {
    app: PipelineApplication;
    fromStageId: string;
    isMoving: boolean;
    onMoveNext: () => void;
    onMovePrevious: () => void;
}) {
    // id do draggable = application_id (real)
    // e passamos dados extras p/ recuperar stage atual no onDragEnd
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useDraggable({
            id: app.application_id,
            data: { fromStageId },
        });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isMoving ? 0.6 : isDragging ? 0.7 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        bg-white
        border border-gray-200
        rounded-xl
        p-2 md:p-3
        shadow-sm
        hover:shadow-md
        transition
      `}
        >
            {/* Header + Handle (pra não conflitar com botão) */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="font-medium text-black">{app.candidate.full_name}</div>
                    <div className="text-sm text-gray-500">{app.candidate.email}</div>
                </div>

                <button
                    type="button"
                    disabled={isMoving}
                    title="Arrastar"
                    className={`
            shrink-0
            w-8 h-8
            rounded-lg
            border border-gray-200
            bg-white
            flex items-center justify-center
            text-gray-500
            hover:bg-gray-50
            active:cursor-grabbing
            ${isMoving ? "opacity-60" : ""}
          `}
                    {...listeners}
                    {...attributes}
                >
                    ⠿
                </button>
            </div>

            {app.rating !== null && (
                <div className="text-sm mt-1">⭐ {app.rating}/5</div>
            )}

            {app.notes && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{app.notes}</div>
            )}

            {/* Ações */}
            <div className="mt-3 flex gap-2">
                {/* Etapa anterior */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMovePrevious();
                    }}
                    disabled={isMoving}
                    className="
                        w-full
                        text-xs
                        font-semibold
                        bg-yellow-100
                        text-black
                        rounded-lg
                        py-1.5
                        hover:bg-yellow-200
                        transition
                        disabled:opacity-50
                        "
                >
                    ← Etapa anterior
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMoveNext();
                    }}
                    disabled={isMoving}
                    className="
                        w-full
                        text-xs
                        font-semibold
                        bg-yellow-100
                        text-black
                        rounded-lg
                        py-1.5
                        hover:bg-yellow-200
                        transition
                        disabled:opacity-50
                    "
                >
                    Próxima etapa →
                </button>

                {isMoving && (
                    <div className="mt-2 text-xs text-yellow-700 font-semibold">
                        Movendo...
                    </div>
                )}
            </div>
        </div>
    );
}

/* =======================
   Component
======================= */

export default function RecruiterPipeline() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [pipeline, setPipeline] = useState<PipelineResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [movingId, setMovingId] = useState<string | null>(null);

    // Sensor mais “suave” (evita arrasto acidental no click)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const sortedStages = useMemo(() => {
        if (!pipeline) return [];
        return [...pipeline.stages].sort((a, b) => a.order - b.order);
    }, [pipeline]);

    async function loadPipeline() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_URL}/pipeline/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erro ao carregar pipeline");
            }

            setPipeline(data);
        } catch (err: any) {
            setError(err.message || "Erro inesperado ao carregar pipeline");
        } finally {
            setLoading(false);
        }
    }

    async function moveApplication(applicationId: string, toStageId: string) {
        try {
            setMovingId(applicationId);

            const res = await fetch(
                `${API_URL}/pipeline/applications/${applicationId}/move`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth?.access_token}`,
                    },
                    body: JSON.stringify({ toStageId }),
                }
            );

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.error || "Erro ao mover candidato");
            }

            toast.success("Candidato movido com sucesso 🎯");

            await loadPipeline();
        } catch (err: any) {
            toast.error(err.message || "Erro ao mover candidato");
        } finally {
            setMovingId(null);
        }
    }

    function getNextStageByStageId(currentStageId: string): PipelineStage | null {
        const idx = sortedStages.findIndex((s) => s.id === currentStageId);
        if (idx === -1) return null;
        if (idx >= sortedStages.length - 1) return null;
        return sortedStages[idx + 1];
    }

    function getPreviousStageByStageId(currentStageId: string): PipelineStage | null {
        const idx = sortedStages.findIndex((s) => s.id === currentStageId);

        if (idx === -1) return null;
        if (idx <= 0) return null;

        return sortedStages[idx - 1];
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const applicationId = String(active.id);
        const toStageId = String(over.id);

        // stage atual vem do data do draggable
        const fromStageId = (active.data.current as any)?.fromStageId as
            | string
            | undefined;

        if (!applicationId || !toStageId) return;

        // evita tentar mover pra mesma etapa
        if (fromStageId && fromStageId === toStageId) return;

        // aqui o over.id SEMPRE é stageId, porque só colunas são droppables
        moveApplication(applicationId, toStageId);
    }

    useEffect(() => {
        if (jobId) loadPipeline();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId]);

    if (loading) return <div className="p-6">Carregando pipeline...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!pipeline) return null;

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="
            mr-4
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

                <h1 className="text-2xl font-bold text-black">Pipeline da Vaga</h1>
            </div>

            {/* Kanban */}
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="flex flex-col md:flex-row gap-4 md:overflow-x-auto md:pb-4">
                    {sortedStages.map((stage) => (
                        <DroppableColumn
                            key={stage.id}
                            stageId={stage.id}
                            stageName={stage.name}
                            title={STAGE_LABELS[stage.name] ?? stage.name}
                            count={stage.candidates.length}
                        >
                            <div className="space-y-3 min-h-[40px]">
                                {stage.candidates.length === 0 && (
                                    <div className="text-sm text-gray-400">
                                        Nenhum candidato nesta etapa
                                    </div>
                                )}

                                {stage.candidates.map((app) => (
                                    <DraggableCard
                                        key={app.application_id}
                                        app={app}
                                        fromStageId={stage.id}
                                        isMoving={movingId === app.application_id}
                                        onMoveNext={() => {
                                            const next = getNextStageByStageId(stage.id);
                                            if (!next) {
                                                toast.warning("Este candidato já está na última etapa.");
                                                return;
                                            }
                                            moveApplication(app.application_id, next.id);
                                        }}
                                        onMovePrevious={() => {
                                            const prev = getPreviousStageByStageId(stage.id);
                                            if (!prev) {
                                                toast.warning("Este candidato já está na primeira etapa.");
                                                return;
                                            }
                                            moveApplication(app.application_id, prev.id);
                                        }}
                                    />
                                ))}
                            </div>
                        </DroppableColumn>
                    ))}
                </div>
            </DndContext>
        </div>
    );
}