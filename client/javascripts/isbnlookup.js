var isbn = require('node-isbn');
isbn.resolve('0735619670', function (err, book) {
    if (err) {
        console.log('Book not found', err);
    } else {
        console.log('Book found %j', book);
    }
});
