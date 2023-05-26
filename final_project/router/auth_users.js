const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let existingName = users.filter((user) => {
    return user.username === username;
  });
  if (existingName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validatedUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validatedUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access');

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("User sccessfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    let new_review = req.body.reviews;
    let reviewer = req.session.authorization.username;
    let reviews = books[isbn]["reviews"];
    if (new_review) {
      reviews[reviewer] = new_review;
      res.send(`Book ${books[isbn]["title"]} has new reviews: `
        + JSON.stringify({ reviews }, null, 4));
    }
  }
  res.send("Unable to find book");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
