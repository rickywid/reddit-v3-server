import passport from 'passport';
import db from './db';
import dotenv from 'dotenv';

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;


// Not sure why I have to include this when it's already included in app.ts file
dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  const user = rows[0]
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.SERVER}/api/auth/google/callback`
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {

    const { rows } = await db.query('SELECT * FROM users WHERE oauth_id = $1', [profile.id]);

    // User not found - Create user
    if (!rows.length) {
      const username = profile.email.split('@')[0];
      const { rows } = await db.query(`
        INSERT INTO users (provider, oauth_id, email, picture, display_name, username)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `, [profile.provider, profile.id, profile.email, profile.picture, profile.displayName, username]);

      const user = rows[0]

      console.log('User created: ', user.username)

      await db.query(`
        INSERT INTO categories (category_name, subreddits, user_id)
        VALUES ($1, $2, $3);
      `, ['uncategorized', [], user.id])

      console.log('Category created for ', user.username);

      done(null, user)
    }

    // TODO: User Sign In
    const user = rows[0];
    done(null, user);
  }
));


passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: `${process.env.SERVER}/api/auth/github/callback`
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    const { id, provider, photos, displayName, username } = profile;

    const { rows } = await db.query('SELECT * FROM users WHERE oauth_id = $1', [profile.id]);

    // User not found - Create user
    if (!rows.length) {

      const { rows } = await db.query(`
        INSERT INTO users (provider, oauth_id, picture, display_name, username)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
      `, [provider, id, photos[0].value, displayName, username]);

      const user = rows[0]

      console.log('User created: ', username)

      await db.query(`
        INSERT INTO categories (category_name, subreddits, user_id)
        VALUES ($1, $2, $3);
      `, ['uncategorized', [], user.id])

      console.log('Category created for ', user.username);

      done(null, user)
    }
    const user = rows[0];
    done(null, user);
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.SERVER}/api/auth/facebook/callback`
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    const { id, displayName } = profile;

    const { rows } = await db.query('SELECT * FROM users WHERE oauth_id = $1', [profile.id]);

    // User not found - Create user
    if (!rows.length) {

      const { rows } = await db.query(`
      INSERT INTO users (provider, oauth_id, display_name)
      VALUES ($1, $2, $3) 
      RETURNING *;
    `, ['facebook', id, displayName]);

      const user = rows[0]

      console.log('User created: ', displayName);

      await db.query(`
      INSERT INTO categories (category_name, subreddits, user_id)
      VALUES ($1, $2, $3);
    `, ['uncategorized', [], user.id])

      console.log('Category created for ', user.displayName);

      done(null, user)
    }
    const user = rows[0];
    done(null, user);
  }
));


passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CLIENT,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: `${process.env.SERVER}/api/auth/twitter/callback`
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    const { id, provider, photos, displayName, username } = profile;
    const { rows } = await db.query('SELECT * FROM users WHERE oauth_id = $1', [profile.id]);

    // User not found - Create user
    if (!rows.length) {

      const { rows } = await db.query(`
      INSERT INTO users (provider, oauth_id, picture, display_name, username)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `, [provider, id, photos[0], displayName, username]);

      const user = rows[0]

      console.log('User created: ', displayName);

      await db.query(`
      INSERT INTO categories (category_name, subreddits, user_id)
      VALUES ($1, $2, $3);
    `, ['uncategorized', [], user.id])

      console.log('Category created for ', user.displayName);

      done(null, user)
    }
    const user = rows[0];
    done(null, user);
  }
));