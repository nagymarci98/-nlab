import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../Components/Product'
import { listProducts } from '../actions/productActions'
import Message from '../Components/Message'
import Loader from '../Components/Loader'

const HomeScreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, products, error } = productList;

    //this fires off when the screen loads
    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch])

    return (
        <>
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Row>
                    {products.map(product => {
                        return (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='my-3 '>
                                <Product product={product} />
                            </Col>
                        )
                    })}
                </Row>)}
        </>
    )
}

export default HomeScreen
