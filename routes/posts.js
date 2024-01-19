const express = require("express");
const router = express.Router();

const posts = require("../data/posts");

router
  .route("/")
//   getting all post 
  .get((req, res) => {
    res.json(posts);
  })
  .post((req, res) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });

router
  .route("/:id")
//   gettinf specific user by id 
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    if (post) res.json(post);
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

  router
  // GET /api/users/:id/posts

  .route("/api/users/:id/posts")
  //  Retrieves all posts by a user with the specified id. 
  .get((req, res, next) => {
    const userId = parseInt(req.params.id);
    const userPosts = posts.filter((post) => post.userId === userId);

    if (userPosts.length > 0) {
      res.json(userPosts);
    } else {
      next();
    }
  });

  router
  // GET /api/posts?userId=<VALUE>

  .route("/api/posts")
  .get((req, res) => {
    const userId = parseInt(req.query.userId);
  
    if (isNaN(userId)) {
      // If userId is not a valid number, respond with an error
      return res.status(400).json({ error: 'Invalid userId parameter' });
    }
    const userPosts = posts.filter((post) => post.userId === userId);
  
    res.json(userPosts);
  });


module.exports = router;
