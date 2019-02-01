import React from 'react';
import previewImg from '../images/preview.png';

const Landing = () => {
	return (
		<div className="wrapper">
			<div className="above-fold row">
				<img src={previewImg} alt="Feedback App Preview" className="col sm12 m6" />
				<div className="intro col sm6 m6">
					<h1>Optimize relationships with your customers</h1>
					<p>We know you value your customers.</p>
					<p>Let their voices be heard!</p>
					<p>Collect feedback and take the guesswork out of how to provide the best service possible.</p>
				</div>
			</div>
			<div className="below-fold grey lighten-2">
				<div className="row">
					<div className="info-box col s12 l4 white">
						<i className="material-icons teal-text">subject</i>
						<h2 className="teal-text">Create Survey</h2>
						<p>Customize your survey with eye-catching subject and an engaging, thoughful question.</p>
					</div>
					<div className="info-box col s12 l4 white">
						<i className="material-icons teal-text">email</i>
						<h2 className="teal-text">Targeted List</h2>
						<p>
							Create a curated list to email your survey which customers can respond to from their inbox!
						</p>
					</div>
					<div className="info-box col s12 l4 white">
						<i className="material-icons teal-text">equalizer</i>
						<h2 className="teal-text">Collect Data</h2>
						<p>View the results of your survey, and use this data to improve your product and services.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
