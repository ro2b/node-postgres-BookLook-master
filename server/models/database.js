const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:hybrid@localhost:5432/BookLook';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, author VARCHAR(255),title VARCHAR(255),description VARCHAR(1024),date_acquired DATE,date_sold DATE,original_price NUMERIC(19,2), sold_price NUMERIC(19,2),date_removed DATE, status VARCHAR(40), isbn VARCHAR(40), barcode INTEGER, genre VARCHAR(40), keywords VARCHAR(255), comments VARCHAR(1024), complete BOOLEAN)');
query.on('end', () => { client.end(); });
