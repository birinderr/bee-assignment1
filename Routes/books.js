const express = require('express');
const Router = express.Router();
const {handleGetAllBooks,handleAddNewBook,handleGetBookById,handleUpdateBookByID,handleDeleteBookById} = require('../Controllers/books');
const isValidUser = require('../Middlewares/validUser');

Router.route('/')
    .get(handleGetAllBooks)
    .post(isValidUser,handleAddNewBook);

Router.route('/:id')
    .get(isValidUser,handleGetBookById)
    .put(isValidUser,handleUpdateBookByID)
    .delete(isValidUser,handleDeleteBookById);

module.exports = Router;