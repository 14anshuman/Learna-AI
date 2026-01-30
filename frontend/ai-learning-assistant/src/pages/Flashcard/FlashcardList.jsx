import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import PageTransition from "../../components/common/PageTransition";
import { motion } from "framer-motion";

/* Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const FlashcardList = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        setFlashcardSets(response.data);
      } catch (error) {
        toast.error("Failed to fetch flashcard sets.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-gray-500"
        >
          <p className="text-sm font-medium">
            No flashcard sets found
          </p>
          <p className="text-xs mt-1">
            Create your first flashcard set to get started
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {flashcardSets.map((set) => (
          <motion.div
            key={set._id}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260 }}
          >
            <FlashcardSetCard flashcardSet={set} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="All Flashcard Sets" />
        {renderContent()}
      </div>
    </PageTransition>
  );
};

export default FlashcardList;
