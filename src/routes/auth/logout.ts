import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get('/', function (req:Request, res:Response, next:NextFunction) {

    // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout
    // * ensure to pass 'credentials' in header in order to clear session

    req.session!.destroy((err:any) => {
        if(err) console.log(err);
        res.status(200).send({msg: 'successfully logged out'});
    })
});


export default router;