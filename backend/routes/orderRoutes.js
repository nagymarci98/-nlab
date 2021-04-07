import express from 'express'
import { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid } from '../controllers/orderController.js'
import { authMW } from '../middleware/authMW.js'

const router = express.Router();

router.route('/').post(
    authMW,
    addOrderItems
)
router.route('/myorders').get(
    authMW,
    getMyOrders
)
router.route('/:id').get(
    authMW,
    getOrderById
)
router.route('/:id/pay').put(
    authMW,
    updateOrderToPaid
)
export default router;