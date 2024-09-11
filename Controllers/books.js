const books = require('../Models/book');

async function handleGetAllBooks(req, res) {
    const { genre, author, publication } = req.query;
    const filter = {};

    // Build the filter object based on query parameters
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    if (publication) filter.publication = Number(publication);

    try {
        const filtered_books = await books.find(filter);
        res.json(filtered_books);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching books' });
    }
}

async function handleAddNewBook(req,res) {
    try {
        const { title, author, genre, publication, image_url, ISBN, description } = req.body;

        if (!title || !author) {
            return res.status(400).json({ success: false, message: 'Title, Author, and ISBN are required fields.' });
        }

        const newBook = new books({
            title,
            author,
            genre: genre || '',
            publication: publication || null, 
            image_url: image_url || '', 
            ISBN: ISBN || null,
            description: description || '',
        });

        await newBook.save();

        res.status(201).json({ success: true, message: 'Book added successfully!', book: newBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding the book'});
    }
}

async function handleGetBookById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Please provide a valid ID' });
    }

    try {
        const book = await books.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.json({ success: true, book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching the book', error: err.message });
    }
}


async function handleUpdateBookByID(req,res) {
    const {id} = req.params;
    if(!id) res.status(400).json({ success: false, message: 'please provide a valid id'});
    const { title, author, genre, publication, image_url, ISBN, description } = req.body;

    try{
        const book = await books.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.publication = publication || book.publication;
        book.image_url = image_url || book.image_url;
        book.ISBN = ISBN || book.ISBN;
        book.description = description || book.description;

        await book.save();
        res.json({ success: true, message:"book updated",book });
    } catch(err){
        res.status(500).json({ success: false, message: 'Error updating book'});
    }

}

async function handleDeleteBookById(req,res) {
    const {id} = req.params;
    if(!id) res.status(400).json({ success: false, message: 'please provide a valid id'});

    try {
        const deletedBook = await books.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.json({ success: true, message: 'Book deleted successfully', book: deletedBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting the book' });
    }

}

module.exports = {handleGetAllBooks,handleAddNewBook,handleGetBookById,handleUpdateBookByID,handleDeleteBookById};