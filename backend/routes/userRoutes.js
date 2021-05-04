import express from 'express'
import { addProductToWishlist, authUser, deleteUser, getUserById, getUserProfile, getUsers, getUsersWishlistById, regUser, updateUser, updateUserProfile } from '../controllers/userController.js'
import { authMW, isAdmin } from '../middleware/authMW.js'

const router = express.Router();

router.route('/').post(regUser).get(authMW, isAdmin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(
    authMW,
    getUserProfile
).put(authMW, updateUserProfile);
router.route('/wishlist/:id').post(authMW, addProductToWishlist);
router.route('/wishlist').get(authMW, getUsersWishlistById);
router.route('/:id').delete(authMW, isAdmin, deleteUser).get(authMW, isAdmin, getUserById).put(authMW, isAdmin, updateUser);

export default router;