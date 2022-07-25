# Nexus API

This is the Nexus API for the Minimum Viable Product. In this proof of concept, we will be using an Express.js with a CockroachDB database supported with a Redis in-memory data cache.

Nexus is a gamified agile methodology for software development focused on employee satisfaction and avoiding burnout syndrome. Each employee is represented with a character.

### Project configuration

You will need a CockroachDB serverless cluster. You can create a free cluster at https://www.cockroachlabs.com/get-started-cockroachdb/. You will need to get the `connection string` and put it in the dotenv file as DATABASE_URL.

### Useful commands

To run this repository, first install the required packages:

```
$ npm install
```

To run database migrations, first you need a sql connection string, then run:

```
$ npx prisma migrate dev
```

And to run the server:

```
$ node index.js
```

Alternatively, if you have **nodemon** installed globally for automatic refreshing of the server when changes are made:

```
$ nodemon index.js
```

You can install nodemon with:

```
$ npm install -g nodemon
```
