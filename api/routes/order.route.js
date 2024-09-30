import express from 'express';
import { createOrder, deleteOrder, updateOrder, getOrder, getOrders } from '../controllers/order.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken, createOrder);
router.delete('/delete/:id', verifyToken, deleteOrder);
router.post('/update/:id', verifyToken, updateOrder);
router.get('/get/:id',verifyToken, getOrder);
//router.get('/get',verifyToken, getOrders);

export default router;