import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
	componentDidMount() {
		this.props.fetchSurveys();
	}
	renderSurveys() {
		return this.props.surveys.reverse().map((survey) => {
			return (
				<div className="col s12 m6 l4">
					<div className="card" key={survey._id}>
						<div className="card-content">
							<span className="card-title">{survey.title}</span>
							<p className="card-body">{survey.body}</p>
							<p className="right">
								Sent:{' '}
								{new Date(survey.dateSent).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}
							</p>
						</div>
						<div className="card-action white-text">
							<p>
								<i class="material-icons green">check</i>Yes: {survey.yes}{' '}
							</p>
							<p>
								<i class="material-icons red lighten-1">close</i>No: {survey.no}{' '}
							</p>
						</div>
					</div>
				</div>
			);
		});
	}

	render() {
		return <div>{this.renderSurveys()}</div>;
	}
}

function mapStateToProps({ surveys }) {
	return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
