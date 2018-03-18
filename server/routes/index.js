const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:hybrid@localhost:5432/BookLook';

router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'views', 'index.html'));
});

router.get('/api/v1/BookLooks', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id DESC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/lookupinventory', (req, res, next) => {
  const results = [];
  // Grab data from http request
  var mybarcode = req.body.barcode;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items WHERE barcode=($1)', [mybarcode]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//lookup isbn

router.post('/api/v1/lookupisbn', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {isbn: req.body.isbn};
  console.log("isbn is " + data["isbn"]);
  var isbn = require('node-isbn');
  isbn.resolve(data["isbn"], function (err, book) {
      if (err) {
          console.log('Book not found', err);
          return res.status(500).json({success: false, data: err});
      } else {
          console.log('Book found %j', book);
          return res.json(book);
      }
  });
});

router.post('/api/v1/BookLooks', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {author: req.body.author,title: req.body.title,description: req.body.description,date_acquired: req.body.date_acquired,date_sold: req.body.date_sold,original_price: req.body.original_price,sold_price: req.body.sold_price,date_removed: req.body.date_removed,status: req.body.status,isbn: req.body.isbn,barcode: req.body.barcode,genre: req.body.genre,keywords: req.body.keywords,comments: req.body.comments, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(author, title, description, date_acquired, date_sold, original_price, sold_price, date_removed, status, isbn, barcode, genre, keywords, comments, complete) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
    [data.author,data.title, data.description, data.date_acquired, data.date_sold, data.original_price, data.sold_price, data.date_removed, data.status, data.isbn, data.barcode, data.genre, data.keywords, data.comments, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id DESC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/updateBookLook', (req, res, next) => {
  const results = [];
  console.log("updating")
  // Grab data from the URL parameters
  //const id = req.params.BookLook_id;
  // Grab data from http request
  const data = {author: req.body.author,title: req.body.title,description: req.body.description,date_acquired: req.body.date_acquired,date_sold: req.body.date_sold,original_price: req.body.original_price,sold_price: req.body.sold_price,date_removed: req.body.date_removed,status: req.body.status,isbn: req.body.isbn, barcode: req.body.barcode,genre: req.body.genre,keywords: req.body.keywords,comments: req.body.comments, complete: false};
  console.log(data);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET author=($1), title=($2), description=($3), date_acquired=($4), date_sold=($5), original_price=($6), sold_price=($7), date_removed=($8), status=($9), isbn=($10), genre=($12), keywords=($13), comments=($14), complete=($15) WHERE barcode = ($11)',
    [data.author,data.title, data.description, data.date_acquired, data.date_sold, data.original_price, data.sold_price, data.date_removed, data.status, data.isbn, data.barcode, data.genre, data.keywords, data.comments, data.complete]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id DESC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.delete('/api/v1/BookLooks/:BookLook_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.BookLook_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id DESC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//this is all pasted in and broken!!

router.get('/api/v1/getdropdowndata/:mycategory', (req, res, next) => {
  const results = [];
  // Grab data from http request
  //mycategory = ["genre"];
  // Get a Postgres client from the connection pool
  const mycategory = req.params.mycategory;
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM lookups WHERE category=\''+mycategory+'\'');
    console.log(query);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});



module.exports = router;
