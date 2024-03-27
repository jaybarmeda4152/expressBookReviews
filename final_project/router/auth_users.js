const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  const isUserNameExist = users.some(each => each.username === username)
  return !isUserNameExist
}

const authenticatedUser = (username, password) => { //returns boolean
  return users.some(each => each.username === username && each.password === password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in !!" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("user is now successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  if (isbn && isbn > 0) {
    const selecteBook = books[isbn]
    if (selecteBook) {
      const username = req.session.authorization['username']
      const review = req.body.review
      const isReviewExist = books[isbn].reviews[username]
      books[isbn].reviews[username] = review
      return res.status(200).send({ mmessage: isReviewExist ? "review is updated" : "review is added to the book" })
    } else return res.status(403).send({ mmessage: 'book not found' })
  }
  return res.status(403).send({ mmessage: 'invalid isbn' })
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  if (isbn && isbn > 0) {
      const selecteBook = books[isbn]
      if (selecteBook) {
          const username = req.session.authorization['username']
          const allReviews = { ...books[isbn].reviews }
          if (allReviews[username]) {
              delete allReviews[username]
              books[isbn].reviews = allReviews
              return res.status(200).send({ mmessage: "review is deleted from the book" })
          }
          else return res.status(203).send({ mmessage: "review not found" })
      } else return res.status(403).send({ mmessage: 'book not found' })
  }
  return res.status(403).send({ mmessage: 'invalid isbn' })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
