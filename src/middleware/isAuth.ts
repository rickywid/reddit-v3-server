import express, { Request, Response, NextFunction } from 'express';

const isAuth = (req:Request, res:Response, next:NextFunction) => {
    if(req.user) { return next() };
    res.send({msg: 'Unauthorized'})
}

export default isAuth;