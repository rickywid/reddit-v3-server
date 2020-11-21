import express from 'express';
import session from 'express-session';
import { Pool } from 'pg';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import googleAuthRouter from './routes/auth/google/google-auth';
import googleAuthCallbackRouter from './routes/auth/google/callback';
import logoutRouter from './routes/auth/logout';
import userRouter from './routes/user';
import categoryRouter from './routes/category';
import subredditRouter from './routes/subreddit';

dotenv.config();

const pgSession = connectPgSimple(session);
const app = express();

// Parse JSON
app.use(express.json());

app.use(cors({
    origin: [
      'http://localhost:3000'
    ],
    credentials: true,
}));

app.use(session({
    store: new pgSession({
        pool : new Pool({
          user: process.env.DB_USER, 
          password: process.env.DB_PASS,
          host: '', 
          database: 'reddit-v3'
        })
      }),
    secret: 'asdfdsaf',
    cookie: { 
      secure: false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

/******************** */
/* ROUTES HANDLERS    */
/******************** */
app.use('/api/auth/google', googleAuthRouter);
app.use('/api/auth/google/callback', googleAuthCallbackRouter);
app.use('/api/auth/logout', logoutRouter);
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subreddit', subredditRouter);



app.listen(process.env.PORT || 5000, () => { 
    console.log(`App listening at ${process.env.DOMAIN}:${process.env.PORT}`)
});