import express, { Request, Response, NextFunction } from 'express';

const isAuth = (req:Request, res:Response, next:NextFunction) => {
    if(req.user) { return next() };
    res.status(401).send({msg: 'Unauthorized', status: 401, authenticated: false})
}

export default isAuth;