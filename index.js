const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

require('./models/User'); // require models before passport
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json());

//tell express to make use of cookies
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
		//key to encrypt cookie
		keys: [ keys.cookieKey ]
	})
);

//tell passport to use cookies to handle auth
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets
	// like main.js or main.css
	app.use(express.static('client/build'));

	// Express will serve up index.html
	// if it doesnt recognize the route
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
