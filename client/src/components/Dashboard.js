import React from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './surveys/SurveyList';

const Dashboard = () => {
	return (
		<div className="dashboard container">
			<h1>Dashboard</h1>
			<div className="row">
				<SurveyList />
			</div>
			<div className="fixed-action-btn">
				<Link to="/surveys/new" className="btn-floating btn-large red">
					<i className="large material-icons">add</i>
				</Link>
			</div>
		</div>
	);
};

export default Dashboard;
