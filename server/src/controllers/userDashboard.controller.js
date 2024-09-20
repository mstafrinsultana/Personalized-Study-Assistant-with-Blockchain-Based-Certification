import { StatusCodes } from 'http-status-codes';
import { asyncHandler, handleResponse } from '../utils/index.js';
import { Goal, Purchase } from '../models/index.js';

const getUserDashboardInfo = asyncHandler(async (req, res) => {
    // Get total purchased courses, total completed courses, Active Goals, Certificates Earned, quizzes completed

    const purchasedCourses = await Purchase.find({
        lerner: req.user?._id,
    }).countDocuments();

    const certificatesEarned = await Purchase.find({
        lerner: req.user?._id,
        hasCertificate: true,
    }).countDocuments();

    const activeGoals = await Goal.find({
        user: req.user?._id,
        progress: { $lt: 100 },
    }).countDocuments();

    const quizzesCompleted = 10;

    const userDashboardInfo = {
        purchasedCourses,
        certificatesEarned,
        activeGoals,
        quizzesCompleted,
    };

    handleResponse(
        res,
        StatusCodes.OK,
        userDashboardInfo,
        'User dashboard info sent successfully'
    );
});

export default { getUserDashboardInfo };
