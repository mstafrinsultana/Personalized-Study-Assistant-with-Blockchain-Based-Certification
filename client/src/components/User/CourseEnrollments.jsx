import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { axiosConfig } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchasedCourses } from '@/app/slices/purchaseSlice';
import { CERTIFICATE_ELIGIBILITY_PERCENTAGE } from '@/constant';
import { Link, useNavigate } from 'react-router-dom';
import { pushCertificateData } from '@/app/slices/certificateSlice';

export default function CourseEnrollments() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userData } = useSelector(({ auth }) => auth);

    const { purchasedCourses: courses } = useSelector(
        ({ purchase }) => purchase
    );

    useEffect(() => {
        dispatch(getPurchasedCourses());
    }, []);

    const getCertificate = async (courseName, courseID) => {
        const { fullName, university } = userData;

        dispatch(
            pushCertificateData({
                name: fullName,
                university,
                course: courseName,
                issueDate: new Date().toDateString(),
                courseID: courseID,
            })
        );

        navigate(`/certificate/gen`);
    };

    const viewCertificate = (courseId) => {};

    return (
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader>
                <CardTitle>My Enrollments</CardTitle>
                <CardDescription>
                    Latest enrollments in your courses.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Avatar</TableHead>
                            <TableHead>Course Name</TableHead>
                            <TableHead className="text-center">
                                Progress
                            </TableHead>
                            <TableHead className="text-center">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses?.map(
                            ({
                                course,
                                hasCertificate,
                                progress,
                                createdAt,
                            }) => (
                                <TableRow key={course._id}>
                                    <TableCell>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={course.thumbnail}
                                                alt={`${course.name} avatar`}
                                            />
                                            <AvatarFallback>
                                                {course.name
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/courses/${course._id}`}>
                                            <p className="font-medium">
                                                {course.name}
                                            </p>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Progress
                                                value={progress}
                                                className="w-[60px]"
                                            />
                                            <span className="text-sm">
                                                {progress}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {hasCertificate ? (
                                            <Button
                                                onClick={() =>
                                                    viewCertificate(course._id)
                                                }
                                                className="text-xs"
                                            >
                                                View Certificate
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    getCertificate(
                                                        course.name,
                                                        course._id
                                                    )
                                                }
                                                className="text-xs"
                                                variant="outline"
                                                disabled={
                                                    progress <
                                                    CERTIFICATE_ELIGIBILITY_PERCENTAGE
                                                }
                                            >
                                                {progress <
                                                CERTIFICATE_ELIGIBILITY_PERCENTAGE
                                                    ? 'In Progress'
                                                    : 'Get Certificate'}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                        {courses?.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-9"
                                >
                                    No Courses Enrolled yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
