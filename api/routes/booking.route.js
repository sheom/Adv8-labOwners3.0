import express from 'express';
import { createBooking, deleteBooking, updateBooking, getBooking, getBookings } from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createBooking);
router.delete('/delete/:id', verifyToken, deleteBooking);
router.post('/update/:id', verifyToken, updateBooking);
router.get('/get/:id', getBooking);
router.get('/get', getBookings);

export default router;
