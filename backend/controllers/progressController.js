import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// @desc    Get user learning statistics
// @route   GET /api/progress/dashboard
// @access  Private


const calculateDailyStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  // Normalize to unique calendar days (local time)
  const uniqueDays = [
    ...new Set(
      activities.map(a =>
        new Date(a.createdAt).toDateString()
      )
    ),
  ];

  // Sort descending (most recent first)
  uniqueDays.sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);

  for (const day of uniqueDays) {
    const activityDate = new Date(day);
    activityDate.setHours(0, 0, 0, 0);

    const diffDays =
      (expectedDate - activityDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      streak++; // today
    } else if (diffDays === 1) {
      streak++; // yesterday
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break; // streak broken
    }

    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  return streak;
};


export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get counts
        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({
            userId,
            completedAt: { $ne: null }
        });

        // Get flashcard statistics
        const flashcardSets = await Flashcard.find({ userId });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(c => c.isStarred).length;
        });

        // Get quiz statistics
        const quizzes = await Quiz.find({
            userId,
            completedAt: { $ne: null }
        });

        const averageScore = quizzes.length > 0
            ? Math.round(
                quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
            )
            : 0;

        // Recent activity
        const recentDocuments = await Document.find({ userId })
            .sort({ lastAccessed: -1 })
            .limit(5)
            .select('title fileName lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('documentId', 'title')
            .select('title score totalQuestions completedAt');

        // Study streak (simplified – in production, track daily activity)
        // Study streak
const activities = [
  ...recentDocuments.map(d => ({
    createdAt: d.lastAccessed || d.createdAt,
  })),
  ...recentQuizzes.map(q => ({
    createdAt: q.completedAt || q.createdAt,
  })),
];

const studyStreak = calculateDailyStreak(activities);


        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        });

    } catch (error) {
        next(error);
    }
};
