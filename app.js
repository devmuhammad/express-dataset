const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      swaggerUi = require('swagger-ui-express'),
      index = require('./routes/index'),
      eraseEvents = require('./routes/eraseEvents'),
      events = require('./routes/events'),
      actor = require('./routes/actor'),
      cors = require('cors'),
      sqlite3 = require('sqlite3'),
      swaggerJsdoc = require("swagger-jsdoc"),
      swagoptions = require('./swagger.js');

const app = express();

// const connection = new Sequelize('sqlite::memory:')

const swaggerspecs = swaggerJsdoc(swagoptions);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Enable Cors
// app.use(cors({credentials: true, origin: true}));


// create swagger documentation , swaggerUi.setup(swaggerDocument)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerspecs, { explorer: true }));

app.use('/', index);
app.use('/erase', eraseEvents);
app.use('/events', events);
app.use('/actors', actor);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app};
