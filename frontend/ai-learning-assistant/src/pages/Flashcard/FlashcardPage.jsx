import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import Flashcard from "../../components/flashcards/Flashcard";
import PageTransition from "../../components/common/PageTransition";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSets, setFlashcardSets] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ---------------- Fetch Flashcards ---------------- */
  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      setFlashcardSets(response.data[0] || null);
      setFlashcards(response.data[0]?.cards || []);
      setCurrentCardIndex(0);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  /* ---------------- Generate Flashcards ---------------- */
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- Navigation ---------------- */
  const handleNextCard = () => {
    setCurrentCardIndex(
      (prev) => (prev + 1) % flashcards.length
    );
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  /* ---------------- Review ---------------- */
  const handleReview = async (index) => {
    const currentCard = flashcards[index];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  /* ---------------- Star ---------------- */
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === cardId
            ? { ...card, isStarred: !card.isStarred }
            : card
        )
      );
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to update star status.");
    }
  };

  /* ---------------- Delete Flashcard Set ---------------- */
  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSets?._id) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- Render Flashcard ---------------- */
  const renderFlashcard = () => {
    if (loading) return <Spinner />;

    if (flashcards.length === 0) {
      return (
        <div className="text-center text-slate-500 mt-8">
          No flashcards available.
        </div>
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center gap-6 mt-6">
        <div className="w-full max-w-xl">
          <Flashcard
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              handleReview(currentCardIndex);
              handlePrevCard();
            }}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
          <ChevronLeft size={16}/>
          </Button>

          <span className="text-sm font-medium text-slate-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={() => {
              handleReview(currentCardIndex);
              handleNextCard();
            }}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
          <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <PageTransition>
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        to={`/documents/${documentId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      {/* Header */}
      <PageHeader title="Flashcards">
        <div className="flex items-center gap-2">
          {!loading && flashcards.length > 0 && !isDeleteModalOpen && (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="
                text-rose-600
                
              
              "
            >
              <Trash2 size={16} /> Delete Set
            </Button>
          )}

          <Button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="bg-green-700 text-white "
          >
            {generating ? (
              <Spinner />
            ) : (
              <>
                <Plus size={16} /> Generate Flashcards
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      {/* Inline Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm text-slate-700">
            Are you sure you want to delete this flashcard set?
            <br />
            <span className="text-rose-600 font-medium">
              This action cannot be undone.
            </span>
          </p>

          <div className="mt-4 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {deleting ? <Spinner /> : "Confirm Delete"}
            </Button>
          </div>
        </div>
      )}

      {renderFlashcard()}
    </div>
    </PageTransition>
  );
};

export default FlashcardPage;
