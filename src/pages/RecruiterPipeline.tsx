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
    linkedin_url?: string | null;
    phone?: string | null;
    candidate_experiences?: CandidateExperiance[],
};

type CandidateExperiance = {
    job_title?: string | null;
    company?: string | null;
}

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
    stageName: string;
    title: string;
    count: number;
    children: React.ReactNode;
}) {
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
            px-3 py-1 text-xs font-semibold rounded-full
            ${STAGE_BADGE_CLASSES[stageName] ?? "bg-gray-100 text-gray-600"}
          `}
                >
                    {title}
                </span>

                <span
                    className={`
            text-xs font-semibold px-2 py-1 rounded-lg
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
    onOpen,
}: {
    app: PipelineApplication;
    fromStageId: string;
    isMoving: boolean;
    onMoveNext: () => void;
    onMovePrevious: () => void;
    onOpen: () => void;
}) {
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
            onClick={() => !isMoving && onOpen()}
            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="font-medium text-black">
                        {app.candidate.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                        {app.candidate.email}
                    </div>
                </div>

                <button
                    type="button"
                    disabled={isMoving}
                    title="Arrastar"
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    {...listeners}
                    {...attributes}
                    onClick={(e) => e.stopPropagation()}
                >
                    ⠿
                </button>
            </div>

            {app.rating !== null && (
                <div className="text-sm mt-2">⭐ {app.rating}/5</div>
            )}

            {app.notes && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {app.notes}
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMovePrevious();
                    }}
                    disabled={isMoving}
                    className="w-full text-xs font-semibold bg-yellow-100 text-black rounded-lg py-1.5 hover:bg-yellow-200 transition"
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
                    className="w-full text-xs font-semibold bg-yellow-100 text-black rounded-lg py-1.5 hover:bg-yellow-200 transition"
                >
                    Próxima etapa →
                </button>
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
    const [selectedApp, setSelectedApp] = useState<PipelineApplication | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const sortedStages = useMemo(() => {
        if (!pipeline) return [];
        return [...pipeline.stages].sort((a, b) => a.order - b.order);
    }, [pipeline]);

    async function loadPipeline() {
        try {
            const res = await fetch(`${API_URL}/pipeline/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${auth?.access_token}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            setPipeline(data);
        } catch (err: any) {
            setError(err.message);
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

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            toast.success("Candidato movido com sucesso 🎯");
            await loadPipeline();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setMovingId(null);
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const applicationId = String(active.id);
        const toStageId = String(over.id);

        const fromStageId = active.data.current?.fromStageId;

        // Se soltou na mesma coluna, ignora
        if (fromStageId === toStageId) return;

        moveApplication(applicationId, toStageId);
    }

    useEffect(() => {
        if (jobId) loadPipeline();
    }, [jobId]);

    if (loading) return <div className="p-6">Carregando...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!pipeline) return null;

    const lastExperience = selectedApp?.candidate?.candidate_experiences?.[0] ?? null;

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#FFD700] text-black"
                >
                    ←
                </button>
                <h1 className="text-2xl font-bold">Pipeline da Vaga</h1>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="flex flex-col md:flex-row gap-4">
                    {sortedStages.map((stage) => (
                        <DroppableColumn
                            key={stage.id}
                            stageId={stage.id}
                            stageName={stage.name}
                            title={STAGE_LABELS[stage.name] ?? stage.name}
                            count={stage.candidates.length}
                        >
                            <div className="space-y-3">
                                {stage.candidates.map((app) => (
                                    <DraggableCard
                                        key={app.application_id}
                                        app={app}
                                        fromStageId={stage.id}
                                        isMoving={movingId === app.application_id}
                                        onMoveNext={() => {
                                            const idx = sortedStages.findIndex(s => s.id === stage.id);
                                            const next = sortedStages[idx + 1];
                                            if (!next) return toast.warning("Última etapa");
                                            moveApplication(app.application_id, next.id);
                                        }}
                                        onMovePrevious={() => {
                                            const idx = sortedStages.findIndex(s => s.id === stage.id);
                                            const prev = sortedStages[idx - 1];
                                            if (!prev) return toast.warning("Primeira etapa");
                                            moveApplication(app.application_id, prev.id);
                                        }}
                                        onOpen={() => setSelectedApp(app)}
                                    />
                                ))}
                            </div>
                        </DroppableColumn>
                    ))}
                </div>
            </DndContext>

            {/* Modal */}
            {selectedApp && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setSelectedApp(null)}
                >
                    <div
                        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelectedApp(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-5 mb-8">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-black">
                                {selectedApp.candidate.full_name
                                    .split(" ")
                                    .slice(0, 2)
                                    .map(n => n[0])
                                    .join("")}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold">
                                    {selectedApp.candidate.full_name}
                                </h2>

                                {lastExperience && (
                                    <p className="text-gray-600 mt-1">
                                        {lastExperience.job_title}
                                        {lastExperience.company && (
                                            <> — {lastExperience.company}</>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 mb-6"></div>

                        {/* Infos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                            <div>
                                <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                                    Email
                                </p>
                                <p className="text-gray-800">
                                    {selectedApp.candidate.email}
                                </p>
                            </div>

                            {selectedApp.candidate.phone && (
                                <div>
                                    <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                                        Celular
                                    </p>
                                    <p className="text-gray-800">
                                        {selectedApp.candidate.phone}
                                    </p>
                                </div>
                            )}

                            {selectedApp.candidate.linkedin_url && (
                                <div>
                                    <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                                        LinkedIn
                                    </p>
                                    <a
                                        href={selectedApp.candidate.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver perfil
                                    </a>
                                </div>
                            )}

                            {selectedApp.rating !== null && (
                                <div>
                                    <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                                        Avaliação
                                    </p>
                                    <p className="text-gray-800">
                                        ⭐ {selectedApp.rating}/5
                                    </p>
                                </div>
                            )}

                            {selectedApp.notes && (
                                <div className="md:col-span-2">
                                    <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                                        Notas
                                    </p>
                                    <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                                        {selectedApp.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}