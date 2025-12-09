const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
 return users.some((user) => {
    return user.username === username;
  });
}

const authenticatedUser = (username,password)=>{
  return users.some((user) => {
    return user.username === username && user.password === password;
  });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 3600 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {username} = req.session.authorization;
  const reviews = books[req.params.isbn].reviews;
  reviews[username] = req.query.review;
  res.send(books[req.params.isbn]);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {username} = req.session.authorization;
  const reviews = books[req.params.isbn].reviews;
  delete reviews[username];
  res.send(books[req.params.isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
