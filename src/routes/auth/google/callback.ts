import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import '../../../lib/passport';

const router = express.Router();

router.get('/', passport.authenticate('google'), function (req:Request, res:Response, next:NextFunction) {
    if(req.user) {
        res.redirect(`${process.env.CLIENT}/redirect?id=${req.user.id}`);
    }
    
});


export default router;