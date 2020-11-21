# FAQ

### 'connect-pg-simple failed to prune sessions' Error
1. Install connect-pg-simple
`npm install connect-pg-simple`

2. Create sessions table
`psql mydatabase < node_modules/connect-pg-simple/table.sql`


### PassportJS deserializeUser function not being called
Make sure to include credentials in fetch request

# Login Flow
1. user logs in via oauth (gmail, fb, twitter, gh)
2. after successful login, get authenticated user data 

### POST/PUT DATA
ensure to include 'Content-type': 'application/json' inside headers

### Failed to prune sessions: connect ECONNREFUSED 127.0.0.1:5432
start postgres service `sudo systemctl start postgresql-12`