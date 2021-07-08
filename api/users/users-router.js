const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const Users = require('./users/users-model.js')
const Posts = require('./posts/posts.model.js')
const router = express.Router();

// router.get('/', (req, res) => {
//   // RETURN AN ARRAY WITH ALL THE USERS
// });

router.get('/', (req, res, next) => {
  Users.find(req.query)
    .then(users => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      next({
        custom: 'problem getting users',
        message: error.message,
      });
    });
});

// router.get('/:id', (req, res) => {
//   // RETURN THE USER OBJECT
//   // this needs a middleware to verify user id
// });

router.get('/:id', checkUserId, (req, res, next) => {
  res.json(req.user);
});

router.post('/', checkUserPayload,(req, res, next) => {
  Users.add(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next);
});


// router.post('/', (req, res) => {
//   // RETURN THE NEWLY CREATED USER OBJECT
//   // this needs a middleware to check that the request body is valid
// });

router.post('/', checkUserPayload,(req, res, next) => {
  Users.add(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next);
});


// router.put('/:id', (req, res) => {
//   // RETURN THE FRESHLY UPDATED USER OBJECT
//   // this needs a middleware to verify user id
//   // and another middleware to check that the request body is valid
// });

router.put('/:id', checkUserId, checkUserPayload, (req, res, next) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      next(error)
    });
});

// router.delete('/:id', (req, res) => {
//   // RETURN THE FRESHLY DELETED USER OBJECT
//   // this needs a middleware to verify user id
// });

router.delete('/:id', checkUserId, (req, res, next) => {
  Users.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'The user has been nuked' });
    })
    .catch(next);
});

// router.get('/:id/posts', (req, res) => {
//   // RETURN THE ARRAY OF USER POSTS
//   // this needs a middleware to verify user id
// });

router.get('/:id/posts', (req, res, next) => {
  Users.findUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      next(error)
    });
});

// router.post('/:id/posts', (req, res) => {
//   // RETURN THE NEWLY CREATED USER POST
//   // this needs a middleware to verify user id
//   // and another middleware to check that the request body is valid
// });

router.post('/:id/posts', (req, res, next) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.add([post]Info)
    .then(post => {
      res.status(210).json(post);
    })
    .catch(next);
});

module.exports = router;