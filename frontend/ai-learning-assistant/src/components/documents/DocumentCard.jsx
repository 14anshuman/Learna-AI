import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  Clock,
  BookOpen,
  BrainCircuit,
  HardDrive,
  AlertTriangle,
} from "lucide-react";

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const openDeleteModal = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const closeDeleteModal = (e) => {
    e?.stopPropagation();
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    onDelete?.(document);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <>
      {/* CARD */}
      <div
        onClick={handleNavigate}
        className="
          group relative cursor-pointer
          rounded-3xl bg-gradient-to-r from-blue-100 to-sky-50
          p-6 w-full max-w-lg
          min-w-2xl
          mb-4
          border border-gray-100
          shadow-sm hover:shadow-md
          transition-all
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-50">
              <FileText className="text-indigo-600" size={24} />
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                {document.title}
              </h3>
              <p className="text-xs text-gray-500">PDF Document</p>
            </div>
          </div>

          {/* Delete icon */}
          <button
            onClick={openDeleteModal}
            className="
              opacity-70 group-hover:opacity-100
              rounded-md 
              text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer
              transition
            "
            title="Delete document"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={13} />
            {formatDate(document.createdAt)}
          </div>

          <div className="flex items-center gap-1">
            <HardDrive size={13} />
            {formatFileSize(document.fileSize)}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-100" />

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            <BookOpen size={12} />
            {document.flashcardCount} Flashcards
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <BrainCircuit size={12} />
            {document.quizCount} Quizzes
          </span>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          onClick={closeDeleteModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Delete Document
              </h3>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {document.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCard;
