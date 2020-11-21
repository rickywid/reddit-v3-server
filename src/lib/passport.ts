import passport from 'passport';
import db from './db';
const GoogleStrategy = require('passport-google-oauth2').Strategy;

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
