import express from 'express'
import { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid } from '../controllers/orderController.js'
import { authMW, isAdmin } from '../middleware/authMW.js'

const router = express.Router();

router.route('/').post(
    authMW,
    addOrderItems
).get(
    authMW,
    isAdmin,
    getOrders
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
router.route('/:id/deliver').put(
    authMW,
    isAdmin,
    updateOrderToDelivered
)
export default router;