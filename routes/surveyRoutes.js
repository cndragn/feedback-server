const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
	//produce list of surveys
	app.get('/api/surveys', requireLogin, async (req, res) => {
		//query for surveys by current user
		const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false });

		res.send(surveys);
	});

	// redirect user after sending feedback
	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send('Thanks for voting!');
	});

	app.post('/api/surveys/webhooks', (req, res) => {
		console.log(res.body);
		const p = new Path('/api/surveys/:surveyId/:choice');
		_.chain(req.body)
			.map(({ email, url }) => {
				//only return if surveyid and choice exists
				const match = p.test(new URL(url).pathname);
				if (match) {
					return { email, surveyId: match.surveyId, choice: match.choice };
				}
			})
			//remove undefined elements
			.compact()
			//remove duplicate elements
			.uniqBy('email', 'surveyId')
			.each(({ surveyId, email, choice }) => {
				// find and update query executed entirely on MongoDB
				Survey.updateOne(
					{
						//mongo uses _id not id
						//mongoose does this automatically, but
						//when passing off to mongo, must use this
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false }
						}
					},
					{
						// increase count of given choice by 1
						// [choice] is key interpolation
						$inc: { [choice]: 1 },
						// update property
						// $ is the elemMatch
						$set: { 'recipients.$.responded': true },
						//update last responded date
						lastResponded: new Date()
					}
				).exec(); // to execute query
			})
			.value();

		res.send({});
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
