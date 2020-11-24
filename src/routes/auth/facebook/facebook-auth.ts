import express, {Response, Request, NextFunction} from 'express';
const router = express.Router();
import passport from 'passport';
import '../../../lib/passport';

router.get('/', passport.authenticate('facebook'), (req:Request, res:Response, next:NextFunction) => {
	console.log('blah')
});


export default router;