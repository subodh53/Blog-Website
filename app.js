require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {isActiveRoute} = require('./server/helpers/routeHelpers');



const app = express();
const PORT = 5000;


// connect to DB
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
// app.use(methodOverride((req, res) => {
//     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//       // look in urlencoded POST bodies and delete it
//       let method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//   }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(express.static('./public'));

// Templating Engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));



app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
});
