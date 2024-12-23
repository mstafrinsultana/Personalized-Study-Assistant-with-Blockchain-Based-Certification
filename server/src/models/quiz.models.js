import mongoose from 'mongoose';
import { QUIZ_TYPE } from '../constants.js';

const { Schema, model } = mongoose;

const quizSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: QUIZ_TYPE,
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: false,
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: false,
        },
    },
    { timestamps: true }
);

export const Quiz = model('Quiz', quizSchema);
