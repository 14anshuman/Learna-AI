import React, { useEffect, useState } from "react";
import quizService from "../../services/quizzService";
import QuizCard from "../../components/quizzes/QuizCard";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import PageTransition from "../../components/common/PageTransition";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getUserQuizzes();
        setQuizzes(data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  /* Open modal */
  const handleDeleteClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteModal(true);
  };

  /* Confirm delete */
  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;

    setDeleteLoading(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      setQuizzes((prev) =>
        prev.filter((q) => q._id !== selectedQuiz._id)
      );
      toast.success("Quiz deleted");
      setShowDeleteModal(false);
      setSelectedQuiz(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete quiz");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <PageHeader
          title="My Quizzes"
          subtitle="Practice, track progress, and improve"
        />

        {quizzes.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">
            <p className="text-sm">No quizzes found.</p>
            <p className="text-xs mt-1">
              Generate a quiz from a document to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onDelete={() => handleDeleteClick(quiz)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${selectedQuiz?.title}"? This action cannot be undone.`}
        confirmText="Delete Quiz"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </PageTransition>
  );
};

export default Quizzes;
