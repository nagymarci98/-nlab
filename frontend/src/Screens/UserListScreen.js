import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { deleteUser, listUsers } from '../actions/userActions'


const UserListScreen = ({ history }) => {
    const dispatch = useDispatch();

    //for delete message
    const [messageDelete, setMessageDelete] = useState(null);

    const userList = useSelector(state => state.userList);
    const { loading, error, users } = userList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector(state => state.userDelete);
    const { success: successDelete, error: errorDelete } = userDelete;

    const sortUsers = (users) => {
        users.sort((user1, user2) => {
            if (user1.isAdmin < user2.isAdmin) {
                return 1;
            }
            if (user1.isAdmin > user2.isAdmin) {
                return -1;
            }
            return 0;
        })
    }
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
            if (users) {
                sortUsers(users);
            }
        }
        else {
            console.log(userInfo)
            history.push('/login')
        }
    }, [dispatch, history, userInfo, successDelete])

    const deleteHandler = (user) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(user._id));
        }
    };
    return (
        <>
            <h1>Users</h1>
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {messageDelete && <Message variant='success'>{messageDelete}</Message>}
            {loading ? <Loader></Loader> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>E-mail</th>
                            <th>Is Admin</th>
                            <th>Edit or Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>{user.isAdmin ? (<i className='fas fa-check' style={{ color: 'green' }}></i>) : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='secondary' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen
