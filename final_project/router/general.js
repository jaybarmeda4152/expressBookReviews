const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "user successfully registred" });
    } else {
      return res.status(404).json({ message: "user already exists!" });
    }
  } else {
    return res.status(404).json({ message: "username or password is invalid" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let getAllBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books))
    }, 3000)
  })
  getAllBooks.then((books) => {
    return res.status(200).send(books)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let selectBook = new Promise((resolve, reject) => {
    setTimeout(() => {
      const isbn = req.params.isbn
      if (isbn && isbn > 0) {
        const selecteBook = books[isbn]
        if (selecteBook) {
          resolve(selecteBook)
        } else reject({ mmessage: 'book not found' })
      }
      reject({ mmessage: 'invalid isbn' })
    }, 3000)
  })

  selectBook.then((book) => {
    return res.status(200).send(book)
  }).catch((errMessage) => {
    return res.status(403).send(errMessage)
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let selectBook = new Promise((resolve, reject) => {
    setTimeout(() => {
      const author = req.params.author
      if (author) {
        const booksOfAuther = Object.values(books).filter(each => each.author === author)
        if (booksOfAuther.length > 0) {
          resolve(JSON.stringify(booksOfAuther))
        } else reject({ mmessage: 'book not found' })
      }
      return reject({ mmessage: 'invalid author' })

    }, 3000)
  })

  selectBook.then((book) => {
    return res.status(200).send(book)
  }).catch((errMessage) => {
    return res.status(403).send(errMessage)
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let selectBook = new Promise((resolve, reject) => {
    setTimeout(() => {

      const title = req.params.title
      if (title) {
        const booksWithTitle = Object.values(books).filter(each => each.title === title)
        if (booksWithTitle.length > 0) {
          resolve(JSON.stringify(booksWithTitle))
        } else reject({ mmessage: 'book not found' })
      }
      reject({ mmessage: 'invalid title' })
    }, 3000)
  })

  selectBook.then((book) => {
    return res.status(200).send(book)
  }).catch((errMessage) => {
    return res.status(403).send(errMessage)
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  if (isbn && isbn > 0) {
    const selecteBook = books[isbn]
    if (selecteBook) {
      return res.status(200).send(JSON.stringify(selecteBook.reviews))
    } else return res.status(403).send({ mmessage: 'book not found' })
  }
  return res.status(403).send({ mmessage: 'invalid isbn' })
});

module.exports.general = public_users;
