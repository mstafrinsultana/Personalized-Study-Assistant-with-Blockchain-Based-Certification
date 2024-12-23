export const APP_NAME = 'EdTech';

export const USER_ROLES = { USER: 'user', ADMIN: 'admin' };

export const VIDEO_STATUS = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    UNPUBLISHED: 'unpublished',
};

export const SECTION_STATUS = {
    PUBLISHED: 'published',
    UNPUBLISHED: 'unpublished',
};

export const SECTION_TYPES = { LECTURE: 'lecture', QUIZ: 'quiz' };

export const COURSE_STATUS = {
    PUBLISHED: 'published',
    UNPUBLISHED: 'unpublished',
    DRAFTED: 'drafted',
    DELETED: 'deleted',
};

export const GET_COURSE_TYPE = {
    INSTRUCTOR_LIST: 'instructorList',
    CURRICULUM: 'curriculum',
    PREVIEW: 'preview',
    CARD: 'card',
};

export const PROFILE_STATUS = {
    PENDING: 'pending',
    GOAL: 'goal',
    COMPLETED: 'completed',
};

export const QUIZ_TYPE = {
    COURSE_COMPLETION: 'CourseCompletion',
    TOPIC_QUIZ: 'TopicQuiz',
};

export const COURSE_QUESTIONS_COUNT = 40;
export const COURSE_QUIZ_DIFFICULTY = 'Hard';

export const TOPIC_QUESTIONS_COUNT = 30;
export const TOPIC_QUIZ_DIFFICULTY = 'Very Hard';

export const TopicQuizPrompt = `
Please Generate a well-structured quiz for a Skill Topic and follow this structure:

The Quiz should be in the form of Array. in which the options could be array of four options.

1. Create Exactly ${TOPIC_QUESTIONS_COUNT} questions covering all the topics from given Skill Topic.
2. Each question should have four options, with one correct answer.
3. Provide a short explanation for the correct answer.
4. Must Randomize the position of the correct answer to avoid patterns.
5. Strictly Do not repeat same options in many questions.
5. Strictly Do not repeat same questions.
6. Make Questions difficulty level ${TOPIC_QUIZ_DIFFICULTY} means provide ${TOPIC_QUIZ_DIFFICULTY} questions.
7. Format each question as a JSON object as follows:
    {
        "Q": "[Question text]",
        "A": "[Option 1]",
        "B": "[Option 2]",
        "C": "[Option 3]",
        "D": "[Option 4]",
        "Correct": "[A, B, C, or D]",
        "Explanation": "[Brief explanation of the correct answer]"
    }
8. Separate each question object with a line containing only "---".
9. Ensure the entire response is valid JSON when the separators are removed.
10. Again you must generate exactly ${TOPIC_QUESTIONS_COUNT} ${TOPIC_QUIZ_DIFFICULTY} questions following above instructions.
`;

export const AUTH_ERRORS = {
    EMAIL_ALREADY_REGISTERED: 'Email already registered',
    REPOSITORY_LAYER: 'Something went wrong in the auth repository',
    SERVICE_LAYER: 'Something went wrong in the auth service',
    CONTROLLER_LAYER: 'Something went wrong in the auth controller',
    AUTH_NOT_FOUND: 'User not found',
    USER_NOT_FOUND: 'User not found in the database',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_VERIFIED: 'User not verified. Please verify your email',
    INVALID_TOKEN: 'Invalid token or token expired or missing',
    VERIFICATION_EMAIL_SENT:
        'User verification email sent to your email. Please verify your email to login',
    VERIFICATION_EMAIL_SENT_RECENTLY:
        'User verification email sent recently. Please verify your email.',
};
