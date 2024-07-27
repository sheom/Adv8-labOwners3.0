import express from 'express';
import { deleteUser, test, updateUser,  getUserListings, getUserBookings, getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/bookings/:id', verifyToken, getUserBookings)
router.get('/:id', verifyToken, getUser)

export default router;