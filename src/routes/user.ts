import express  from 'express';
import isAuth from '../middleware/isAuth';
import UserController from '../controllers/userController';

const router = express.Router();

router.get('/:id', isAuth, UserController.getUser);

export default router;
