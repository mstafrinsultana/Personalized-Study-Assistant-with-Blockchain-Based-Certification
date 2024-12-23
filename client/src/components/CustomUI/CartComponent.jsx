import React, { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getCartCourses } from '@/app/slices/purchaseSlice';

function CartComponent() {
    const dispatch = useDispatch();
    const { userData } = useSelector(({ auth }) => auth);
    const { cartData } = useSelector(({ purchase }) => purchase);

    useEffect(() => {
        if (userData) {
            dispatch(getCartCourses());
        }
    }, [userData]);

    return (
        <div className="relative">
            {cartData?.length > 0 && (
                <span className="rounded-full absolute right-0 -top-0 bg-muted size-3 text-xs font-bold flex items-center justify-center">
                    {cartData.length}
                </span>
            )}
            <Button asChild size="icon" variant="ghost" className="relative">
                <Link to={`/cart`}>
                    <ShoppingCart />
                </Link>
            </Button>
        </div>
    );
}

export default CartComponent;
