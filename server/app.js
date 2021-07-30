const express = require("express");
const db = require("./lib/db");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());

/*
  Endpoint to handle GET requests to the root URL "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

app.get("/articles", (req, res) => {
  db.findAll()
    .then((posts) => {
      console.log(posts);
      res.send(posts);
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.post("/articles", (req, res) => {
  db.insert(req.body)
    .then((newPost) => {
      console.log(newPost);
      res.status(201).send(newPost);
    })
    .catch((error) => {
      console.error(error);
      res.send(error);
    });
});

//eg immer zuerst error handlen dannach "happy path" or correct path
app.get("/articles/:id", function (req, res) {
  db.findById(req.params.id)
    .then((post) => {
      if (post) {
        console.log("Aricle found");
        res.send(post);
      } else {
        console.log("Article not found");
        res.status(404).json("404 Article not found"); //.send only send json if object or array. If string than its plain text.
      }
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.patch("/articles/:id", function (req, res) {
  db.updateById(req.params.id, req.body)
    .then((updatedPost) => {
      if (updatedPost) {
        console.log("Article updated");
        res.status(200).send(updatedPost);
      } else {
        console.log("Post not found, hence couldn't be updated");
        res.status(404).send("404 Article not found");
      }
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.delete("/articles/:id", function (req, res) {
  db.deleteById(req.params.id)
    .then(() => {
      console.log("deleted successfully");
      res.status(204).end(); //just end without sending a body
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
