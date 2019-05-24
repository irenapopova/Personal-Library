const getDb = require('../util/db').getDb;
const Book = require('../models/book');

module.exports = {
    addBook: async (req, res, next) => {
      try {
          let { title } = req.body;
          //check for duplicate title (case insensitive)
          let duplicate = await Book.findOne({'title': { $regex : new RegExp('^' + title + '$', "i") } });
          if (duplicate)
              res.status(409).json({error: 'Duplicate Title, this book already exists'});
          //save book
          else {
              let book = new Book({title: title.trim(), comments: []});
              let data = await book.save();
              res.status(201).json({'title': data.title, '_id': data._id}); 
          }
      } catch(err) {
          next(err);
      }
    },

    getBook: async (req, res, next) => {
        try {
            let data = await Book.findById(req.params.id);
            if (!data)
              res.status(404).json({error: 'No book exists with this id'});
            else
              res.status(200).json(data);
        } catch(err)  {
            next(err);
        }
    },

    deleteBook: async (req, res, next) => {
        try {
            let data = await Book.findByIdAndDelete(req.params.id);
            if (!data)
              res.status(404).json({error: 'Book Id ' + req.params.id + ' does not exist'});
            else
              res.status(201).json({success: 'Book Id ' + req.params.id + ' deleted successfully'});
        } catch(err) {
            next(err);
        }
    },
  
    addComment: async (req, res, next) => {
        try {
            let bookid = req.params.id;
            let { comment } = req.body;
      
            let data = await Book.findByIdAndUpdate(bookid , { $push: { comments: comment.trim() } }, { new: true })
            res.status(200).json(data);
        } catch(err) {
            next(err);
        }
    },

    getBooks: async (req, res, next) => {
      try {
          let data = await Book.aggregate()
                              .project({
                                title: 1,
                                _id: 1,
                                commentcount: {$size: '$comments'}
                              })
                              .sort('title');
          res.status(200).json(data);
      } catch(err){
          next(err);
      }
    },

    deleteBooks: async (req, res, next) => {
      try {
            await Book.deleteMany({});
            res.status(201).json({success: 'All books deleted successfully'});
      } catch(err){
          next(err);
      }
    }
}