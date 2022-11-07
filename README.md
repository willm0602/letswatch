# Let's Watch

## How To Setup

### Get the repository on your computer

Start by [forking](https://docs.github.com/en/get-started/quickstart/fork-a-repo) This repository. Then, download your fork of the repository and run the remaining steps

### Setup the API

in the root folder, run npm install. This should install any dependencies. If you are missing any ping Will (note: most of the time, if it says you're missing a dependency, it can be resolved by doing `npm install package`). Following this, you will need to make a .env file in the root directory. It should have a template as follows:

APP_ENV=local

APP_PORT=6262

APP_DOMAIN=localhost

JWT_KEY=GqqRpRmu9_yxo_sEIxVNYLedFXLw3zf_G_zbMIl9VMc1234

DB_HOST=localhost

DB_PORT=PORT

DB_USER=DBUSERNAME

DB_PASS=DBPASSWORD

DB_DATABASE=letswatch

TMDB=TMDBAPIKEY

you will want to update the following values based on your computer (except TMDB which you should get from the discord channel)

-   DB_PORT
-   DB_USER
-   DB_PASS

### Setup the database

There will be a number of .sql files inside /dbsetup. Run each of them in sequential order after running `CREATE DATABASE letswatch;`

### Setup the frontend

Go into the frontend and run `npm install`.

## How to run the API and Frontend

To run both the api and the frontend simultaneously, go into the root directory and run `npm run dev`.

To run the frontend server on its own, go into the root directory and run `npm run frontend`.

To run the API server on its own, go into the root directory and run `npm run api`.

## How to make changes to the codebase

### Make a new branch

When you want to make a new change, go into your main branch and run `git checkout -b [branch-name]`.

### Submit changes

When you are ready to submit the changes, run `git add .`, `git commit -m "message saying what was changed` and `git push origin [branch-name]`. Then go to github and make a pull request and ping will.

### Update local codebase

Checkout into your main branch by running `git checkout main` then run `git pull `. If there is a merge conflict with an existing branch, you can resolve it by running `git rebase main`.
