import express from 'express'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
import pkg from '../../frontend/src/counter.js';
const { countInc, getCounter } = pkg;

const router = express.Router();

//@desc     Fetch all products
//@route    GET /api/products
//@access   Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    console.log('Megkaptam a get req-et ' + getCounter());
    throw new Error('Some errorererre');
    res.json(products);
}));


//@desc     Fetch signle product
//@route    GET /api/products/:id
//@access   Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product)

    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
export default router;