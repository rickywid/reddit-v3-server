import express from 'express';
import isAuth from '../middleware/isAuth';
import CategoryController from '../controllers/categoryController';

const router = express.Router();

router.post('/', isAuth, CategoryController.createCategory);
router.put('/', isAuth, CategoryController.updateCategory);
router.put('/rename', isAuth, CategoryController.renameCategory);
router.put('/delete', isAuth, CategoryController.deleteCategory);

export default router;