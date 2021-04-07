import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import ProductPrice from '../Components/ProductPrice'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { removeFromCart } from '../actions/cartActions'
import { PayPalButton } from 'react-paypal-button-v2'
import axios from 'axios'
import { ORDER_PAY_RESET } from '../constans/orderConstans'

const OrderScreen = ({ match }) => {
    const orderId = match.params.id;
    const [sdkReady, setSdkReady] = useState(false);
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const cart = useSelector(state => state.cart);

    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;
    if (!loading) {
        const orderItemsPriceTotal = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        order.itemsPrice = orderItemsPriceTotal * 0.73;
    }


    useEffect(() => {
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=HUF`;
            script.onload = () => {
                setSdkReady(true);
            }
            document.body.appendChild(script);
        }

        if (!order || order._id !== orderId || successPay) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypay) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, orderId, order, successPay])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
        cart.cartItems.forEach(element => {
            dispatch(removeFromCart(element.product));
        });
    }

    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
        <>
            <h1>Order {order._id}</h1>
            <h2>Test paypal  <strong>email:</strong> nagymarci@nagycode.com <strong>pw:</strong> {'en7<3kW>'}</h2>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p>
                                <strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {' '} {order.shippingAddress.postalCode},{' '}  {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? <Message variant='success'>Paid on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.lenght === 0 ? <Message>Order is empty</Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => {
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
                            )}
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
                                    <Col><ProductPrice price={order.itemsPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col><ProductPrice price={order.shippingPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col><ProductPrice price={order.taxPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col><ProductPrice price={order.totalPrice}></ProductPrice></Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && order.paymentMethod === 'PayPal' ? (
                                <ListGroup.Item>
                                    {loadingPay && <Loader></Loader>}
                                    {!sdkReady ? <Loader></Loader> : (
                                        <PayPalButton amount={order.totalPrice} currency="HUF"
                                            onSuccess={successPaymentHandler} />
                                    )}
                                </ListGroup.Item>
                            ) : ""}
                        </ListGroup>
                    </Card>
                </Col>
            </Row >
        </>
}

export default OrderScreen
