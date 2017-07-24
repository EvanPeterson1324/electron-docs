const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB! =)');
});

mongoose.connect(process.env.MONGODB_URI);                // Connect to our DB!

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', (req, res) => {

});

app.post('/register', (req, res) => {

});


app.listen(3000, () => {
  console.log('Backend server for Electron Docs App running on port 3000!');
});
