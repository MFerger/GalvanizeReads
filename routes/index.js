var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  var obj = {};
  knex('books').then(function(booksInfo){
    obj.booksInfo = booksInfo
  res.render('books', {result: booksInfo});
  })
});

router.get('/authors', function(req, res, next) {
  var obj = {};
  knex('authors').then(function(authorInfo){
    obj.authorInfo = authorInfo;
  res.render('authors', {result: authorInfo});
  })
});

router.get('/authors/:id/edit', function(req, res, next) {
  knex('authors').where({id: req.params.id}).
  res.render('authorEdit');
});

router.get('/authors/:id', function(req, res, next) {
  return knex('authors')
    .where('authors.id', req.params.id)
    .then(function(author){
      return knex('authors_books')
      .where('author_id', req.params.id)
      .pluck('book_id')
      .then(function(bookId){
        return knex('books')
        .whereIn('books.id', bookId)
        .then(function(titles){
          console.log(titles);
        res.render('authorSingle', {result: author[0], books: titles});
      })
    })
  })
});
router.get('/books/:id', function(req, res, next) {
  return knex('books')
    .where('id', req.params.id)
    .then(function(book){
      return knex('authors_books')
      .where('book_id', req.params.id)
      .pluck('author_id')
      .then(function(authorId){
        return knex('authors')
        .whereIn('authors.id', authorId)
        .select('authors.first_name', 'authors.last_name')
        .then(function(author){
        console.log(author);
        res.render('bookSingle', {result: book[0], authors: author});
      })
    })
  })
});

router.get('/authors/new', function(req, res, next) {
  res.render('authorNew');
});
router.get('/books/edit', function(req, res, next) {
  res.render('bookEdit');
});
router.get('/books/new', function(req, res, next) {
  res.render('bookNew');
});
router.get('/authors/delete', function(req, res, next) {
  res.render('authorDelete');
});
router.get('/books/delete', function(req, res, next) {
  res.render('bookDelete');
});
module.exports = router;
