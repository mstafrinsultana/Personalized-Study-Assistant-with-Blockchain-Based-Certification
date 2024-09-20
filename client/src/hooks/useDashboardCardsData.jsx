import { getUserDashboardCards } from '@/app/slices/userSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCheck, GoalIcon, ShoppingCart } from 'lucide-react';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { ReaderIcon } from '@radix-ui/react-icons';

function useDashboardCardsData() {
    const dispatch = useDispatch();

    const { dashboardCardsData } = useSelector(({ user }) => user.userData);

    const [dashboardCards, setDashboardCards] = useState([
        null,
        null,
        null,
        null,
        null,
    ]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dashboardCardsData) {
            const cards = [
                {
                    title: 'Courses Purchased',
                    icon: (
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    ),
                    figure: dashboardCardsData?.purchasedCourses,
                    insight:
                        "Congratulations! You've bought 3 courses this month.",
                },
                {
                    title: 'Active Goals',
                    icon: (
                        <GoalIcon className="h-4 w-4 text-muted-foreground" />
                    ),
                    figure: dashboardCardsData?.activeGoals,
                    insight: "You're making progress on all your goals.",
                },
                {
                    title: 'Total Learning Hours',
                    icon: (
                        <ReaderIcon className="h-4 w-4 text-muted-foreground" />
                    ),
                    figure: '73',
                    insight: "You've spent 10 hours this week learning.",
                },
                {
                    title: 'Certificates Earned',
                    icon: (
                        <AiFillSafetyCertificate className="h-4 w-4 text-muted-foreground" />
                    ),
                    figure: dashboardCardsData?.certificatesEarned,
                    insight: 'Great job! You’ve earned 2 new certificates.',
                },
                {
                    title: 'Quizzes Completed',
                    icon: (
                        <CheckCheck className="h-4 w-4 text-muted-foreground" />
                    ),
                    figure: dashboardCardsData?.quizzesCompleted,
                    insight: "You've spent 10 hours this week learning.",
                },
            ];
            setDashboardCards(() => cards);
            setLoading(false);
        }
        dispatch(getUserDashboardCards()).then(({ payload: userData }) => {
            if (userData) {
                const cards = [
                    {
                        title: 'Courses Purchased',
                        icon: (
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        ),
                        figure: userData?.purchasedCourses,
                        insight: `Congratulations! You've bought ${userData?.purchasedCourses} courses.`,
                    },
                    {
                        title: 'Active Goals',
                        icon: (
                            <GoalIcon className="h-4 w-4 text-muted-foreground" />
                        ),
                        figure: userData?.activeGoals,
                        insight: "You're making progress on all your goals.",
                    },
                    {
                        title: 'Total Learning Hours',
                        icon: (
                            <ReaderIcon className="h-4 w-4 text-muted-foreground" />
                        ),
                        figure: '73',
                        insight: "You've spent 10 hours this week learning.",
                    },
                    {
                        title: 'Certificates Earned',
                        icon: (
                            <AiFillSafetyCertificate className="h-4 w-4 text-muted-foreground" />
                        ),
                        figure: userData?.certificatesEarned,
                        insight: `Great job! You’ve earned ${userData?.certificatesEarned} certificates.`,
                    },
                    {
                        title: 'Quizzes Completed',
                        icon: (
                            <CheckCheck className="h-4 w-4 text-muted-foreground" />
                        ),
                        figure: userData?.quizzesCompleted,
                        insight: `Great! You've completed ${userData?.quizzesCompleted} quizzes.`,
                    },
                ];
                setDashboardCards(() => cards);
            }
            setLoading(false);
        });
    }, []);

    return { dashboardCards, setDashboardCards, loading };
}

export default useDashboardCardsData;
