import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'
import ProductPrice from './ProductPrice'
import { useDispatch } from 'react-redux'
import { USER_LIST_WISHLIST_RESET } from '../constans/userConstans'

const Product = ({ product }) => {
    const dispatch = useDispatch();
    const onClickHandler = () => {
        dispatch({ type: USER_LIST_WISHLIST_RESET })
    }
    return (
        <Card className='h-100 p-3 rounded'  >
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant='top' className='card-img-top' />
            </Link>
            <Card.Body className='d-flex flex-column '>
                <Link to={`/product/${product._id}`} onClick={onClickHandler} >
                    <Card.Title as='div'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div' className='mt-auto'>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>
                <Card.Text as='h3'>
                    <ProductPrice price={product.price}></ProductPrice>
                </Card.Text>
            </Card.Body>
        </Card >
    )
}

export default Product
