const express = require('express');
const app = express();

// We import the body-parser package.
// This package contains middleware that can handle
// the parsing of many different kinds of data,
// making it easier to work with data in routes that
// accept data from the client (POST, PATCH).
const bodyParser = require("body-parser");


const port = 3000

// Importing the data from our fake database files.
const users = require("./data/users");
const posts = require("./data/posts");

//  all routes 
// We use the body-parser middleware FIRST so that
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app
  .route("/api/users")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    // Within the POST request route, we create a new
    // user with the data given by the client.
    // We should also do some more robust validation here,
    // but this is just an example for now.
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        res.json({ error: "Username Already Taken" });
        return;
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });
  app
  .route("/api/users/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    if (user) res.json(user);
    else next();
  })
  .patch((req, res, next) => {
    // Within the PATCH request route, we allow the client
    // to make changes to an existing user in the database.
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    // The DELETE request route simply removes a resource.
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

app
  .route("/api/posts")
  .get((req, res) => {
    res.json(posts);
  })
  .post((req, res) => {
    // Within the POST request route, we create a new
    // post with the data given by the client.
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

app
  .route("/api/posts/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    if (post) res.json(post);
    else next();
  })
  .patch((req, res, next) => {
    // Within the PATCH request route, we allow the client
    // to make changes to an existing post in the database.
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
    // The DELETE request route simply removes a resource.
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

app.get("/", (req, res) => {
  res.send("Work in progress!");
});

app.use((req, res) => {
  res.status(404);
  res.json({ error: "Resource Not Found" });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});




// // index route for users 
// // Creating a GET route for the entire users database.
// // This would be impractical in larger data sets.
// app.get("/api/users", (req, res) => {
//     res.json(users);
//   });

// // Creating a simple GET route for individual users,
// // using a route parameter for the unique id.
// app.get("/api/users/:id", (req, res) => {
//     const user = users.find((u) => u.id == req.params.id);
//     if (user) {res.json(user)
//     } else {
//   res.send("user not found")}
//   });


// // index route for posts
// // Creating a GET route for the entire posts database.
// // This would be impractical in larger data sets.
// app.get("/api/posts", (req, res) => {
//     res.json(posts);
//   });

// //   show route for post
// // Creating a simple GET route for individual posts,
// // using a route parameter for the unique id.
// app.get("/api/posts/:id", (req, res) => {
//     const post = posts.find((p) => p.id == req.params.id);
//     if (post) {res.json(post)
//     } else {
//   res.send("post not found")}
//   });
  

// app.get("/", (req, res) => {
//     res.send("All usable route start in slash api!");
//   });
  