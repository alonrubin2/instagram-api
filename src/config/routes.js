const express = require('express');
const PostsController = require('../controllers/post.controller');
const UsersController = require('../controllers/users.controller');
const auth = require('../middlewares/auth');
const routes = express.Router();
const multer = require('multer');
const User = require('../models/user');
const upload = multer({ dest: 'public/posts' });
const uploadAvatar = multer({dest: 'public/avatars'});




// FOLLOW-UNFOLLOW
routes.post('/user/:id/follow', auth, UsersController.follow);
routes.delete('/user/:id/unfollow', auth, UsersController.unFollow);
// routes.get('/user/:username', auth, UsersController.findOneUser)

// unregistered
routes.put('/user', UsersController.createUser);
routes.post('/user/me', auth, UsersController.me);
routes.get('/user/check', UsersController.check);
routes.get('/user/edit/check', UsersController.check);


// posts for user page
routes.get('/user/:username/posts', auth, UsersController.getUserPosts)


// posts
routes.get('/post/:id/comment', auth, PostsController.getAllComments)
routes.get('/post', auth, PostsController.feed);

routes.put('/post', auth, upload.single('image'), PostsController.create);

routes.put('/post/:id/comment', auth, PostsController.createComment)

routes.get('/post/:id', auth, PostsController.getOnePost);


// LIKE-UNLIKE
routes.post('/post/:id/like', auth, PostsController.like);
routes.delete('/post/:id/like/:userId', auth, PostsController.unLike);

//LOGIN
routes.post('/user/login', UsersController.login);

// EDIT USER
routes.post('/user/edit/:id', auth, uploadAvatar.single('image') , UsersController.editUser)

//get user details
routes.get('/user/:username', auth, UsersController.getUserDetails);


routes.get('/user', auth, UsersController.findAllUsers);


routes.get('/', (req, res) => res.send());




module.exports = routes;