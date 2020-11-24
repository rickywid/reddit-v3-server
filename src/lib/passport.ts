import passport from 'passport';
import db from './db';
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  const user = rows[0]
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: '383288527048-lu80q8n0d1jflckvqkol54qua53t1o1b.apps.googleusercontent.com',
  clientSecret: 'KVwRYZRY1CQugZZpoTOtfBS7',
  callbackURL: "http://localhost:5000/api/auth/google/callback"
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
  clientID: "089e70810933eaf9dcea",
  clientSecret: "1d16ba5307518b10f7f6ec725efc147f09120de8",
  callbackURL: "http://localhost:5000/api/auth/github/callback"
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    const { id, provider, photos, displayName, username } = profile;

    console.log(id, provider, photos, displayName, username);

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
  clientID: "402486327788817",
  clientSecret: "fadf36d3f84c0eff7ffc8c14ad7d289d",
  callbackURL: "http://localhost:5000/api/auth/facebook/callback"
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    console.log(profile);
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
  consumerKey: "YnJoDv65FLw4FjGKkMG5wGw4B",
  consumerSecret: "AkQkFRYvjMk2CZmgM8zJoV3lEjWy24fz9Ba3QhsP5FZVCQoOJx",
  callbackURL: "http://localhost:5000/api/auth/twitter/callback"
},
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    console.log(profile);
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