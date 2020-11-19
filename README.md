# RedBack Crawler API server

The API server is the middle layer between the public website/CMS and the database, controlling
access to data, third-party APIs and managing authentication.

Assumed prerequisites: Node.js is installed on your environment along with the npm package manager 

## `.env`

Enviroment variables store passwords and senstive settings. They are therfore not included in the repo files (.gitignore has an entry)
and you will need to manually create the file when developing locally. The file should be named: .env

Example:

```sh
# .env
NODE_ENV=development
DB_NAME=""
DB_PASSWORD=""
DB_USERNAME=""
JWT_SECRET=""
JWT_EXPIRE_TIME=""
FRONTEND_URL="https://redback-crawler.herokuapp.com"
LH_URL="http://localhost:8080"
```

Please log into Heroku and go to settings and reveal "config vars" to find the correct values to fill out the empty entries above or see project report development guide.


## Development

Please note this is currently running on port 3001 in development mode (when you run it locally) and when accessing API routes you will need to reflect this.

## First time setup 

First time setup requires you to run the following command within the Crawldashians_backend folder to install all the node dependencies for the project. 

```sh
npm install 
```
 
After that has completed, to run the application use one of the below: 

### Local


```sh
npm run start:dev
```

## Production

### Local

```sh
npm run start:prod
```

