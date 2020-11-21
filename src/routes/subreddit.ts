import express from 'express';
import isAuth from '../middleware/isAuth';
import SubredditController from '../controllers/subredditController';

const router = express.Router();

router.put('/', isAuth, SubredditController.updateSubreddit);

export default router;