import express from 'express';
import productController from '../controllers/taskController.js';

const router = express.Router();

router.get('/', productController.getAllTasks);

router.post('/', productController.createTask);

export default router;
