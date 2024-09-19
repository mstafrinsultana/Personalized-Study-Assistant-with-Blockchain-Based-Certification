import { Router } from 'express';
import { purchaseController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';
const router = Router();

router.use(verifyJWT);

router
    .route('/cart')
    .get(purchaseController.getCartCourses)
    .post(purchaseController.addCoursesToCart);

router.route('/cart/:courseId').delete(purchaseController.removeCourseFromCart);

router
    .route('/')
    .get(purchaseController.getPurchasedCourses)
    .post(purchaseController.addCourse);

router
    .route('/cert/:courseId')
    .patch(purchaseController.updateHasCertificateStatus);

export default router;
