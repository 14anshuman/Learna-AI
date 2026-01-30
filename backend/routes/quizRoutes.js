import express from 'express';
import {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
    getAllQuiz
} from '../controllers/quizController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/:documentId', getQuizzes);
router.get('/quiz/:quizId', getQuizById);
router.post('/:id/submit', submitQuiz);
router.get('/',getAllQuiz);
router.get('/:id/results', getQuizResults);
router.delete('/:id', deleteQuiz);




export default router;
