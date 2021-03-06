const path = require('path');
const routes = require('express').Router();
const models = require('../db/models');
const login = require('./login');
const formidable = require('formidable');
/* ---------------------------- Handle GET Request ---------------------------- */

routes.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'))
});

routes.get('/userprofile/:id', (req, res) => {
  let userId = req.params.id; //
  let userData = {};
  console.log(userId)

  models.Profile.query('where', 'user_id', '=', userId).fetch()
  .then((profileResults) => {
    userData.profile = profileResults
    res.status(200);
    res.send(userData); })
  .catch((err) => {
    console.log('Profile does not exist', err);
    res.end();
  })
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
      res.status(200);
      res.send(userData);
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
  req.logout();
  res.redirect('/');
});

routes.get('/forum', (req, res) => {
  models.Thread.fetchAll()
  .then((results) => {
    let threads = results.models.map((modelBase) => {
      return modelBase.attributes;
    });
    res.send(threads);
  }, (err) => {
    res.status(400);
    res.end();
  });
});

routes.get('/forum/:threadId/posts',  (req, res) => {
  models.Post.query('where', 'thread_id', '=', +req.param('threadId')).fetchAll()
  .then((results) => {
    let posts = results.models.map((modelBase) => {
      return modelBase.attributes;
    });
    res.send(posts);
  }, (err) => {
    res.status(400);
    res.end();
  });
});

routes.get('/forum/:threadId/posts/:postId', /* Auth Middleware */  (req, res) => {
  models.Post.query('where', 'id', '=', req.params.postId).fetch()
  .then((results) => {
    res.status(200);
    res.send(results);
  }, (err) => {
    res.status(400);
    res.end();
  });
});

routes.get('/deserialize', (req, res) => {  //MODIFY LATER not to send password
  res.send(req.user);
});

routes.get('/user/:userId/posts', (req, res) => {
  models.Post.query('where', 'user_id', '=', req.params.userId).fetchAll()
  .then((results) => {
    let posts = results.models.map((modelBase) => {
      return modelBase.attributes;
    });
    res.send(posts);
  }, (err) => {
    res.status(400);
    res.end();
  });
});

routes.get('/user/:userId/albums', (req, res) => {
  models.Album.query('where', 'user_id', '=', req.params.userId).fetchAll()
  .then((results) => {
    let albums = results.models.map((modelBase) => {
      return modelBase.attributes;
    });
    res.send(albums);
  }, (err) => {
    res.status(400);
    res.end();
  });
});

/* ---------------------------- Handle POST Request ---------------------------- */

routes.post('/login', login.verify, (req, res) => {
  console.log('loginser', req.user.id);
  res.send({
    id: req.user.id,
    username: req.user.username
  });
});

routes.post('/signup', (req, res) => {
  var newUser = req.body.username;
  var newPass = req.body.password;
  //var newEmail = req.body.email; // add email field later
  var profile = req.body.profile;
  var newDate = new Date();

  models.User.forge({username: newUser, password: newPass, created_at: newDate, updated_at: newDate}).save()
  .then((results) => {
    var id = results.get('id');
    return models.Profile.forge({user_id: id, profiletype: profile}).save()
  })
  .then((results) => {
    req.session.passport = {
      user: results.attributes.user_id
    };
    let user = {
      id: results.attributes.user_id,
      username: newUser
    };
    req.session.save((err) => {
      if(err) throw err;
      res.send(user);
    });
  })
});

routes.post('/forum', (req, res) => {
  // Save musicsheet
  let form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../musicsheet";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    // Create thread
    console.log('files', files);
    fields.musicsheet = path.basename(files[Object.getOwnPropertyNames(files)[0]].path);
    fields.created_at =  new Date();
    fields.updated_at =  new Date();
    models.Thread.forge(fields).save()
    .then((results) => {
      console.log(results)
      res.status(200);
      res.end();
    }, (err) => {
      console.log('error saving a thread', err);
      res.status(400);
      res.end();
    });
  });
});

routes.post('/forum/:threadId/posts', (req, res) => {
  req.body.thread_id = +req.param('threadId');
  models.Post.forge(req.body).save()
  .then((results) => {
    res.status(200);
    res.end();
  }, (err) => {
    res.status(400);
    res.end();
  });
});

routes.post('/logout', (req, res) => {
  console.log('req.session', req.session)
  req.session.destroy(function (err) {
    res.end();
  });
});

/* ---------------------------- Handle DELETE/UPDATE Request ---------------------------- */

routes.delete('/forum/:threadId/posts/:postId', /* Auth Middleware */ (req, res) => {
  models.Post.query('where', 'thread_id', '=', req.params.threadId).fetchAll()
    .then(postResults => {
      return postResults.models.map((modelBase) => { // return a promise, array of posts
        return modelBase.attributes;
      })
    })
    .then(results => {
      // delete the post from results array
      results.forEach((post, index) => {
        if (post.id === req.params.postId) {
          results.splice(index, 1)
        }
      });
      // delete the post from database
      models.Post.query('where', 'id', '=', req.params.postId).fetch()
        .then(post => {
          if (post) {
            post.destroy()
          }
        });
      res.status(200)
      res.send(results)
    }, (err) => {
      res.status(400);
      res.end();
    })
});

routes.patch('/profile/:id', (req, res) =>{
  let id = req.params.id;
  models.Profile.where({user_id: id}).save(req.body, {patch: true}).then((results)=>{
    res.end();
  })

});

module.exports = routes;
