const User = require('../models/user');
const Post = require('../models/post');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { log } = require('console');
const { ObjectId } = require("mongodb");

const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  };
const signup = async (req, res) => {
    console.log(req.body,'ll');

    
    try {
      const { username, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
  
      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email or username already exists'
        });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
//   console.log(hashedPassword);
  
      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });
      console.log(user);
      
  
      await user.save();
      res.status(201).json({message: 'User created successfully',user},);
    
    //   res.status(201).json({
    //     message: 'User created successfully',
    //     user: user.toJSON()
    //   });
  
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        message: 'Error creating user',
        error: error.message
      });
    }
  };

 const createPost = async (req, res) => {
    console.log(req.file,'lll',req.body.user);
   
    
    try {
      // Check if image was uploaded
    //   if (!req.file) {
    //     return res.status(400).json({ message: 'Please upload an image' });
    //   }


      const filePath = path.join('public/postimage', req.file.filename);
      console.log(filePath);
      
      // Remove file from local storage
    //   await unlink(req.file.path);
  
      // Create post
      const post = await Post.create({
        user: req.body.user,
        username: req.body.username,
        image: {
          url: filePath,
        },
        description: req.body.description,
      });

      console.log(post);
      
  
      // Populate user details
    //   await post.populate('user', 'username avatar');
  
      res.status(201).json({message: 'Post created successfully'});
    } catch (error) {
    
    console.log(error);
    
      res.status(500).json({ message: error.message });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user
      const user = await User.findOne({ email });
      console.log(user,'jkjkjkj');
      
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }
  
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }
  
      // Generate token
    //   const token = generateToken(user);
  
      // Return user data and token
      res.status(200).json({
        message: 'Login successful',
        // token,
        user
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Error logging in',
        error: error.message
      });
    }
  };

   const getPosts = async (req, res) => {
    console.log('hij');
    
    try {
      const page = parseInt(req.query.page) || 1;
      const limit =  10;
      const skip = (page - 1) * limit;
  
      const post = await Post.find()
        .populate('user', 'username avatar')
        .populate('comments.user', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

        const posts = post.map(post => {
            const postObject = post.toObject({ virtuals: true });
            postObject.image.url = postObject.image.url.replace(/\\/g, '/');
            return postObject;
          });
  
    //   const total = await Post.countDocuments();
    //         console.log(posts);
            
      res.json({
        posts,
        // currentPage: page,
        // totalPages: Math.ceil(total / limit),
        // totalPosts: total,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

   const likePost = async (req, res) => {
    console.log(req.body);
    try {
      const post = await Post.findById(req.body.id);
        console.log(post);
        const userId = req.body.user;
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if user has already liked the post
      const isLiked = post.likes.includes(req.body.user);


      console.log(isLiked);
      
  
    //   if (isLiked) {
    //     return res.status(400).json({ message: 'Post already liked' });
    //   }
  
    //   // Update post with new like
    //   if (!post) {
    //     return res.status(404).json({ message: 'Post not found' });
    //   }
  
      const likeIndex = post.likes.indexOf(req.body.user);
      

      console.log(likeIndex);
      
      if (likeIndex === -1) {
        // Like post
        console.log('1');
        
        post.likes.push(new ObjectId(userId))
                console.log(post);
      } else {
        // Unlike post
        console.log('2');
        post.likes.splice(likeIndex, 1);
      }
      console.log(post);
     const rr= await post.save();
      console.log(rr);
      
      res.json({ likes: post.likes.length, isLiked: likeIndex === -1 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const addcomment = async (req, res) => {
    try {
      const post = await Post.findById(req.body.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const userId= req.body.user;
  
      const comment = {
        user: new ObjectId(userId),
        text: req.body.text,
      };
  
      post.comments.push(comment);
      await post.save();
  
      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
module.exports = {
    signup,
    createPost,
    login,
    getPosts,
    likePost,
    addcomment
};
