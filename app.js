//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/postDB', { useNewUrlParser: true });

const postSchema = {
  postTitle: String,
  postBody: String,
};

const Post = mongoose.model('Post', postSchema);

const homeStartingContent =
  'Embark on a journey of creativity and expression with our web app designed for seamless blog writing. Unleash your thoughts, share your stories, and engage with a vibrant community of like-minded individuals. Let your ideas flow as you navigate an intuitive platform crafted for the modern storyteller. Join us and let your voice be heard in the vast landscape of the blogosphere! 📝💻🌐';
const aboutContent =
  'Step into a realm of boundless creativity on our web app tailored for blog writing. Unleash your ideas effortlessly, backed by an intuitive interface designed for both novices and seasoned writers. Elevate your content creation experience and join a community passionate about sharing impactful stories. Your words matter—let`s amplify them together! 🖋️✨💻';
const contactContent =
  'Have a question, suggestion, or just want to say hello? We`re here and ready to chat! Reach out through our contact form or drop us a message at my e-mail. Your feedback is valuable, and we look forward to connecting with you. Let`s make meaningful conversations happen! 🤝🌐📧';

app.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('home', { startingContent: homeStartingContent, posts: posts });
  });
});

app.get('/about', function (req, res) {
  res.render('about', { aboutContent: aboutContent });
});

app.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent });
});

app.get('/compose', function (req, res) {
  res.render('compose');
});

app.post('/compose', function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };
  const newpost = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });

  newpost.save();

  res.redirect('/');
});

app.get('/posts/:postName', function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  Post.find({}, function (err, posts) {
    posts.forEach(function (post) {
      const storedTitle = _.lowerCase(post.postTitle);

      if (storedTitle === requestedTitle) {
        res.render('post', { title: post.postTitle, content: post.postBody });
      }
    });
  });
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
