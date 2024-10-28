# simple-crud-api
A simple CRUD API using an in-memory database.

Hello! The task requirements have been verified with tests, so you can save yourself some time :)

#### Working with the application

Install all dependencies:
```bash
npm i
```

Start the local development server:
```bash
npm run dev
```

The server will be available at http://127.0.0.1:4000/

Running tests:
```bash
npm run test
```
Running the production version:
```bash
npm run prod
```

## Details:

1. The task must be solved using only **pure Node.js**. Any libraries and packages (except `nodemon`, `eslint` and its plugins, `prettier` and its plugins, `uuid`, `webpack` and its plugins, testing tools, `dotenv`, `cross-env`) **are prohibited**.
2. API path `/user`:
    * **GET** `/user` or `/user/${userId}` should return all users or user with corresponding `userId`
    * **POST** `/user` is used to create record about new user and store it in database
    * **PUT** `/user/${userId}` is used to update record about existing user
    * **DELETE** `/user/${userId}` is used to delete record about existing user from database
3. users are stored as `objects` that have following properties:
    * `id` — unique identifier (`string`, `uuid`) generated on server side
    * `name` — user's name (`string`, **required**)
    * `age` — user's age (`number`, **required**)
    * `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
4. Requests to non-existing endpoints (e.g. `/some-non/existing/resource`) should be handled.
5. Internal server errors should be handled and processed correctly.
6. Value of port on which application is running should be stored in `.env` file.
7. There should be 2 modes of running application: **development** and **production**
8. There could be some tests for API.
