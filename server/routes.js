const routes = require('express').Router();
const models = require('../db/models')


/* ---------------------------- Handle GET Request ---------------------------- */

routes.get('/', (req, res) => {
  res.send('index')
});

routes.get('/user/:username', (req, res) => {
  let username = req.params.username; // username endpoint
  let userData = {}

  models.User.query('where', 'username', '=', username).fetch()
    .then(userResults => {
      let userId = userResults.attributes.id; // get user id from the user
      userData.user = userResults
      return models.Profile.query('where', 'user_id', '=', userId).fetch()
    })
    .then(profileResults => {
      userData.profile = profileResults
      res.send(userData);
      res.end()
    }, (err) => {
      console.log('err username does not exist', err);
      res.status(400);
      res.end();
    })

});

routes.get('/login', /* Auth Middleware */ (req, res) => {
  // res.send('login')

});

routes.get('/logout', (req, res) => {
	// res.send('logout')
});

routes.get('/forum', /* Auth Middleware */  (req, res) => {
  models.Thread.fetchAll()
  .then((results) => {
    let threads = results.models.map((modelBase) => {
      return modelBase.attributes;
    });
    res.status(200);
    res.send(threads);
  }, (err) => {
    console.log('err fetching threads', err);
    res.status(400);
    res.end();
  });
});

/* ---------------------------- Handle POST Request ---------------------------- */

routes.post('/login', /* Auth Middleware */ (req, res) => {


});

routes.post('/signup', /* Auth Middleware */ (req, res) => {

});

routes.post('/forum', /* Auth Middleware */ (req, res) => {
  models.Thread.forge(req.body).save()
  .then((results) => {
    res.status(200);
    res.end();
  }, (err) => {
    console.log('error saving a thread', err);
    res.status(400);
    res.end();
  });
});

routes.post('/forum/id/comments', /* Auth Middleware */ (req, res) => {

});

module.exports = routes;
