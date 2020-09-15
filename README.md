# Orchard Pig API Server

The API server is the middle layer between the public website/CMS and the database, controlling
access to data, third-party APIs and managing authentication.

## `.env`

Copy `.env.example` to `.env` and fill in the required environment variable values.

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

## Development

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

