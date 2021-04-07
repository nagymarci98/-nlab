import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import FormContainer from '../Components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../Components/CheckoutSteps'


const PaymentScreen = ({ history }) => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    let paymentMethodState = cart['paymentMethod'];

    if (!shippingAddress) {
        history.push('/shipping');
    }

    if (Object.keys(paymentMethodState).length === 0) {
        paymentMethodState = 'PayPal';
    }
    const [paymentMethod, setPaymentMethod] = useState(paymentMethodState);
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder');
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>
                        Select Method
                    </Form.Label>
                    <Col>
                        <Form.Check type='radio' label='PayPal or Credit Card' id='PayPal' name='paymentMethod' value='PayPal' checked={paymentMethod === 'PayPal' ? true : false} onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                        <Form.Check type='radio' label='Cash' id='Cash' name='paymentMethod' value='Cash' checked={paymentMethod === 'Cash' ? true : false} onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
