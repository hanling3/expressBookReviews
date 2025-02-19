const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({ books }, null, 4)))
  })
  promise.then(() => console.log("Promise is resolved"))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    let book = books[req.params.isbn];
    if (book) {
      resolve(res.send(book));
    }
    reject(res.send("The ISBN doesn't exist"));
  })
  promise.then(() => console.log("Promise is resolved"))
    .catch(() => console.log("The ISBN doesn't exist"));

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    let books_byAuthor = {};
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key]["author"] === req.params.author) {
        books_byAuthor[key] = books[key];
        resolve(res.send(JSON.stringify({ books_byAuthor }, null, 4)));
      }
    })
    reject(res.send("The author doesn't exist"));
  })
  promise.then(() => console.log("Promise is resolved"))
    .catch(() => console.log("The author doesn't exist"));

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    let books_byTitle = {};
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key]["title"] === req.params.title) {
        books_byTitle[key] = books[key];
        resolve(res.send(JSON.stringify({ books_byTitle }, null, 4)));
      }
    })
    reject(res.send("The title doesn't exist"));
  })
  promise.then(() => console.log("Promise is resolved"))
    .catch(() => console.log("The title doesn't exist"));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let reviews = books[req.params.isbn]["reviews"];
  res.send(reviews);
});

module.exports.general = public_users;
