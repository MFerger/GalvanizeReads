var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  var arr = []
  return knex('books')
  .then(function(books){
    for(var i = 0; i< books.length; i++){
      arr.push({
        id: books[i].id,
        title: books[i].title,
        genre: books[i].genre,
        cover_url: books[i].cover_url,
        description: books[i].description,
        authors: []
      })
    }
    return knex('books')
    .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
    .innerJoin('authors', 'authors_books.author_id', 'authors.id')
    .select('authors.first_name', 'authors.last_name', 'authors_books.book_id')
  })
  .then(function(data){
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if(arr[i].id === data[j].book_id){
          arr[i].authors.push(data[j].first_name + ' ' + data[j].last_name)
        }
      }
    }
    console.log('arr *****************', arr)
    res.render('books', {
      blah: arr,
      author: arr
    })
  })
});

router.get('/books/new', function(req, res, next) {
  return knex('authors')
  .then(function(people){
    var arr = []
    for (var i = 0; i < people.length; i++) {
    arr.push({id: people[i].id, names: people[i].first_name+ ' ' + people[i].last_name})    }
res.render('bookNew', {authors: arr});
  })
});
router.post('/books/new', function(req,res,next){
  //not working as expected --
  // return knex('books')
  // .insert({
  //   title: req.body.title,
  //   genre: req.body.genre,
  //   description: req.body.description,
  //   cover_url: req.body.cover_url
  // }).then(function(){
    res.redirect('/books')
  // })
})

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
        console.log(book);
        res.render('bookSingle', {result: book[0], authors: author});
      })
    })
  })
});

router.get('/authors', function(req, res, next) {
  var arr = []
  return knex('authors')
  .then(function(authors){
    for(var i = 0; i< authors.length; i++){
      arr.push({
        id: authors[i].id,
        last_name: authors[i].last_name,
        first_name: authors[i].first_name,
        url: authors[i].portrait_url,
        biography: authors[i].biography,
        titles: []
      });
    }
    return knex('authors')
    .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
    .innerJoin('books', 'authors_books.book_id', 'books.id')
    .select('books.title', 'authors_books.author_id')
  })
  .then(function(data){
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if(arr[i].id == data[j].author_id){
          arr[i].titles.push(data[j].title)
        }
      }
    }
    res.render('authors', {authors: arr, books: arr})
  })
});

router.get('/authors/new', function(req,res,next){
  return knex('authors')
    .then(function(author){
      return knex('authors_books')
      .pluck('book_id')
      .then(function(bookId){
        return knex('books')
        .whereIn('books.id', bookId)
        .then(function(titles){
          console.log('*******************************',titles);
          var arr = [];
          for (var i = 0; i < titles.length; i++) {
              arr.push({title: titles[i].title, id: titles[i].id})
          }
          console.log('*************************',arr);
          knex('books')
          .pluck('title')
          .then(function(bookNames){
            res.render('authorNew', {result: author[0], books: arr, bookNames: bookNames});
          })
      })
    })
  })
});

router.get('/authors/:id/edit', function(req, res, next) {
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
          console.log('*******************************',titles);
          var arr = [];
          for (var i = 0; i < titles.length; i++) {
              arr.push({title: titles[i].title, id: titles[i].id})
          }
          console.log('*************************',arr);
          knex('books')
          .pluck('title')
          .then(function(bookNames){
            res.render('authorEdit', {result: author[0], books: arr, bookNames: bookNames});
          })
      })
    })
  })
});
router.get('/books/:id/edit', function(req,res,next){
  return knex('books')
    .where('id', req.params.id)
    .then(function(book){
      return knex('authors_books')
      .where('book_id', req.params.id)
      .pluck('author_id')
      .then(function(authorId){
        return knex('authors')
        .whereIn('authors.id', authorId)
        .then(function(titles){
          console.log('TITTLLLEEESSS*******************************',titles);
          var arr = [];
          for (var i = 0; i < titles.length; i++) {
              arr.push({first: titles[i].first_name, last: titles[i].last_name})
          }
          knex('authors')
          .select('first_name','last_name')
          .then(function(names){
            console.log('ARRRRRRR*************************',names);
            res.render('bookEdit', {result: book[0], books: arr, names: names});
          })
      })
    })
  })
});
router.get('/authors/:id', function(req, res, next) {
  return knex('authors')
    .where('id', req.params.id)
    .then(function(author){
      return knex('authors_books')
      .where('author_id', req.params.id)
      .pluck('book_id')
      .then(function(bookId){
        return knex('books')
        .whereIn('books.id', bookId)
        .then(function(titles){
          console.log(titles);
          console.log(author);
        res.render('authorSingle', {result: author[0], title: titles});
      })
    })
  })
});

router.get('/authors/:id/delete', function(req, res, next) {
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
        res.render('authorDelete', {result: author[0], books: titles});
      })
    })
  })
});
router.get('/books/:id/delete', function(req, res, next) {
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
        res.render('bookDelete', {result: book[0], authors: author});
      })
    })
  })
});

router.post('/books/:id/delete', function(req,res,next){
  knex('books').where('id', req.params.id)
  .del()
  .then(function(){
    res.redirect('/books')
  })
})
router.post('/authors/:id/edit', function(req,res, next){
  knex('authors')
  .where({id: req.params.id})
  .update({
    first_name: req.body.authorEditFirstName,
    last_name: req.body.authorEditLastName,
    biography: req.body.authorEditBiography,
    portrait_url: req.body.authorEditPortraitUrl
  })
    .then(function(){
      res.redirect('/authors')
    })
  })
  router.post('/books/:id/edit', function(req, res, next) {
  return knex('books')
    .where({
      id: req.params.id})
    .update({
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.cover_url
    }).then(function() {
      res.redirect('/books')
    })
})
module.exports = router;
