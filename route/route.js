const express = require("express");
const user_route = express.Router(); // Create a router instance
const upload = require('../multer/multer');


const controllers = require('../controllers/controller');




// Define routes
user_route.post('/signup', controllers.signup);
user_route.post('/postcreate',upload.single('image'),controllers.createPost);
user_route.post('/login', controllers.login);
user_route.get('/getposts', controllers.getPosts);
user_route.post('/likepost', controllers.likePost);
user_route.post('/addcomment', controllers.addcomment);
module.exports = user_route; // Export the router
