## Installation

```bash
$ npm install

# need PostgreSQL and Redis installed and running on your machine
.env:
- DATABASE_URL: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
- SESSION_SECRET: <your_secret>
```

## Prisma

```bash
# to apply prisma schema
$ npx prisma db push
```

## Running the app

```bash


# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# API Documentation
## Base URL
http://localhost:3000

## Authentication
Using session-based authentication with Redis.

## Endpoints
1. ### GET /users/
    Returns list of users, taking into account the following:
    - administrator sees everyone
    - boss sees self and all subordinates (recursively)
    - regular user sees only herself

2. ### PATCH /users/change-boss
    Changes user\'s boss (only boss can do that and only for his/her subordinates)

3. ### POST /users/populate
    Creates test Users once 

4. ### POST /auth/register
    Create new user with 'username' and 'password' and default role 'User'

5. ### POST /auth/login
    User login with 'username' and 'password'

6. ### DELETE /auth/logout
    Logs out current user
