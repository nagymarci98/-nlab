import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../Components/Rating'
import { getProductDetails, createProductReview } from '../actions/productActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import ProductPrice from '../Components/ProductPrice'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constans/productConstans'
import { listUserFavouriteProducts, addRemoveFavouriteProduct } from '../actions/userActions'
import { USER_ADD_PRODUCT_TO_WISHLIST_RESET, USER_LIST_WISHLIST_RESET } from '../constans/userConstans'

const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [alreadyInWishlist, setAlreadyInWistlist] = useState(false);
    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const productCreateReview = useSelector(state => state.productCreateReview);
    const { loading: loadingProductReview, error: errorProductReview, success: successProdcutReview } = productCreateReview;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userFavouriteProducts = useSelector(state => state.userFavouriteProducts);
    const { loading: loadingFavourits, success: successFavourites, error: errorFavourites, favouriteProducts } = userFavouriteProducts;

    const userAddRemoveFavouriteProduct = useSelector(state => state.userAddRemoveFavouriteProduct);
    const { loading: loadingAddRemove, success: successAddRemove, error: errorAddRemove } = userAddRemoveFavouriteProduct;

    useEffect(() => {
        if (successProdcutReview) {
            alert('Review Submitted!');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(getProductDetails(match.params.id));
        if (!successFavourites) {
            dispatch(listUserFavouriteProducts());
        } else {
            alreadyOnWhistlistDetermine();
        }
    }, [dispatch, match, successProdcutReview, successFavourites, alreadyInWishlist, favouriteProducts, successAddRemove]);
    const alreadyOnWhistlistDetermine = () => {
        if (favouriteProducts && favouriteProducts.length > 0) {
            var alreadyOnWhistlist = favouriteProducts.find(x => (x._id.toString() === match.params.id.toString()));
        }
        alreadyOnWhistlist ? setAlreadyInWistlist(true) : setAlreadyInWistlist(false);
    }
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    };
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(match.params.id, {
            rating, comment
        }));
    }
    const addRemoveToWishlistHandler = (e) => {
        e.preventDefault();
        dispatch({ type: USER_ADD_PRODUCT_TO_WISHLIST_RESET });
        dispatch(addRemoveFavouriteProduct(match.params.id));
        dispatch(listUserFavouriteProducts());
    }
    return (
        <>
            <Link className='btn btn-light my-3' to='/'>Go Back</Link>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={6} lg={3} className='mb-4'>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <ProductPrice price={product.price}></ProductPrice>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={12} lg={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Price:
                                    </Col>
                                            <Col>
                                                <strong><ProductPrice price={product.price}></ProductPrice></strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Status:
                                    </Col>
                                            <Col>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item>
                                        <Button className='btn-block' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}> Add To Cart</Button>
                                        {loadingFavourits ? <Loader /> : (
                                            <>
                                                {alreadyInWishlist ? (
                                                    <Button className='btn-block btn-light' type='button' onClick={(e) => addRemoveToWishlistHandler(e)}>
                                                        Remove From Wishlist<span className='fas fa-heart ml-2' style={{ color: "red" }}></span>
                                                    </Button>
                                                ) : (
                                                    <Button className='btn-block btn-light' type='button' onClick={(e) => addRemoveToWishlistHandler(e)}>
                                                        Add To Wishlist<span className='far fa-heart ml-2' style={{ color: "red" }}></span>
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating}></Rating>
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control as='select' value={rating} onChange={e => setRating(e.target.value)}>
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excelent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control as='textarea' row='3' value={comment} onChange={e => setComment(e.target.value)}></Form.Control>
                                            </Form.Group>
                                            <Button type='submit' variant='primary'>Submit Review</Button>
                                        </Form>
                                    ) : <Message>Please <Link to='login'>Sign In</Link> to write a review</Message>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default ProductScreen
