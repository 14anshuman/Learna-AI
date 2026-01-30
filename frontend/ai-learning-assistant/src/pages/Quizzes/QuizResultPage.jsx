import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizzService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  BookOpen,
  Target,
  Info,
} from "lucide-react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../../components/common/PageTransition";
import { Download } from "lucide-react";
import { exportQuizResultPDF } from "../../utils/exportQuizResultPDF";


const QuizResultPage = () => {
  const { quizId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openExplanationIndex, setOpenExplanationIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  /* Fetch result */
  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResult(data);
      } catch (error) {
        toast.error("Failed to fetch quiz result");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizResult();
  }, [quizId]);

  /* Perfect score celebration */
  useEffect(() => {
    if (result?.data?.quiz?.score === 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const toggleExplanation = (index) => {
    setOpenExplanationIndex(
      openExplanationIndex === index ? null : index
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  if (!result || !result.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Quiz result not found.</p>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = result;

  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding performance!";
    if (score >= 80) return "Great job!";
    if (score >= 70) return "Good effort!";
    if (score >= 60) return "Decent attempt!";
    return "Keep practicing!";
  };

  return (
    <PageTransition>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Back */}
        <Link
          to={`/quizzes`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Quizzes
        </Link>

        <PageHeader title={`${quiz.title || "Quiz"} Results`} />

        {/* SCORE HERO */}
        <div className="relative rounded-2xl bg-white p-8 shadow-sm border overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${getScoreGradient(
              score
            )} opacity-5`}
          />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200">
              <Trophy className="text-yellow-500" size={44} />
            </div>

            <div className="text-center md:text-left">
              <p className="text-sm text-slate-500">Your Score</p>
              <div
                className={`text-6xl font-extrabold bg-gradient-to-r ${getScoreGradient(
                  score
                )} bg-clip-text text-transparent`}
              >
                {score}%
              </div>
              <p className="mt-1 text-base font-medium text-slate-700">
                {getScoreMessage(score)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Target className="text-indigo-600" />}
              label="Total Questions"
              value={totalQuestions}
              bg="bg-indigo-50"
            />
            <StatCard
              icon={<CheckCircle2 className="text-emerald-600" />}
              label="Correct"
              value={correctAnswers}
              bg="bg-emerald-50"
            />
            <StatCard
              icon={<XCircle className="text-rose-600" />}
              label="Incorrect"
              value={incorrectAnswers}
              bg="bg-rose-50"
            />
          </div>
        </div>

        {/* DETAILED REVIEW */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {/* Left: Icon + Title */}
  <div className="flex items-center gap-2">
    <BookOpen className="text-slate-700" />
    <h3 className="text-lg font-semibold text-slate-900">
      Detailed Review
    </h3>
  </div>

  {/* Right: Export Button */}
  <button
    onClick={() =>
      exportQuizResultPDF({
        quiz,
        results: detailedResults,
      })
    }
    className="
      inline-flex items-center gap-1.5
      px-4 py-2
      rounded-lg
      bg-indigo-600 text-white
      text-sm font-semibold
      hover:bg-indigo-500
      transition
      self-start sm:self-auto
    "
  >
    <Download size={16} />
    Export PDF
  </button>
</div>

          

          <div className="space-y-6">
            {detailedResults.map((item, index) => {
              const isCorrect = item.isCorrect;

              return (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-5 space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">
                        Question {index + 1}
                      </span>
                      <h4 className="mt-1 text-base font-medium text-slate-900">
                        {item.question}
                      </h4>
                    </div>

                    <div
                      className={`h-10 w-10 flex items-center justify-center rounded-lg
                        ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                    >
                      {isCorrect ? <CheckCircle2 /> : <XCircle />}
                    </div>
                  </div>

                  {/* Options */}
                  <ul className="space-y-2">
                    {item.options.map((opt, i) => {
                      const isUser = opt === item.selectedAnswer;
                      const isCorrectOpt =
                        opt === item.correctAnswer ||
                        item.correctAnswer === `0${i + 1}`;

                      return (
                        <li
                          key={i}
                          className={`rounded-md px-3 py-2 text-sm
                            ${
                              isCorrectOpt
                                ? "bg-emerald-100 text-emerald-800"
                                : isUser
                                ? "bg-rose-100 text-rose-800"
                                : "bg-white border"
                            }`}
                        >
                          {opt}
                        </li>
                      );
                    })}
                  </ul>

                  {/* Explanation */}
                  {item.explanation && (
                    <div>
                      <button
                        onClick={() => toggleExplanation(index)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <Info size={16} />
                        {openExplanationIndex === index
                          ? "Hide explanation"
                          : "Explain answer"}
                      </button>

                      <AnimatePresence>
                        {openExplanationIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="mt-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-4 text-sm"
                          >
                            <p className="font-semibold text-indigo-700 mb-1">
                              Explanation
                            </p>
                            {item.explanation}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <Link to={`/documents/${quiz.document._id}`}>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition active:scale-95">
              <ArrowLeft size={16} />
              Return to Document
            </button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

/* Reusable stat card */
const StatCard = ({ icon, label, value, bg }) => (
  <div className={`flex items-center gap-3 p-4 rounded-lg border-1 ${bg}`}>
    {icon}
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

export default QuizResultPage;
