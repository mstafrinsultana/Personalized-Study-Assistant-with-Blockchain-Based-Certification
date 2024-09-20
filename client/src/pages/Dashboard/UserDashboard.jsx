import { ROLE } from '@/constant';
import { withRoleProtection } from '@/utils';
import {
    CourseEnrollments,
    DashboardGoalsCard,
    UserDashboardCards,
} from '@/components';
import { useDashboardCardsData } from '@/hooks';
import { useSelector } from 'react-redux';

function UserDashboard() {
    const { dashboardCards } = useDashboardCardsData();
    const { userData } = useSelector(({ auth }) => auth);

    return (
        <div className="flex flex-col h-fit w-full">
            <header className="flex flex-col gap-1 justify-between p-3 px-8">
                <h1 className="text-xl font-semibold">
                    Welcome Back, {userData.fullName}
                </h1>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 md:pt-0">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
                    {dashboardCards.map((card, index) => (
                        <UserDashboardCards
                            key={index}
                            card={card}
                            index={index}
                        />
                    ))}
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <CourseEnrollments />
                    <DashboardGoalsCard />
                </div>
            </main>
        </div>
    );
}
export default withRoleProtection(UserDashboard, [ROLE.USER]);
