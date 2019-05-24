const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the db
let BookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String]}
});

//* Model for the schema
let Book = mongoose.model('Book', BookSchema);

// make this available to the users in our Node applications
module.exports = Book;