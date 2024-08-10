import express from 'express';
import { createLab, deleteLab, updateLab, getLab, getLabs } from '../controllers/lab.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken, createLab);
router.delete('/delete/:id', verifyToken, deleteLab);
router.post('/update/:id', verifyToken, updateLab);
router.get('/get/:id', getLab);
router.get('/get', getLabs);

export default router;
