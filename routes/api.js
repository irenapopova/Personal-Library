const express = require('express');
const router = express.Router();
const expect = require('chai').expect;

const bookController = require('../controller/bookController');
const validate = require('../util/validation');

router.route('/books')
    .get(bookController.getBooks)
    .post(validate.title(), bookController.addBook)
    .delete(bookController.deleteBooks);

router.route('/books/:id')
    .get(validate.id(), bookController.getBook)
    .post(validate.id(), validate.comment(), bookController.addComment)
    .delete(validate.id(), bookController.deleteBook);

module.exports = router;