import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizzService";
import aiService from "../../services/aiService";

import Spinner from "../common/Spinner";
import Button from "../common/Button";
import QuizCard from "./QuizCard";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      // console.log(numQuestions)
      await aiService.generateQuiz(documentId, numQuestions );
      toast.success("Quiz generated successfully!");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;

    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      toast.success("Quiz deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to delete quiz");
      console.error(error)
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) return <Spinner />;

    if (quizzes.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="p-3 rounded-full bg-blue-50 text-blue-600">
        <Plus size={20} />
      </div>

      <p className="text-gray-700 font-medium">
        No quizzes yet
      </p>

      <p className="text-gray-500 text-sm">
        Generate a quiz to test your knowledge.
      </p>
    </div>
  );
}

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz._id}
            quiz={quiz}
            onDelete={() => handleDeleteRequest(quiz)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>

      {/* Content */}
      {renderQuizContent()}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Quiz
            </h3>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this quiz?  
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* GENERATE QUIZ MODAL */}
{isGenerateModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-5">
      
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Generate Quiz
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose how many questions you want in the quiz.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerateQuiz} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Questions
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setIsGenerateModalOpen(false)}
            disabled={generating}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={generating}>
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default QuizManager;
