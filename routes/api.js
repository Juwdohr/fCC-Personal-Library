/*
*
*
*       Complete the API routing below
*       Test Book _id: 5c24e2ab3249e702e96a5df5
*       
*       
*/

'use strict';

const assert = require('chai').assert;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {});

module.exports = (app) => {

  app.route('/api/books')
    .get((req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        assert.equal(null, err, 'database connection error')
        db.collection('books').find().toArray((err, results) =>{
          assert.equal(null, err, 'database find error');
          
          res.json(results.map((book) => {
            book.commentcount = book.comments.length;
            delete book.comments
            return book;
          }));
        })
      });
    })
    
    .post((req, res) => {
      const title = req.body.title;
      //response will contain new book object including atleast _id and title
    
      if(!title) {
        res.send('missing title');
      } else {
        MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
          assert.equal(null, err, 'database connection error');
          const doc = { title: title, comments: [] }
          
          db.collection('books').insert(doc, {w: 1}, (err, result) => {
            assert.equal(null, err, 'database insert error');
            res.json(result.ops[0]);
          })
        });
      }
      
    })
    
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        assert.equal(null, err, 'database connection error');
        
        db.collection('books').deleteMany({}, (err, result) => {
          assert.equal(null, err, 'collection deleteMany error');
          
          res.send('complete delete successful');
        });
      });
    });
  
  app.route('/api/books/:id')
    .get((req, res) => {
      const bookid = ObjectId(req.params.id);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        assert.equal(null, err, 'database connection error');
        
        db.collection('books').find({_id: bookid}).toArray((err, result) => {
          assert.equal(null, err, 'collection find error');
          
          if(result.length === 0){
            res.send('no book exists');
          } else {
            res.json(result[0]);
          }
        });
      });      
    })
  
    .post((req, res) => {
      const bookid = ObjectId(req.params.id);
      const comment = req.body.comment;
      //json res format same as .get
      console.log(bookid, comment);
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        assert.equal(null, err, 'database connection error');
        
        db.collection('books').findOneAndUpdate(
          { _id: bookid },
          { $push: { comments: comment} },
          { returnOriginal: false, upsert: false },
          (err, result) => {
            assert.equal(null, err, 'database findAndUpdate error');
            res.json(result.value);
          }
        )
      });
    
    })
  
    .delete((req, res) => {
      const bookid = ObjectId(req.params.id);
      //if successful response will be 'delete successful'
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        assert.equal(null, err, 'database connection error');
        
        db.collection('books').findOneAndDelete({ _id: bookid }, (err, result) => {
          assert.equal(null, err, 'database findOneAndDelete error');
          
          res.send('delete successful')
        });
      });
    });
};
