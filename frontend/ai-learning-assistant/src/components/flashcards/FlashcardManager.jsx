import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Sparkles, Brain, ArrowLeft,ChevronLeft,ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import flashcardService from '../../services/flashcardService';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import Flashcard from './Flashcard';

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFLashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFLashcardSets(response.data);
    } catch (error) {
      toast.error('Failed to fetch flashcard sets.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success('Flashcards generated successfully');
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success('Flashcard reviewed!');
    } catch {
      toast.error('Failed to review flashcard.');
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success('Flashcard set deleted successfully');

      // Remove deleted set from state
      setFLashcardSets((prev) => prev.filter((s) => s._id !== setToDelete._id));

      // Close modal and reset selected set
      setSetToDelete(null);
      setSelectedSet(null);
    } catch {
      toast.error('Failed to delete flashcard set');
    } finally {
      setDeleting(false);
    }
  };


  const handleToggleStar = async (cardId) => {
  try {
    await flashcardService.toggleStar(cardId);

    const updatedSets = flashcardSets.map((set) => {
      if (set._id === selectedSet._id) {
        const updatedCards = set.cards.map((card) =>
          card._id === cardId
            ? { ...card, isStarred: !card.isStarred }
            : card
        );

        return { ...set, cards: updatedCards };
      }
      return set;
    });

    setFLashcardSets(updatedSets);
    setSelectedSet(updatedSets.find(set => set._id === selectedSet._id));
    toast.success("Flashcard starred status updated");
  } catch (error) {
    toast.error("Failed to update star status");
  }
};

  

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  // You can keep your existing renderFlashcardViewer here
 const renderFlashcardViewer = () => {
  const currentCard = selectedSet.cards[currentCardIndex];

  return (
    <div className="flex flex-col space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedSet(null)}
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        Back to Sets
      </button>

      {/* Flashcard Container */}
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />

        {/* Navigation */}
        {selectedSet.cards.length > 1 && (
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handlePrevCard}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              
            </button>
            <span className="text-sm text-gray-500">
              {currentCardIndex + 1} / {selectedSet.cards.length}
            </span>
            <button
              onClick={handleNextCard}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
            <Brain className="text-indigo-600" strokeWidth={2} />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flashcards Yet</h3>

          <p className="text-gray-600 max-w-md mb-6">
            Generate flashcards from your document to start learning and reinforce your knowledge.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition
              ${
                generating
                  ? 'bg-green-900 cursor-not-allowed'
                  : 'bg-green-700'
              }
              text-white`}
          >
            {generating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Your Flashcard Sets</h3>
            <p className="text-sm text-gray-500">
              {flashcardSets.length} {flashcardSets.length === 1 ? 'set' : 'sets'} available
            </p>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition
              ${
                generating
                  ? 'cursor-not-allowed bg-green-700'
                  : 'bg-green-700'
              }
              text-white`}
          >
            {generating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        {/* Flashcard Sets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-indigo-500"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute right-3 top-3 rounded-full p-2 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>

              {/* Set Content */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                  <Brain className="h-6 w-6 text-indigo-600" strokeWidth={2} />
                </div>

                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold text-gray-900">Flashcard Set</h4>
                  <p className="text-sm text-gray-500">
                    Created {moment(set.createdAt).format('MMM D, YYYY')}
                  </p>

                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                      {set.cards.length} {set.cards.length === 1 ? 'card' : 'cards'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8 relative">
      {selectedSet ? renderFlashcardViewer() : renderSetList()}

      {/* Delete Modal */}
      {setToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold">Delete Flashcard Set</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this flashcard set? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSetToDelete(null)}
                disabled={deleting}
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManager;
