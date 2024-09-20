import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function UserDashboardCardSkeleton({ index }) {
    return (
        <Skeleton
            key={index}
            x-chunk={`dashboard-01-chunk-${index + 1}`}
            className="h-36"
        />
    );
}

export default UserDashboardCardSkeleton;
