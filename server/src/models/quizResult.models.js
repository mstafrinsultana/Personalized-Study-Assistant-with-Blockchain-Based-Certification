import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const quizResultSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        quiz: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        totalMarks: {
            type: Number,
            required: false,
        },
        attemptDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const QuizResult = model('QuizResult', quizResultSchema);
