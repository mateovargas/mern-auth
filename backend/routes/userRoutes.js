import express from 'express';

import {
    authUser,
    getUserProfile,
    logOutUser,
    registerUser,
    updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logOutUser);
//because they go to the same endpoint but with GET and PUT
//adds protect middleware to protect routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);


export default router;