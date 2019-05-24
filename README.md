**FreeCodeCamp**- Information Security and Quality Assurance
------

Project Personal Library

User stories

1) ADD YOUR MongoDB connection string to .env without quotes as db
    `example: DB=mongodb://admin:pass@1234.mlab.com:1234/fccpersonallib`
2) SET NODE_ENV to `test` without quotes
3) All routes to be created within `routes/api.js`
4) Add any security features to `server.js`
5) Create all of the functional tests in `tests/2_functional-tests.js`
6) Nothing from the website will be cached in the client as a security measure. 7) Site powered by 'PHP 4.2.0' is seen, even though it isn't, as a security measure.
8) **post** a `title` to /api/books to add a book and returned will be the object with the `title` and a unique `_id`.
9) **get** /api/books to retrieve an array of all books containing `title`, `_id`, & `commentcount`.
10) **get** /api/books/{_id} to retrieve a single object of a book containing `title`, `_id`, & an array of `comments` (empty array if no comments present). 11) **post** a `comment` to /api/books/{_id} to add a comment to a book and returned will be the books object similar to **get** /api/books/{_id}.
12) **delete** /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.
13) If a book is requested that doesn't exist, a 'no book exists' message will be displayed.
14) **delete** request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
15) All 6 functional tests required are complete and passing.

![alt text](https://cdn.gomix.com/d7932c52-287f-4dae-b175-631fef453000%2FScreen%20Shot%202016-12-16%20at%201.35.56%20AM.png "")

[Front End](https://sunset-account.glitch.me/)
