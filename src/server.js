// Require Libraries
require('dotenv').config();
const express = require('express');

// Set db
require('../data/db');

// App Setup
const app = express();
const port = process.env.PORT

// Middleware
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Add this after you initialize express.
app.use(cookieParser()); 

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

const checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// Controllers
require('../controllers/recipe.js')(app);
require('../controllers/auth.js')(app);

// Run Server
app.listen(port, () => console.log(`Listening on port ${port}! http://localhost:${port}`))

// Export for Mocha to run tests
module.exports = app;