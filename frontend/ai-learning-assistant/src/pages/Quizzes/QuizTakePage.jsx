import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

import quizService from "../../services/quizzService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import {motion} from "framer-motion"
import PageTransition from "../../components/common/PageTransition";


const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(quizId);
        
        const response = await quizService.getQuizById(quizId);
        // console.log(response);
        
        setQuiz(response.data);
      } catch (error) {
        console.error(error);
        console.log(error);
        toast.error("Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

 const handleSubmitQuiz = async () => {
  setSubmitting(true);

  try {
    const formattedAnswers = Object.keys(selectedAnswers).map(
      (questionId) => {
        const question = quiz.questions.find(
          (q) => q._id === questionId
        );
        const questionIndex = quiz.questions.findIndex(
          (q) => q._id === questionId
        );
        const optionIndex = selectedAnswers[questionId];
        const selectedAnswer = question.options[optionIndex];

        return { questionIndex, selectedAnswer };
      }
    );

    await quizService.submitQuiz(quizId, formattedAnswers);
    toast.success("Quiz submitted successfully!");
    navigate(`/quizzes/${quizId}/results`);
  } catch (error) {
    toast.error(error.message || "Failed to submit quiz.");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">
          Quiz not found or has no questions
        </p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <PageTransition>
    
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      <PageHeader title={quiz.title || "Take Quiz"} />

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>

        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1}
        </div>

        <h3 className="text-lg font-medium text-gray-800">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mt-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                  ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="hidden"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="secondary"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <div>
          
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  disabled={submitting}
  onClick={handleSubmitQuiz}
  className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
>
  Submit Quiz
</motion.button>
</div>

          
        ) : (
          <Button onClick={handleNextQuestion}>
            Next
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default QuizTakePage;
