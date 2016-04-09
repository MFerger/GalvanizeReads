exports.up = function(knex, Promise) {
	return knex.schema.createTable('books', function(table){
		table.increments();
		table.string('title');
		table.text('description');
		table.string('cover_url');
		table.string('genre');
	})
  .createTable('authors', function(table){
      table.increments();
      table.string('first_name');
      table.string('last_name');
      table.string('portrait_url');
      table.text('biography');
    })
  .createTable('bibliography', function(table) {
  	table.integer('book_id').unsigned().references('books.id').onDelete('cascade').onUpdate('cascade');
  	table.integer('author_id').unsigned().references('authors.id').onDelete('cascade').onUpdate('cascade');
  })
};

exports.down = function(knex, Promise) {
	return knex.schema
  .dropTable('books');
  .dropTable('authors');
  .dropTable('bibliography');
};
