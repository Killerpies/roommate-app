# roommate-app
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

database username: userDatabase
database password: 123qwer456

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