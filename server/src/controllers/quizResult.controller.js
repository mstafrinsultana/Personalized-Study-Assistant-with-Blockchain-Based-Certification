import { StatusCodes } from 'http-status-codes';
import { QuizResult } from '../models/index.js';
import {
    asyncHandler,
    handleResponse,
    validateFields,
    validateIds,
} from '../utils/index.js';

const saveQuizResult = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { score, userId, totalMarks, attemptDate } = req.body;

    validateIds(quizId);
    validateFields(req, { body: ['score', 'totalMarks'] });

    const quizResult = await QuizResult.create({
        user: userId || req.user?.id,
        quiz: quizId,
        score,
        totalMarks,
        attemptDate: attemptDate || Date.now(),
    });

    handleResponse(
        res,
        StatusCodes.ACCEPTED,
        quizResult,
        'Quiz result saved successfully'
    );
});

const getQuizResults = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    const quizResults = await QuizResult.find({
        user: req.user?.id,
        quiz: quizId,
    });

    handleResponse(
        res,
        StatusCodes.OK,
        quizResults,
        'Quiz results fetched successfully'
    );
});

const getLeaderboard = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    const leaderboard = await QuizResult.find({ quiz: quizId })
        .sort({ score: -1 })
        .limit(10);

    handleResponse(
        res,
        StatusCodes.OK,
        leaderboard,
        'Leaderboard fetched successfully'
    );
});

export default {
    saveQuizResult,
    getQuizResults,
};
