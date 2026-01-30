import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";
import {motion} from "framer-motion"

const QuizCard = ({ quiz, onDelete }) => {
  return (
   <>

   <motion.div
  whileHover={{ y: -1, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="bg-gray-200 dark:bg-green-900 rounded-xl p-4 shadow-sm"
>


   

    <div className="
  relative
  bg-white
  rounded-2xl
  border border-gray-200
  p-6
  w-full max-w-sm
  shadow hover:shadow-lg transition 
">
  {/* Delete (top-right) */}
  <button
    className="
      absolute top-3 right-3
      p-2 rounded-lg
      text-red-500
      hover:bg-red-50
      transition cursor-pointer
    "
    title="Delete Quiz"
    onClick={onDelete}
  >
    <Trash2 size={16} />
  </button>

  {/* Content */}
  <div className="space-y-4">
    {/* Icon + title */}
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
        <Award size={22} />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">
          {quiz.title || "Untitled Quiz"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {quiz.questions?.length || 0} Questions
        </p>
      </div>
    </div>

    {/* Meta */}
    <div className="text-xs text-gray-500">
      Created {moment(quiz.createdAt).fromNow()}
    </div>
  </div>

  {/* Divider */}
  <div className="my-5 h-px bg-gray-100" />

  {/* Action Footer */}
  <div className="flex justify-between items-center">
    {quiz?.userAnswers?.length > 0 ? (
      <Link to={`/quizzes/${quiz._id}/results`}>
        <button className="
          flex items-center gap-2
          px-4 py-2.5
          rounded-lg
          bg-green-600 text-white
          text-sm font-medium
          hover:bg-green-700
          transition
        ">
          <BarChart2 size={16} />
          View Results
        </button>
      </Link>
    ) : (
      <Link to={`/quizzes/${quiz._id}`}>
        <button className="
          flex items-center gap-2
          px-4 py-2.5
          rounded-lg
          bg-blue-600 text-white
          text-sm font-medium
          hover:bg-blue-700
          transition cursor-pointer
        ">
          <Play size={16} />
          Start Quiz
        </button>
      </Link>
    )}
  </div>
</div>
</motion.div>
</>
  );
};

export default QuizCard;
