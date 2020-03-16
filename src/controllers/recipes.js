const Post = require('../models/post');
const User = require('../models/user')

module.exports = app => {

  // INDEX
  app.get('/', (req, res) => {
    const currentUser = req.user
    Post.find({}).populate('author').lean() // added .lean() to fix  'Access has been denied to resolve the property "url" because it is not an "own property" of its parent.'
      .then(posts => {
        res.render("posts-index", {
          posts,
          currentUser
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  // NEW POST
  app.get("/posts/new", (req, res) => {
    const currentUser = req.user;
    res.render("posts-new.handlebars", {
      currentUser
    });
  });

  app.post("/posts/new", (req, res) => {
    if (req.user) {
      console.log(req.user)
      const post = new Post(req.body);
            post.author = req.user._id;
            post.upVotes = [];
            post.downVotes = [];
            post.voteScore = 0;
      post
        .save()
        .then(post => {
          return User.findById(req.user._id)
        })
        .then(user => {
          user.posts.unshift(post);
          user.save();
          res.redirect(`/posts/${post._id}`)
        })
        .catch(err => {
          console.log(err.message)
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  app.get("/posts/:id", function (req, res) {
    // LOOK UP THE POST
    const currentUser = req.user;
    Post.findById(req.params.id).populate('comments').lean()
      .then(post => {
        res.render("posts-show", {
          post,
          currentUser
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

// // Vote up and down routes
//   app.put("/posts/:id/vote-up", function(req, res) {
//     Post.findById(req.params.id).exec(function(err, post) {
//       post.upVotes.push(req.user._id);
//       post.voteScore = post.voteScore + 1;
//       post.save();

//       res.status(200);
//     });
//   });

//   app.put("/posts/:id/vote-down", function(req, res) {
//     Post.findById(req.params.id).exec(function(err, post) {
//       post.downVotes.push(req.user._id);
//       post.voteScore = post.voteScore - 1;
//       post.save();

//       res.status(200);
//     });
//   });

};