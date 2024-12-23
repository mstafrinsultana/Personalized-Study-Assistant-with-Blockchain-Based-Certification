import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { axiosConfig, toastErrorMessage } from '@/utils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Component() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [attemptedQuestions, setAttemptedQuestions] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);
    const [agreedToInstructions, setAgreedToInstructions] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [disqualified, setDisqualified] = useState(false);
    const [loading, setLoading] = useState(true);

    const topics = useSelector((state) => state.quiz.topicsData);

    useEffect(() => {
        setSelectedOption(answers[currentQuestion] ?? null);
    }, [currentQuestion, answers]);

    useEffect(() => {
        fetchQuizData();
        document.addEventListener('visibilitychange', handleTabSwitch);

        return () => {
            document.removeEventListener('visibilitychange', handleTabSwitch);
        };
    }, []);

    const fetchQuizData = async () => {
        try {
            const response = await axiosConfig.post('/quiz/gen/topic', {
                topics,
            });
            console.log('Quiz Data: ', response.data.data);
            if (response.data.success) {
                setQuestions(response.data.data);
            } else {
                console.error('Failed to fetch quiz data');
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabSwitch = () => {
        if (document.visibilityState === 'hidden') {
            setTabSwitchCount((prevCount) => {
                const newCount = prevCount + 1;

                if (newCount === 1) {
                    toastErrorMessage(
                        'Warning: You will be disqualified if you switch tabs again.'
                    );
                } else if (newCount === 2) {
                    toastErrorMessage(
                        'Final Warning: One more tab switch and you will be disqualified.'
                    );
                } else if (newCount > 2) {
                    navigate('/disqualified');
                    setDisqualified(true);
                }

                return newCount;
            });
        }
    };

    const handleAnswer = (answer) => {
        setSelectedOption(answer);
    };

    const handleSave = () => {
        if (selectedOption !== null) {
            setAnswers({ ...answers, [currentQuestion]: selectedOption });
            setAttemptedQuestions({
                ...attemptedQuestions,
                [currentQuestion]: true,
            });
        }
        setCurrentQuestion(currentQuestion + 1);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setAttemptedQuestions({
                ...attemptedQuestions,
                [currentQuestion]: true,
            });
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const calculateScore = () => {
        let score = 0;
        Object.keys(answers).forEach((questionIndex) => {
            if (
                answers[Number(questionIndex)] ===
                questions[Number(questionIndex)].answer
            ) {
                score++;
            }
        });
        return score;
    };

    const getQuestionState = (index) => {
        if (answers[index] !== undefined) return 'bg-green-500'; // Answered
        if (attemptedQuestions[index]) return 'bg-yellow-500'; // Attempted but not saved
        return 'bg-gray-300'; // Not attempted
    };

    if (loading) {
        return <div>Loading quiz...</div>;
    }

    const canSubmit =
        Object.keys(attemptedQuestions)?.length >=
        Math.ceil(questions?.length / 2);

    const remainingQuestions = questions?.length - Object.keys(answers)?.length;

    if (showInstructions) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold mb-6">
                        Exam Instructions
                    </h1>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>You have 60 minutes to complete the exam.</li>
                        <li>
                            There are {questions.length} multiple-choice
                            questions.
                        </li>
                        <li>Each question has only one correct answer.</li>
                        <li>
                            You must attempt at least 50% of the questions to
                            submit the exam.
                        </li>
                        <li>
                            You can navigate between questions using the sidebar
                            or next/previous buttons.
                        </li>
                        <li>
                            Click "Save" to record your answer for the current
                            question.
                        </li>
                        <li>
                            You can change your answers at any time before
                            submitting the exam.
                        </li>
                    </ul>
                    <div className="flex items-center space-x-2 mb-6">
                        <Checkbox
                            id="agree"
                            checked={agreedToInstructions}
                            onCheckedChange={(checked) =>
                                setAgreedToInstructions(checked)
                            }
                        />
                        <Label htmlFor="agree">
                            I have read and understood the instructions
                        </Label>
                    </div>
                    <Button
                        onClick={() => setShowInstructions(false)}
                        disabled={!agreedToInstructions}
                        className="w-full"
                    >
                        Start Exam
                    </Button>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = calculateScore();
        const wrongAnswers = questions.filter(
            (q, index) => answers[index] !== q.answer
        );

        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-3xl font-bold mb-6">Exam Results</h2>
                    <p className="text-xl mb-4">
                        Your score: {score} out of {questions.length}
                    </p>
                    <p className="text-lg mb-6">
                        Percentage:{' '}
                        {((score / questions.length) * 100).toFixed(2)}%
                    </p>
                    <h3 className="text-2xl font-semibold mb-4">
                        Incorrect Answers:
                    </h3>
                    {wrongAnswers.map((q, index) => (
                        <div
                            key={index}
                            className="mb-6 p-4 bg-red-50 rounded-lg"
                        >
                            <p className="font-medium mb-2">
                                Question: {q.question}
                            </p>
                            <p className="text-red-600 mb-1">
                                Your answer:{' '}
                                {q.options[answers[questions.indexOf(q)]] ||
                                    'Not answered'}
                            </p>
                            <p className="text-green-600 mb-1">
                                Correct answer: {q.options[q.answer]}
                            </p>
                            <p className="text-gray-600 italic">
                                Explanation: {q.explanation}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (disqualified) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600">
                    You have been disqualified for switching tabs multiple
                    times.
                </h2>
                <p className="mt-4 text-gray-600">
                    Please contact the administrator if you have any issues.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">JEE Mock Exam</h1>
                    <Button
                        onClick={handleSubmit}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={!canSubmit}
                    >
                        Submit Exam
                    </Button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                Question {currentQuestion + 1}
                            </h2>
                        </div>
                        <p className="text-lg mb-6">
                            {questions[currentQuestion].question}
                        </p>
                        <RadioGroup
                            onValueChange={(value) =>
                                handleAnswer(Number(value))
                            }
                            value={selectedOption?.toString() || ''}
                        >
                            {questions[currentQuestion].options.map(
                                (option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 mb-4"
                                    >
                                        <RadioGroupItem
                                            value={index.toString()}
                                            id={`option-${index}`}
                                        />
                                        <Label htmlFor={`option-${index}`}>
                                            {option}
                                        </Label>
                                    </div>
                                )
                            )}
                        </RadioGroup>
                        <div className="flex justify-between mt-8">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>
                            <div className="space-x-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={selectedOption === null}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        currentQuestion === questions.length - 1
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-64 bg-white shadow-md">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-4">
                                Questions
                            </h2>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((_, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className={`w-10 h-10 ${getQuestionState(
                                            index
                                        )}`}
                                        onClick={() =>
                                            setCurrentQuestion(index)
                                        }
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                                    <span>Attempted</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                                    <span>Not Attempted</span>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                                <p className="font-semibold text-blue-800">
                                    Remaining Questions: {remainingQuestions}
                                </p>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
// import { Progress } from '@/components/ui/progress';
// import axios from 'axios';
// import { axiosConfig, toastErrorMessage } from '@/utils';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// export default function Quiz() {
//     const [quizData, setQuizData] = useState([]);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [answers, setAnswers] = useState([]);
//     const [quizCompleted, setQuizCompleted] = useState(false);
//     const [score, setScore] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [tabSwitchCount, setTabSwitchCount] = useState(0); // For counting tab switches
//     const [disqualified, setDisqualified] = useState(false);

//     const navigate = useNavigate();
//     const topics = useSelector((state) => state.quiz.topicsData);

//     useEffect(() => {
//         fetchQuizData();
//         document.addEventListener('visibilitychange', handleTabSwitch);

//         return () => {
//             document.removeEventListener('visibilitychange', handleTabSwitch);
//         };
//     }, []);

//     const fetchQuizData = async () => {
//         try {
//             const response = await axios.post(
//                 'http://localhost:3000/api/v1/quiz',
//                 { topics }
//             );
//             console.log('Quiz Data: ', response.data.data);
//             if (response.data.success) {
//                 setQuizData(response.data.data);
//                 setAnswers(new Array(response.data.data.length).fill(null));
//                 setLoading(false);
//             } else {
//                 console.error('Failed to fetch quiz data');
//             }
//         } catch (error) {
//             console.error('Error fetching quiz data:', error);
//         }
//     };

//     const handleAnswer = (index) => {
//         const newAnswers = [...answers];
//         newAnswers[currentQuestion] = index;
//         setAnswers(newAnswers);
//     };

//     const handleNext = () => {
//         if (currentQuestion < quizData.length - 1) {
//             setCurrentQuestion(currentQuestion + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentQuestion > 0) {
//             setCurrentQuestion(currentQuestion - 1);
//         }
//     };

//     const handleSubmit = () => {
//         let newScore = 0;
//         answers.forEach((answer, index) => {
//             if (answer === quizData[index].answer) {
//                 newScore++;
//             }
//         });
//         setScore(newScore);
//         setQuizCompleted(true);
//     };

//     const handleTabSwitch = () => {
//         if (document.visibilityState === 'hidden') {
//             setTabSwitchCount((prevCount) => {
//                 const newCount = prevCount + 1;

//                 if (newCount === 1) {
//                     toastErrorMessage(
//                         'Warning: You will be disqualified if you switch tabs again.'
//                     );
//                 } else if (newCount === 2) {
//                     toastErrorMessage(
//                         'Final Warning: One more tab switch and you will be disqualified.'
//                     );
//                 } else if (newCount > 2) {
//                     navigate('/disqualified');
//                     setDisqualified(true); // Disqualify the user
//                 }

//                 return newCount;
//             });
//         }
//     };

//     const passPercentage = 75;
//     const finalScore = (score / quizData.length) * 100;
//     const passed = finalScore >= passPercentage;

//     const renderResult = () => (
//         <div className="text-center">
//             <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
//             <p className="text-xl mb-2">
//                 Your score: {score}/{quizData.length} ({finalScore.toFixed(2)}%)
//             </p>
//             <p
//                 className={`text-2xl font-bold ${
//                     passed ? 'text-green-600' : 'text-red-600'
//                 }`}
//             >
//                 {passed
//                     ? 'Congratulations! You passed the exam.'
//                     : 'Sorry, you did not pass the exam.'}
//             </p>
//             <p className="mt-4 text-gray-600">
//                 {passed
//                     ? `Great job! You've demonstrated a solid understanding of the material.`
//                     : `Don't worry! Review the material and try again. You need ${passPercentage}% to pass.`}
//             </p>
//         </div>
//     );

//     if (loading) {
//         return <div>Loading quiz...</div>;
//     }

//     if (disqualified) {
//         return (
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold text-red-600">
//                     You have been disqualified for switching tabs multiple
//                     times.
//                 </h2>
//                 <p className="mt-4 text-gray-600">
//                     Please contact the administrator if you have any issues.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <Card className="w-full max-w-2xl mx-auto shadow-lg">
//                 <CardHeader className="bg-primary text-primary-foreground">
//                     <CardTitle className="text-2xl">Exam Quiz</CardTitle>
//                     {!quizCompleted && (
//                         <CardDescription className="text-primary-foreground/80">
//                             Question {currentQuestion + 1} of {quizData.length}
//                         </CardDescription>
//                     )}
//                 </CardHeader>
//                 <CardContent className="pt-6">
//                     {!quizCompleted ? (
//                         <>
//                             <Progress
//                                 value={
//                                     (currentQuestion / quizData.length) * 100
//                                 }
//                                 className="mb-6"
//                             />
//                             <h2 className="text-xl font-semibold mb-4">
//                                 {quizData[currentQuestion].question}
//                             </h2>
//                             <RadioGroup
//                                 value={answers[currentQuestion]?.toString()}
//                                 onValueChange={(value) =>
//                                     handleAnswer(parseInt(value))
//                                 }
//                             >
//                                 {quizData[currentQuestion].options.map(
//                                     (option, index) => (
//                                         <div
//                                             key={index}
//                                             className="flex items-center space-x-2 mb-4 p-3 rounded-lg transition-colors hover:bg-secondary"
//                                         >
//                                             <RadioGroupItem
//                                                 value={index.toString()}
//                                                 id={`option-${index}`}
//                                                 className="border-2"
//                                             />
//                                             <Label
//                                                 htmlFor={`option-${index}`}
//                                                 className="flex-grow cursor-pointer"
//                                             >
//                                                 {option}
//                                             </Label>
//                                         </div>
//                                     )
//                                 )}
//                             </RadioGroup>
//                         </>
//                     ) : (
//                         renderResult()
//                     )}
//                 </CardContent>
//                 <CardFooter className="flex justify-between items-center bg-secondary">
//                     {!quizCompleted ? (
//                         <>
//                             <Button
//                                 onClick={handlePrevious}
//                                 disabled={currentQuestion === 0}
//                                 className="bg-primary hover:bg-primary/90 mt-2"
//                             >
//                                 Previous
//                             </Button>
//                             {currentQuestion === quizData.length - 1 ? (
//                                 <Button
//                                     onClick={handleSubmit}
//                                     disabled={answers.some(
//                                         (answer) => answer === null
//                                     )}
//                                     className="bg-primary hover:bg-primary/90 mt-2"
//                                 >
//                                     Submit Quiz
//                                 </Button>
//                             ) : (
//                                 <Button
//                                     onClick={handleNext}
//                                     disabled={answers[currentQuestion] === null}
//                                     className="bg-primary hover:bg-primary/90 mt-2"
//                                 >
//                                     Next
//                                 </Button>
//                             )}
//                         </>
//                     ) : (
//                         <Button
//                             onClick={() => window.location.reload()}
//                             className="bg-primary hover:bg-primary/90 mx-auto mt-2"
//                         >
//                             Recommend a course
//                         </Button>
//                     )}
//                 </CardFooter>
//             </Card>
//         </div>
//     );
// }
