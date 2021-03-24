import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

//@desc     Auth user & get toket
//@route    POST /api/user/login
//@access   Public
const authUser = asyncHandler(async (req, res) => {
    const { email, pw } = req.body
    const user = await User.findOne({ email: email });
    if (user && (await user.matchPassword(pw))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(401);
        throw new Error('invalid email or password');
    }
});

//@desc     Register a new user
//@route    POST /api/user
//@access   Public
const regUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//@desc     Get user profile
//@route    GET /api/user/profile
//@access   Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//@desc     Update user profile
//@route    PUT /api/user/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
            /*
                        if (req.body.password === req.body.confirmPassword) {
                            user.password = req.body.password;
                        } else {
                            throw new Error('Passwords must match');
                        }*/
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    getUserProfile,
    regUser,
    updateUserProfile
};