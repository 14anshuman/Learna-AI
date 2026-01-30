import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb, X } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkDownRenderer from "../common/MarkDownRenderer";
import Spinner from "../common/Spinner";

const AIActions = () => {
    const { id: documentId } = useParams();

    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [concept, setConcept] = useState("");

    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const { summary } = await aiService.generateSummary(documentId);
            openModal("Generated Summary", summary);
        } catch {
            toast.error("Failed to generate summary.");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async () => {
        if (!concept.trim()) {
            toast.error("Please enter a concept.");
            return;
        }

        setLoadingAction("concept");
        try {
            const { explanation } = await aiService.explainConcept(
                documentId,
                concept
            );
            openModal(`Explanation: ${concept}`, explanation);
        } catch {
            toast.error("Failed to explain concept.");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <>
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-100">
                            <Sparkles className="text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">
                            Generate Summary
                        </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Get a concise AI-generated summary of this document.
                    </p>

                    <button
                        onClick={handleGenerateSummary}
                        disabled={loadingAction === "summary"}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                        {loadingAction === "summary" ? (
                            <Spinner size={16} />
                        ) : (
                            <Sparkles size={16} />
                        )}
                        {loadingAction==="summary"? "Genrating Summary" :"Generate Summary"}
                    </button>
                </div>

                {/* Explain Concept */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100">
                            <Lightbulb className="text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">
                            Explain Concept
                        </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                        Ask AI to explain any concept from the document.
                    </p>

                    <input
                        type="text"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="e.g. Virtual DOM"
                        className="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        onClick={handleExplainConcept}
                        disabled={loadingAction === "concept"}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                        {loadingAction === "concept" ? (
                            <Spinner size={16} />
                        ) : (
                            <Lightbulb size={16} />
                        )}
                        {loadingAction==="concept"? "Explaining" :"Explain"}
                    </button>
                </div>
            </div>

            {/* Result Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {modalTitle}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            <MarkDownRenderer content={modalContent} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIActions;
