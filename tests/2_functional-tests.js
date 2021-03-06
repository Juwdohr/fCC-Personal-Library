/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('Routing tests', () => {
    
    let testid;
    
    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Test Book'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'res is not an Object');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, 'comments', 'Book should contain comments');
        
            testid = res.body._id;
            assert.equal(res.body.title, 'Test Book');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books',  (done) => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Response should be an array');
            assert.property(res.body[0], '_id', 'Books should contain _id');
            assert.property(res.body[0], 'title', 'Books should contain title');
            assert.property(res.body[0], 'commentcount', 'Books should contain commentcount');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai.request(server)
          .get('/api/books/123456789123')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .get('/api/books/' + testid)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            
            assert.equal(res.body._id, testid);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
          .post('/api/books/' + testid)
          .send({comment: 'Test Comment'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.include(res.body.comments, 'Test Comment', 'Comments should include test comment, submitted');
            done();
          });
      });
      
    });

  });

});
