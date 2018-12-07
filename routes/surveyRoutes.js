const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
	// redirect user after sending feedback
	app.get('/api/surveys/thanks', (req, res) => {
		res.send('Thanks for voting!');
	});

	//check that user is logged in if they go to this link
	app.post('/api/surveys', requireLogin, async (req, res) => {
		//access properties out of req body
		const { title, subject, body, recipients } = req.body;

		//create new instance of survey
		const survey = new Survey({
			title,
			subject,
			body,
			// create subdocument Schema
			recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
			// set up user relationship
			_user: req.user.id,
			dateSent: Date.now()
		});

		// send email
		const mailer = new Mailer(survey, surveyTemplate(survey));

		try {
			await mailer.send();

			// save survey to the database
			await survey.save();

			// save user
			const user = await req.user.save();

			//send back updated user model
			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});
};
