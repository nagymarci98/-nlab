import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Product from '../Components/Product'
import axios from 'axios'

const HomeScreen = () => {
    //state
    const [products, setProducts] = useState([]);

    //this fires off when the screen loads
    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axios.get('/api/products');
            let data = res.data;
            setProducts(data);
        }
        fetchProducts();
    }, [])
    return (
        <>
            <h1>Latest Products</h1>
            <Row>
                {products.map(product => {
                    return (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    )
                })}
            </Row>
        </>
    )
}

export default HomeScreen
