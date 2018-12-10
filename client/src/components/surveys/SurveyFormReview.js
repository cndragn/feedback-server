//shows users their form input for review
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import formFields from './formFields';

const SurveyFormReview = ({ onCancel, formValues }) => {
	const reviewFields = _.map(formFields, ({ name, label }) => {
		return (
			<div key={name}>
				<label>{label}</label>
				<div>{formValues[name]}</div>
			</div>
		);
	});

	return (
		<div>
			<h5>Please confirm your entries</h5>
			{reviewFields}
			<button className="yellow darken-3 white-text btn-flat" onClick={onCancel}>
				Back
			</button>
			<button className="green white-text btn-flat right">
				Send Survey
				<i className="material-icons right">email</i>
			</button>
		</div>
	);
};

function mapStateToProps(state) {
	return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps)(SurveyFormReview);
