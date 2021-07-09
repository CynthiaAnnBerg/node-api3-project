const express = require('express');


const {
  validateUserId,
  validateUser,
  validatePost,
 } = require('../middleware/middleware')

const User = require('./users-model')
const Post = require('../posts/posts-model')

const router = express.Router();

// router.get('/', (req, res) => {
//   // RETURN AN ARRAY WITH ALL THE USERS
// });

router.get('/', (req, res, next) => {
  User.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)
})
  // Users.find(req.query)
  //   .then(users => {
  //     res.status(200).json(hubs);
  //   })
  //   .catch(error => {
  //     next({
  //       custom: 'problem getting users',
  //       message: error.message,
  //     });
  //   });


// router.get('/:id', (req, res) => {
//   // RETURN THE USER OBJECT
//   // this needs a middleware to verify user id
// });

router.get('/:id', validateUserId, (req, res, next) => {
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
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

router.post('/',(req, res, next) => {
  User.insert({ name: req.name})
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
  // Users.add(req.body)
  //   .then(user => {
  //     res.status(201).json(user);
  //   })
  //   .catch(next);
});


// router.put('/:id', (req, res) => {
//   // RETURN THE FRESHLY UPDATED USER OBJECT
//   // this needs a middleware to verify user id
//   // and another middleware to check that the request body is valid
// });

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
  .then(() => {
    return User.getById(req.params.id)
  })
  .then(user => {
    res.json(user)
  })
  .catch(next)
});

// router.delete('/:id', (req, res) => {
//   // RETURN THE FRESHLY DELETED USER OBJECT
//   // this needs a middleware to verify user id
// });

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

// router.get('/:id/posts', (req, res) => {
//   // RETURN THE ARRAY OF USER POSTS
//   // this needs a middleware to verify user id
// });

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch (err) {
    next (err)
  }
});

// router.post('/:id/posts', (req, res) => {
//   // RETURN THE NEWLY CREATED USER POST
//   // this needs a middleware to verify user id
//   // and another middleware to check that the request body is valid
// });

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
 try {
   const result = await Post.insert({ 
     user_id: req.params.id,
     text: req.text,
   })
   res.status(201).json(result)
 } catch (err) {
   next(err)
 }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({ 
    customMessage: 'something tragic inside posts router happened',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;