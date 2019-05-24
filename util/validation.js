module.exports = {
    title: () => {
        return (req, res, next) => {
          if(req.body.title === undefined)
            return res.status(400).json({error: 'Book Title is required'});

          if(req.body.title.trim() === '')
            return res.status(400).json({error: 'Book Title is required'});
          //if no error
          next();
        }
    },

    id: () => {
        return (req, res, next) => {
            let id = req.params.id;

            if (id === undefined) // No Id
                return res.status(400).json({error: 'Id missing'});  
            if (!id.match(/^[0-9a-fA-F]{24}$/))  // Not a valid ObjectId
                return res.status(400).json({error: 'Not a valid Id'});  
            else    
                next();
        }
    },
  
    comment: () => {
        return (req, res, next) => {
          if(req.body.comment !== undefined && req.body.comment.trim() === '')
            return res.status(400).json({error: 'Comment cannot be empty'});
          //if no error
          next();
        }
    },
}