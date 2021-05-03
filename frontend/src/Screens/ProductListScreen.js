import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import ProductPrice from '../Components/ProductPrice'
import { createProduct, deleteProduct, listProducts } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constans/productConstans'
import Paginate from '../Components/Paginate'


const ProductListScreen = ({ history, match }) => {
    const pageNumber = match.params.pagenumer || 1;
    const dispatch = useDispatch();
    //for delete message
    const [messageDelete, setMessageDelete] = useState(null);

    const productList = useSelector(state => state.productList);
    const { loading, error, products, page, pages } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });
        if (!userInfo.isAdmin) {
            history.push('/login')
        }
        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts('', pageNumber));
        }
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

    const createProductsHandler = () => {
        dispatch(createProduct());
    }
    const deleteHandler = (product) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(product));
        }
    };
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductsHandler}>
                        <i className='fas fa-plus mr-2'></i>Create Product</Button>
                </Col>
            </Row>

            {loadingDelete && <Loader></Loader>}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader></Loader>}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? <Loader></Loader> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>In Stock</th>
                                <th>Modify Or Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td><ProductPrice price={product.price}></ProductPrice></td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.countInStock}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='secondary' className='btn-sm'>
                                                <i className='fas fa-edit mr-1'></i><span className='button-text'>Modify</span>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm ml-1' onClick={() => deleteHandler(product._id)}>
                                            <i className='fas fa-trash mr-1'></i><span className='button-text'>Delete</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true}></Paginate>
                </>
            )}
        </>
    )
}

export default ProductListScreen
