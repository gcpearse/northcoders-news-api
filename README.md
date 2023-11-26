# Northcoders News API

## Overview

The Northcoders News API is a fully functional API using Node.js to interact with a PostgreSQL database.

It mimics a real-world forum or news website on which users are able to interact with articles, leave comments, vote, and explore a range of topics.

The hosted version of the API can be accessed [here](https://northcoders-news-api-twr1.onrender.com/api).

The API is hosted with a free plan and spins down with inactivity, so please allow some time for it to load.

Before viewing the page, you may wish to install a browser extension to format JSON.

## Local Setup Instructions

### Prerequisites

Please ensure you have the following installed on your local machine:

| Requirement | Minimum Version |
| --- | --- |
| Node.js | v20.6.0 |
| PostgreSQL | 14.10 |

### Cloning the Repository

Begin by clicking on the **CODE** button above and copying the URL. Then, navigate to the directory into which you would like to clone the repository, and run this command:

```
git clone <URL>
```

To push changes from your cloned local version to a personal repository on GitHub, you will first need to create a new GitHub repository. 

Initialise the repository <u>without</u> a `README`, `gitignore`, or `licence`.

Then, copy the URL of your new repository and run the following commands:

```
git remote set-url origin <NEW_URL>
git branch -M main
git push -u origin main
```

### Environment Variables

Once you have cloned the repository, open the project locally and create two .env files in the root directory:

`.env.test`\
`.env.development`

In each file, please add `PGDATABASE=` followed by the required database name for that environment. The relevant database names can be found in `/db/setup.sql`.

It is essential to do this in order to protect your databases. The .gitignore file already includes a line to prevent your own `.env` files from being included when you make a commit.

If you would like to host your own project, you will also need a `.env.production` file, to which you should add `DATABASE_URL=` followed by the URL of your server instance.

A server instance can be created quickly and easily on ElephantSQL: https://www.elephantsql.com. The URL can be found on the Details page of your instance.

### NPM Packages

At this point, you will need to run this command:

```
npm install
```

This will install the requisite NPM packages on your local machine.

### Preparing the Local Database

To set up and seed your local database, run the following commands:

```
npm run setup-dbs
npm run seed
```



### Testing

The full test suite can now be run with any of the following commands:

```
npm run test
npm test
npm t
```
