import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { listUserFavouriteProducts } from '../actions/userActions'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import Product from '../Components/Product'
import { USER_LIST_WISHLIST_RESET } from '../constans/userConstans'

const WishlistScreen = ({ history }) => {
    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userFavouriteProducts = useSelector(state => state.userFavouriteProducts);
    const { loading, error, favouriteProducts } = userFavouriteProducts;


    useEffect(() => {
        if (!userInfo.name) {
            history.push('/login');
        } else {
            dispatch({ type: USER_LIST_WISHLIST_RESET });
            dispatch(listUserFavouriteProducts());
        }
    }, [dispatch, userInfo]);
    return (
        <>
            {userInfo && (
                <>
                    <h2>{userInfo.name}'s Wishlist</h2>
                    {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : favouriteProducts.length != 0 && (
                        <Row>
                            {favouriteProducts.map(product => {
                                return (
                                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='my-3'>
                                        <Product product={product} />
                                    </Col>
                                )
                            })}
                        </Row>
                    )}
                </>
            )
            }
        </>
    )
}

export default WishlistScreen
