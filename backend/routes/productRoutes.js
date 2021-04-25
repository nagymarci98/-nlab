import express from 'express'
import { getProductById, getProducts, deleteProduct, updateProduct, createProduct, createProductReview } from '../controllers/productController.js'
import { authMW, isAdmin } from '../middleware/authMW.js'

const router = express.Router();

router.route('/').get(getProducts).post(authMW, isAdmin, createProduct);
router.route('/:id/review').post(authMW, createProductReview);
router.route('/:id').get(getProductById).delete(authMW, isAdmin, deleteProduct).put(authMW, isAdmin, updateProduct);

export default router;