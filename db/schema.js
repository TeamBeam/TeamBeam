const config = process.env.DATABASE_URL ? require('./config.heroku.js') : require('./config.js'); //Define PostgreSQL configuration here
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);

/* Define schemas here */
knex.schema.createTableIfNotExists('users', function (table) {
  table.increments();
  table.string('username');
  table.string('password');
  table.timestamps();
})
.then((results) => {
  console.log('Success creating users table');
  return knex.schema.createTableIfNotExists('threads', function (table) {
    table.increments();
    table.string('title');
    table.text('description');
    table.json('instruments');
    table.string('musicsheet');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
    table.timestamps();
  });
}, (err) => {
  console.log('Error creating users table', err);
})
.then((results) => {
  console.log('Success creating threads table');
  return knex.schema.createTableIfNotExists('posts', function (table) {
    table.increments();
    table.text('message');
    table.integer('thread_id').unsigned();
    table.foreign('thread_id').references('id').inTable('threads');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
    table.timestamps();
  });
}, (err) => {
  console.log('Error creating threads table', err);
})
.then((results) => {
  console.log('Success creating posts table');
  return knex.schema.createTableIfNotExists('albums', function (table) {
    table.increments();
    table.string('title');
    table.json('songs');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
  });
}, (err) => {
  console.log('Error creating posts table', err);
})
.then((results) => {
  console.log('Success creating albums table');
  return knex.schema.createTableIfNotExists('profiles', function (table) {
    table.increments();
    table.json('instruments');
    table.text('bio');
    table.string('picture');
    table.json('discography');
    table.string('profiletype');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
  });
}, (err) => {
  console.log('Error creating albums table', err);
})
.then((results) => {
  console.log('Sucess creating profiles table');
  process.exit(0);
}, (err) => {
  console.log('Error creating profiles table', err);
  process.exit(1);
});

// *Example of saving an object into a table**

// let dummyThread = {
//   title: 'example title',
//   description: 'example description',
//   instruments: JSON.stringify(['Piano', 'Drums']),
//   musicsheet: 'https://i.pinimg.com/736x/f8/04/cb/f804cbff9ca51419934b6665c758b977--alto-sax-sheet-music-free-sheet-music.jpg',
//   user_id: 1,
//   created_at: new Date()
// }

// let Thread = bookshelf.Model.extend({
//   tableName: 'threads'
// });

// User.forge(dummyUser).save()
// .then((results) => {
//   console.log('sucess save user', results);
// }, (err) => {
//   console.log('err save user', err);
// });


// *******************************************

