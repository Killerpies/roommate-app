# roommate-app
# Initial Setup
Download and install Node.js
-https://nodejs.org/en/download/

Download and install postgres
- https://www.postgresql.org/download/
- Set up postgres server with default values
    - Username: postgres, Password: postgres,
    - Port: 5432, Host: localhost

Set up tables in your postgres database (Ubuntu)
- open terminal
- sudo su postgres
- psql
- Go to database.sql in root of roommateapp directory
    - Copy everything from 'COPY START' to 'COPY END'
    - paste into postgres terminal, press enter
    - all tables should be created

Set up .env file
- in root of project, create a new file called '.env'
    - Enter in values for database like so: 
        PG_USER='postgres'
        PG_PASSWORD='postgres'
        PG_HOST='localhost'
        PG_PORT=5432
        PG_DATABASE='postgres' # (If you rename your database you will enter something different here)
    - These are your local variables so they will vary

Set up user login service
- Create an account with auth0
    - https://auth0.com/
    - Create a single page web app
        - add http://localhost:8081 to:
            - Callback urls
            - logout urls
            - allowed web origins
        - Get domain and client_id from web app
        - modify main.js under createAuth0
            - add your domain and client_id


Website should be ready to run locally
- CD into project directory run commands:
    npm install
        - install initial modules
    npm run startServers
        - This starts nodemon and vue local server
- find the browser at:
    http://localhost:8081




# Start Commands
Start Whole Local dev environment (proxy, api, dev server):
    npm run startServers

Run the api:
    Node server.js
Run the local dev server
    npm run serve

Start/Stop server:
service postgresql start/stop

Server Status:
service postgresql status

# heroku PSQL
connect to psql terminal
heroku pg:psql -a roommate-ap


# Postgresql Commands
PSQL Commands:
sudo su postgres
psql

list all database: \lu

list all users & roles: \du

connect to specific database: \c roommateapp || \c postgres0

list all tables in database: \dt

Login:
sudo -u - postgres psql
# Useful Videos
PERN DEPLOY TUTORIAL{
    https://www.youtube.com/c/TheStoicProgrammers/videos
    https://www.youtube.com/watch?v=ZJxUOOND5_A
    https://github.com/ousecTic/pern-deploy-tutorial
}

# Useful Links
https://devcenter.heroku.com/categories/heroku-redis
https://dba.stackexchange.com/questions/1285/how-do-i-list-all-databases-and-tables-using-psql
https://stackoverflow.com/questions/35942754/how-can-i-save-username-and-password-in-git
https://stackoverflow.com/questions/12720967/how-can-i-change-a-postgresql-user-password

https://stackoverflow.com/questions/66787109/how-to-use-a-postgres-db-on-heroku-with-axios-and-vue

# Heroku Project Links
https://roommate-ap.herokuapp.com/
https://dashboard.heroku.com/apps/roommate-ap
https://data.heroku.com/datastores/bd8b8bbb-8f34-44d9-ab7c-70106ffd55cc#

# Git Repository (Updating this Repository also builds to prod)
https://github.com/Killerpies/roommate-app

## Project setup
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).