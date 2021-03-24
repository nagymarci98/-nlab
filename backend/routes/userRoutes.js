import express from 'express'
import { authUser, getUserProfile, regUser, updateUserProfile } from '../controllers/userController.js'
import { authMW } from '../middleware/authMW.js'

const router = express.Router();

router.route('/').post(regUser);
router.post('/login', authUser);
router.route('/profile').get(
    authMW,
    getUserProfile
).put(authMW, updateUserProfile);

export default router;