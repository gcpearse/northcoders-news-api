# Northcoders News API

The Northcoders News API is a backend project using node-postgres to interact with a PostgreSQL database.

## Local Setup Instructions

### NPM Packages

Run the following command to install the necessary NPM packages on your local machine:

```
npm install
```

### Environment Variables

If you wish to clone this project and run it locally, you will need to create two .env files in the root directory:

**.env.test**\
**.env.development**

In each file, please add ```PGDATABASE=``` followed by the required database name for that environment. The relevant database names can be found in **/db/setup.sql**.
