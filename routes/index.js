var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/books', function(req, res, next) {
  res.render('books');
});
router.get('/authors', function(req, res, next) {
  res.render('authors');
});
router.get('/authors/edit', function(req, res, next) {
  res.render('authorEdit');
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
