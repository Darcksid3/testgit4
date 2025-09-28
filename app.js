const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

// les routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const dashRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const catRouter = require('./routes/catways');
const reservRouter = require('./routes/reservation');

const testRouter = require('./routes/test');

const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

const app = express();

app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));

//Création d'une session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  name: 'connect',
  secret: 'SeCr3T',  
  resave: true,
  saveUninitialized: false,
  cookies: { maxAge: Date.now() + (30 * 24 * 3600 * 1000)}
  })
);



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//importation du layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', '../views/layouts/layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter)
app.use('/logout', logoutRouter);
app.use('/dashboard', dashRouter);
app.use('/users', usersRouter);
app.use('/catways', catRouter);
app.use('/reservation', reservRouter);

app.use('/test', testRouter);




module.exports = app;
