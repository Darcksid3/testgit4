const express = require('express');

const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const path = require('path');

// les routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const dashRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const catRouter = require('./routes/catways');


const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Port de plaisance Russell',
      version: '1.0.0',
      description: 'Documentation de l’API',
    },
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

const app = express();

app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));


//Création d'une session
app.set('trust proxy', 1) 
app.use(session({
  name: 'connect',
  secret: 'SeCr3T',  
  resave: false,
  saveUninitialized: false,
  rolling: true,

  store : MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 2 * 24 * 60 * 60,
    autoRemove:'interval',
    autoRemoveInterval: '10',
  }),

  cookies: { 
    maxAge: (2 * 24 * 3600 * 1000),
    secure: false,
    httpOnly: true
  }
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


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));




module.exports = app;
