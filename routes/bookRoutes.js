const express = require('express');
const Book = require('../model/book');
const Student = require('../model/student');
const {jwtAuthMiddleware} = require('../jwt');
const router = express.Router();
const User = require('../model/user');

const checkAdminRole = async (userid) => {
  try {
    const user = await User.findById(userid);
    if (user && user.role === "admin") {
      return true; 
    }
    return false;
  } catch (err) {
    console.log(err);
    return false; 
  }
};


router.post('/add', jwtAuthMiddleware, async (req, res) => {
  try{
    if(!(await checkAdminRole(req.user.id))) 
      return res.status(403).json({ message: "user has not in admin role"});

    const book = new Book(req.body);
    await book.save();
    res.send(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
 
});


router.post('/borrow/:bookId/:studentId', jwtAuthMiddleware, async (req, res) => {
try{

  if(!(await checkAdminRole(req.user.id))) 
    return res.status(403).json({ message: "user has not in admin role"});

  const { bookId, studentId } = req.params;
  const book = await Book.findById(bookId);
  const student = await Student.findById(studentId);
  if (!book || !student) return res.status(404).send('Book or Student not found');

  book.borrowedBy = student._id;
  book.history.push({ student: student._id, borrowedAt: new Date() });
  student.borrowedBooks.push(book._id);
  await book.save();
  await student.save();
  res.send(book);
} catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

 
});

// Return a book (admin only)
router.post('/return/:bookId', jwtAuthMiddleware, async (req, res) => {
  try{

    if(!(await checkAdminRole(req.user.id))) 
      return res.status(403).json({ message: "user has not in admin role"});


    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('borrowedBy');
    if (!book) return res.status(404).send('Book not found');
  
    const student = await Student.findById(book.borrowedBy);
    if (!student) return res.status(404).send('Student not found');
  
    book.history[book.history.length - 1].returnedAt = new Date();
    student.borrowedBooks.pull(book._id);
    book.borrowedBy = null;
    await book.save();
    await student.save();
    res.send(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

});

// Get book history (admin only)
router.get('/history/:bookId',jwtAuthMiddleware, async (req, res) => {
  try{
    if(!(await checkAdminRole(req.user.id))) 
      return res.status(403).json({ message: "user has not in admin role"});

    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('history.student');
    if (!book) return res.status(404).send('Book not found');
  
    res.send(book.history);
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
  
});

router.get('/',jwtAuthMiddleware, async (req, res) => {
  try{
    if(!(await checkAdminRole(req.user.id))) 
      return res.status(403).json({ message: "user has not in admin role"});
    const book = await Book.find()
    if (!book) return res.status(404).send('Book not found');
  
    res.send(book);
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

router.put('/update/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    } 
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.delete('/delete/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
