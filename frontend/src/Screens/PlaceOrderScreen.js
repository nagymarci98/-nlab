import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import FormContainer from '../Components/FormContainer'
import Message from '../Components/Message'
import CheckoutSteps from '../Components/CheckoutSteps'
import ProductPrice from '../Components/ProductPrice'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    const [message, setMessage] = useState(null);

    //Calc price
    const cartItemsPriceTotal = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    cart.itemsPrice = cartItemsPriceTotal * 0.73;
    cart.shippingPrice = cart.itemsPrice > 20000 ? 0 : 899;
    cart.taxPrice = Number((0.27 * cartItemsPriceTotal).toFixed(0));
    cart.totalPrice = Number(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(0);

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;
    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
        }
    }, [history, success])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }));

    }
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            {message && <Message variant='danger'>{message}</Message>}
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {' '} {cart.shippingAddress.postalCode},{' '}  {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.lenght === 0 ? <Message>Your cart is empty</Message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => {
                                        return (
                                            <ListGroup.Item key={item.product}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded></Image>
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x <ProductPrice price={item.price}></ProductPrice> = <ProductPrice price={item.qty * item.price}></ProductPrice>
                                                    </Col>

                                                </Row>
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col><ProductPrice price={cart.itemsPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col><ProductPrice price={cart.shippingPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col><ProductPrice price={cart.taxPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col><ProductPrice price={cart.totalPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            {error && (
                                <ListGroupItem>
                                    <Message variant='danger'>{error}</Message>
                                </ListGroupItem>)}
                            <ListGroup.Item>
                                <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>PLACE ORDER</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen
