var express = require('express');
var path = require('path');
var dotenv = require('dotenv');

var indexRouter = require('./routes/indexRouter');
var genresRouter = require('./routes/genresRouter');
var publisherRouter = require('./routes/publisherRouter');


var app = express();

dotenv.config();

const port = process.env.PORT || 8000;

// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));



app.get('/', function(req, res) {  
  res.render('home');
});



const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/home', indexRouter);
app.use('/genres', genresRouter);
app.use('/publisher', publisherRouter);


module.exports = app;
