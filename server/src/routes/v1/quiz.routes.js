import { Router } from 'express';
import {
    quizController,
    quizResultController,
} from '../../controllers/index.js';

const router = Router();

// Quiz routes
router.route('/').post(quizController.generateQuiz);
router.route('/gen/topic').post(quizController.generateTopicQuiz);
router.route('/gen/course').post(quizController.generateCourseQuiz);

// Quiz Results routes
router
    .route('/res/:quizId')
    .post(quizResultController.saveQuizResult)
    .get(quizResultController.getQuizResults);

export default router;
