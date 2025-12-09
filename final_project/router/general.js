const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

public_users.get('/books', async function(req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(books[req.params.isbn]);
 });

 public_users.get('/book/isbn/:isbn', async function(req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const filteredBooks = Object.values(books)
    .filter(book => book.author === req.params.author);

  return res.send(filteredBooks);
});

 public_users.get('/book/author/:author', async function(req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const filteredBooks = Object.values(books)
    .filter(book => book.title === req.params.title);

  return res.send(filteredBooks);
});

 public_users.get('/book/title/:title', async function(req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
