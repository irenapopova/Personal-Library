/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        if (res.body.length > 1) {
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
        }
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let id = '';
    let commentLength = 0;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
       chai.request(server)
        .post('/api/books')
        .send({title: 'New Title'})
        .end(function(err, res){
          assert.equal(res.status, 201);
          assert.equal(res.body.title, 'New Title');
          assert.property(res.body, '_id');
          id = res.body._id;
          done();
       });
      });
      
      test('Test POST /api/books with no title given', function(done) {
       chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Book Title is required');
          done();
        });
      });
      
      test('Test POST /api/books with duplicate title', function(done) {
       chai.request(server)
        .post('/api/books')
        .send({title: 'New Title'})
        .end(function(err, res){
          assert.equal(res.status, 409);
          assert.equal(res.body.error, 'Duplicate Title, this book already exists');
          done();
       });
      });

    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
       chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          if (res.body.length > 1) {
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
          }
          done();
         });      
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
         .get('/api/books/' + '5c44d8b3d45c6035742edfe2')
         .end(function(err, res) {
            assert.equal(res.status, 404)
            assert.equal(res.body.error, 'No book exists with this id');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
         .get('/api/books/' + id)
         .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, 'New Title');
            assert.isArray(res.body.comments, 'comments should be an array');
            commentLength = res.body.comments.length;
            done();
          });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
       chai.request(server)
          .post('/api/books/' + id)
          .send({ comment: 'A Comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, 'New Title');
            assert.isArray(res.body.comments, 'comments should be an array');
            let n = res.body.comments.length;
            assert.equal(res.body.comments[n-1], 'A Comment');
            assert.equal(res.body.comments.length, commentLength + 1);
            done();
          });
      });  
    });

    suite('DELETE /api/books with id', function() {
      
      test('Test DELETE /api/books with id not in db', function(done) {
        chai.request(server)
          .delete('/api/books/' + '5c44d8b3d45c6035742edfe2')
          .end(function(err, res) {
            assert.equal(res.status, 404);
            assert.equal(res.body.error, 'Book Id 5c44d8b3d45c6035742edfe2 does not exist');
            done();
          });
      });
      
      test('Test DELETE /api/books with id in db', function(done) {
        chai.request(server)
          .delete('/api/books/' + id)
          .end(function(err, res) {
            assert.equal(res.status, 201);
            assert.equal(res.body.success, 'Book Id ' + id + ' deleted successfully');
            done();
          });
      });
    });

  });

});
