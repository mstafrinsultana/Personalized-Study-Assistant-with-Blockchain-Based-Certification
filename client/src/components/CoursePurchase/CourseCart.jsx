import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import CheckoutForm from './CheckoutForm'; // Import the CheckoutForm
import { PAYMENT_URL } from '@/constant';
import { useNavigate } from 'react-router-dom';
import {
    addCourse,
    getCartCourses,
    removeCourseFromCart,
} from '@/app/slices/purchaseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toastErrorMessage, toastSuccessMessage } from '@/utils';
import { LucideArrowUpRightFromSquare, Trash } from 'lucide-react';

export default function CourseCart() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartData, loading, error } = useSelector((state) => state.purchase);

    useEffect(() => {
        const fetchCartData = async () => {
            setIsLoading(true);
            dispatch(getCartCourses()).then(() => setIsLoading(false));
        };
        fetchCartData();
    }, [dispatch]);

    const handleBuy = async (course) => {
        const result = await dispatch(
            addCourse({ courseIds: [course._id] })
        ).unwrap();

        if (result?.success) {
            console.log('here: ');

            window.open(PAYMENT_URL.URL, '_blank');
            navigate('/user-dashboard');
            toastSuccessMessage('Course purchased successfully', result);
        } else {
            toastErrorMessage('Failed to purchase course.');
        }
    };

    const handleRemoveFromCart = async (courseId) => {
        dispatch(removeCourseFromCart(courseId));
    };

    const handleCheckoutAll = () => {
        setSelectedCourses(courses); // Select all courses
        setIsCheckoutOpen(true); // Open checkout dialog
    };

    if (loading || isLoading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-start">Your Cart</h1>
            {cartData && cartData.length > 0 ? (
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-8">
                        {cartData.map((item) => (
                            <Card
                                key={item._id}
                                className="flex flex-col md:flex-row items-start transition-all duration-300 hover:shadow-lg overflow-hidden"
                            >
                                <div className="p-4 w-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex justify-between">
                                            {item.course.name}
                                            <Button
                                                onClick={() =>
                                                    handleRemoveFromCart(
                                                        item.course._id
                                                    )
                                                }
                                                className="text-destructive"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <Trash />
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2">
                                            <img
                                                src={item.course.thumbnail}
                                                className="w-40 max-h-28 object-fill rounded-sm border-2"
                                            />
                                            <p className="text-gray-300 mb-4 max-h-36 w-full text-xs text-justify overflow-hidden">
                                                {item.course.description}
                                            </p>
                                        </div>
                                        <p className="font-bold text-lg mt-4 text-primary">
                                            Price : $
                                            {item.course.price.toFixed(2)}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="mt-4">
                                        <Button
                                            className="w-full"
                                            onClick={() =>
                                                handleBuy(item.course)
                                            }
                                        >
                                            Check out this
                                        </Button>
                                    </CardFooter>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Card className="h-fit">
                        <div className="p-4 w-full">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    All Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 mb-4 flex gap-2 items-center">
                                    <span className="text-lg">
                                        Total Courses :
                                    </span>
                                    <span className="bg-muted p-1 px-2 rounded-md">
                                        {cartData?.length || '00'}
                                    </span>
                                </p>
                                <p className="text-gray-300 mb-4 flex gap-2 items-center">
                                    <span className="text-lg">
                                        Total Price :
                                    </span>
                                    <span className="bg-muted p-1 px-2 rounded-md">
                                        {cartData ? cartData.length * 99 : '00'}
                                        $
                                    </span>
                                </p>
                                <p className="font-bold text-lg mt-4 text-primary">
                                    Payment method
                                </p>
                            </CardContent>
                            <CardFooter className="mt-4">
                                <Button
                                    onClick={handleCheckoutAll}
                                    className="mt-4"
                                >
                                    Checkout All
                                    <LucideArrowUpRightFromSquare className="size-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}

            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complete Your Enrollment</DialogTitle>
                    </DialogHeader>
                    {cartData && cartData.length > 0 && (
                        <CheckoutForm
                            courses={cartData.map((item) => item.course)}
                            onSuccess={() => setIsCheckoutOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
