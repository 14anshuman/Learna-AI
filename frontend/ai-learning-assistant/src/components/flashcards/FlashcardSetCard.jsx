import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

export const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed
  ).length;

  const totalCards = flashcardSet.cards.length;

  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

 return (
  <div
    className="
      bg-gradient-to-r from-blue-100 to-sky-50 border rounded-xl p-5
      shadow-sm hover:shadow-md
      transition cursor-pointer
      group
    "
    onClick={handleStudyNow}
  >
    <div className="space-y-4">
      {/* Icon and Title */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-50">
          <BookOpen className="text-indigo-600" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-slate-800 truncate"
            title={flashcardSet?.documentId?.title}
          >
            {flashcardSet?.documentId?.title}
          </h3>
          <p className="text-sm text-slate-500">
            Created {moment(flashcardSet.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          {totalCards} {totalCards === 1 ? "Card" : "Cards"}
        </span>

        {reviewedCount > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
            <TrendingUp strokeWidth={2} />
            {progressPercentage}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalCards > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>
              {reviewedCount}/{totalCards} reviewed
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>

    {/* Study Button */}
    <div className="mt-5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStudyNow();
        }}
        className="
          w-full
          group inline-flex items-center justify-center gap-2
          px-4 py-2
          rounded-lg
          bg-indigo-600 text-white
          text-sm font-medium
          shadow-sm
          hover:bg-indigo-700
          active:scale-95
          transition-all
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
        "
      >
        <Sparkles
          className="w-4 h-4 group-hover:rotate-12 transition-transform"
          strokeWidth={2.5}
        />
        Study Now
      </button>
    </div>
  </div>
);


};

export default FlashcardSetCard;