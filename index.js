const db = require('./db');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.use('/', userRoutes);
app.use('/books', bookRoutes);
app.use('/students', studentRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
