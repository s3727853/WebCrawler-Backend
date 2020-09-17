# RedBack Crawler API server

The API server is the middle layer between the public website/CMS and the database, controlling
access to data, third-party APIs and managing authentication.

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
FRONTEND_URL="https://redback-crawler.herokuapp.com/"
LH_URL="http://localhost:8080"
```

Please log into Herku and go to settings and reveal "config vars" to find the correct values to fill out the empty entries above.

## Development

Please note this is currently running on port 3001 in development mode and when accessing API routes you will need to reflect this.

### Local

Start an Express server that watches for file changes in `src/` or `.env` and redeploys:

```sh
npm run start:dev
```

## Production

### Local

```sh
npm run start:prod
```

