var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/', indexRouter)
app.use('/users', usersRouter)

let port = 3001
app.listen(port, () => {
  console.log(
      `Server ready at http://localhost:${port}`
  );
});

module.exports = app;
