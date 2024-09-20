import { Router } from 'express';
import userDashboardController from '../../controllers/userDashboard.controller.js';
import { verifyJWT } from '../../middlewares/index.js';

const router = Router();
router.use(verifyJWT);

router.route('/cards').get(userDashboardController.getUserDashboardInfo);

export default router;
