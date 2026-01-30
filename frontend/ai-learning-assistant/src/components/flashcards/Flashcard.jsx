import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
      <div
        className="relative h-64 cursor-pointer transition-transform duration-500 transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* FRONT SIDE (Question) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-100 to-sky-50 rounded-xl shadow-lg p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-600">
              {flashcard.difficulty}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className="text-yellow-500 hover:scale-110 transition"
            >
              <Star
                size={20}
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center text-center px-2">
            <p className="text-lg font-medium text-gray-800">
              {flashcard.question}
            </p>
          </div>

          {/* Flip hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <RotateCcw size={16} />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-sky-200 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Header */}
          <div className="text-sm font-semibold text-gray-800">
            Answer
          </div>

          {/* Answer content */}
          <div className="flex-1 flex items-center justify-center text-center px-2">
            <p className="text-lg font-medium">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip back hint */}
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <RotateCcw  strokeWidth={2}/>
            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
