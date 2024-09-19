import { StatusCodes } from 'http-status-codes';
import { Cart, Purchase } from '../models/index.js';
import { handleResponse, asyncHandler } from '../utils/index.js';
import { SECTION_STATUS, VIDEO_STATUS } from '../constants.js';

const addCourse = asyncHandler(async (req, res) => {
    const { courseIds = [] } = req.body;

    const courses = courseIds.map((courseId) => ({
        course: courseId,
        lerner: req.user?._id,
    }));

    await Purchase.insertMany(courses);

    await removeFromCart(courseIds, req.user?._id);

    console.log({ courseIds });

    handleResponse(res, StatusCodes.OK, courseIds, 'course added successfully');
});

const getPurchasedCourses = asyncHandler(async (req, res) => {
    const courses = await Purchase.aggregate([
        {
            $match: {
                lerner: req.user?._id,
            },
        },
        {
            $lookup: {
                from: 'progresses',
                localField: 'course',
                foreignField: 'course',
                as: 'progresses',
                pipeline: [
                    {
                        $match: {
                            user: req.user?._id,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
                pipeline: [
                    {
                        $lookup: {
                            from: 'coursesections',
                            localField: '_id',
                            foreignField: 'course',
                            as: 'sections',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'sections',
                                        localField: 'section',
                                        foreignField: '_id',
                                        as: 'section',
                                        pipeline: [
                                            {
                                                $match: {
                                                    status: SECTION_STATUS.PUBLISHED,
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: 'sectioncontents',
                                                    localField: '_id',
                                                    foreignField: 'section',
                                                    as: 'videos',
                                                    pipeline: [
                                                        {
                                                            $lookup: {
                                                                from: 'videos',
                                                                localField:
                                                                    'video',
                                                                foreignField:
                                                                    '_id',
                                                                as: 'video',
                                                                pipeline: [
                                                                    {
                                                                        $match: {
                                                                            status: {
                                                                                $ne: VIDEO_STATUS.UNPUBLISHED,
                                                                            },
                                                                        },
                                                                    },
                                                                    {
                                                                        $lookup:
                                                                            {
                                                                                from: 'progresses',
                                                                                localField:
                                                                                    '_id',
                                                                                foreignField:
                                                                                    'video',
                                                                                as: 'progress',
                                                                                pipeline:
                                                                                    [
                                                                                        {
                                                                                            $match: {
                                                                                                user: req
                                                                                                    .user
                                                                                                    ?._id,
                                                                                            },
                                                                                        },
                                                                                    ],
                                                                            },
                                                                    },
                                                                    {
                                                                        $addFields:
                                                                            {
                                                                                progress:
                                                                                    {
                                                                                        $cond: {
                                                                                            if: {
                                                                                                $eq: [
                                                                                                    {
                                                                                                        $size: '$progress',
                                                                                                    },
                                                                                                    0,
                                                                                                ],
                                                                                            },
                                                                                            then: 0,
                                                                                            else: 100,
                                                                                        },
                                                                                    },
                                                                            },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            $match: {
                                                                video: {
                                                                    $exists: true,
                                                                    $ne: [],
                                                                },
                                                            },
                                                        },
                                                        {
                                                            $replaceRoot: {
                                                                newRoot: {
                                                                    $first: '$video',
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                $match: {
                                                    videos: {
                                                        $exists: true,
                                                        $ne: [],
                                                    },
                                                },
                                            },
                                            {
                                                $addFields: {
                                                    completedVideos: {
                                                        $size: {
                                                            $filter: {
                                                                input: '$videos',
                                                                as: 'video',
                                                                cond: {
                                                                    $eq: [
                                                                        '$$video.progress',
                                                                        100,
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    $match: {
                                        section: {
                                            $exists: true,
                                            $ne: [],
                                        },
                                    },
                                },
                                {
                                    $replaceRoot: {
                                        newRoot: { $first: '$section' },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            totalVideos: {
                                $sum: {
                                    $map: {
                                        input: '$sections',
                                        as: 'section',
                                        in: {
                                            $size: '$$section.videos',
                                        },
                                    },
                                },
                            },
                            completedVideos: {
                                $sum: '$sections.completedVideos',
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind: '$course',
        },
        {
            $project: {
                _id: 0,
                course: 1,
                totalVideos: 1,
                completedVideos: 1,
                hasCertificate: 1,
                progress: {
                    $ceil: {
                        $multiply: [
                            {
                                $divide: [
                                    '$course.completedVideos',
                                    '$course.totalVideos',
                                ],
                            },
                            100,
                        ],
                    },
                },
                createdAt: 1,
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, courses, 'Courses sent successfully');
});

const getCartCourses = asyncHandler(async (req, res) => {
    const courses = await Cart.aggregate([
        {
            $match: {
                user: req.user?._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $project: {
                _id: 0,
                course: 1,
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, courses, 'Courses sent successfully');
});

const addCoursesToCart = asyncHandler(async (req, res) => {
    const { courseIds = [] } = req.body;

    const courses = courseIds.map((courseId) => ({
        course: courseId,
        user: req.user?._id,
    }));

    const cartCourses = await Cart.insertMany(courses);

    handleResponse(
        res,
        StatusCodes.OK,
        cartCourses,
        'Courses sent successfully'
    );
});

const removeCourseFromCart = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    await removeFromCart([courseId], req.user?._id);

    handleResponse(
        res,
        StatusCodes.OK,
        [courseId],
        'Courses removed successfully'
    );
});

const removeFromCart = async (courseIds = [], userId) => {
    const courses = courseIds.map((courseId) => ({
        course: courseId,
        user: userId,
    }));

    await Cart.deleteMany(...courses);

    return courseIds;
};

const updateHasCertificateStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const purchase = await Purchase.findOneAndUpdate(
        {
            course: courseId,
            lerner: req.user?._id,
        },
        {
            hasCertificate: true,
        },
        {
            new: true,
        }
    );

    handleResponse(
        res,
        StatusCodes.OK,
        purchase,
        'Purchase updated successfully'
    );
});

export default {
    addCourse,
    getPurchasedCourses,
    getCartCourses,
    addCoursesToCart,
    removeCourseFromCart,
    updateHasCertificateStatus,
};
