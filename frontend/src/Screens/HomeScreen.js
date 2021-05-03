import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../Components/Product'
import { listProducts } from '../actions/productActions'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import Paginate from '../Components/Paginate'

const HomeScreen = ({ match }) => {
    const keyword = match.params.keyword;
    const pageNumber = match.params.pagenumber || 1;
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, products, error, page, pages } = productList;

    //this fires off when the screen loads
    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber])

    return (
        <>
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Row>
                        {products.map(product => {
                            return (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='my-3'>
                                    <Product product={product} />
                                </Col>
                            )
                        })}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}></Paginate>
                </>
            )}
        </>
    )
}

export default HomeScreen
