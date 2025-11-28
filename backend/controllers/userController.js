import asyncHandler from 'express-async-handler';

import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

//@desc Auth user/set token
//route POST /api/users/auth
//@access Public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPasswords(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
});

//@desc Get User Profile
//route GET /api/users/profile
//@access Private - needs valid JSON web token
const getUserProfile = asyncHandler(async (req, res) => {
    console.log(req.user);
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    };

    res.status(200).json(user);
});

//@desc Log out User
//route POST /api/users/logout
//@access Public
const logOutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'User Logged Out' });
});

//@desc Register a new user
//route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

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
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error('Invalid User Data');
    }
});

//@desc Update User profile
//route PUT /api/user/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.password) user.password = req.body.password;
        console.log(req.body.email);
        const verifyEmail = req.body.email || user.email;
        const userExists = await User.findOne({ email: verifyEmail });
        console.log({ verifyEmail, userExists });
        if (userExists) {
            res.status(400);
            throw new Error('A user with that email already exists');
        } else {
            user.email = verifyEmail;
        }

        const updatedUser = await user.save();
        //sends back info without password 
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'Updated User profile' });
});

export {
    authUser,
    getUserProfile,
    logOutUser,
    registerUser,
    updateUserProfile
}