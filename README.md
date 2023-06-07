## Installation

```bash
$ npm install

# need PostgreSQL and Redis installed and running on your machine
.env:
- DATABASE_URL: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
- SESSION_SECRET: <your_secret>
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

# API
```bash
'<server_url>/users/': Returns list of users, taking into account the following:
- administrator sees everyone
- boss sees self and all subordinates (recursively)
- regular user sees only herself

'<server_url>/users/change-boss': Changes user's boss (only boss can do that and only for his/her subordinates)

'<server_url>/users/populate': Creates test Users once 

'<server_url>/auth/register': Create new user with 'username' and 'password' and default role 'User'

'<server_url>/auth/login': User login with 'username' and 'password'

'<server_url>/auth/logout' Logs out current user
```
