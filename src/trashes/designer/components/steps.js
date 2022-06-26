import React from "react";

import "./style.scss";
import { Grid, Fields } from "components";

const StepsComponent = ({ steps, formStep, setFormStep, changeStep }) => {
	return (
		<Grid.Row className="map-form__steps">
			{steps &&
				steps.length > 0 &&
				steps.map((step, index) => (
					<Grid.Column xs={12} lg={6} key={step.value ? step.value : index}>
						<div className={`map-form__steps__line ${step.value === formStep.value ? "active" : ""}`} />
						<Fields.Radio
							id={step.value}
							value={step.value}
							label={step.label}
							checked={step.value === formStep.value}
							className="map-form__steps__radio"
							onChange={() => {
								if (changeStep) {
									setFormStep(step);
								}
							}}
						/>
					</Grid.Column>
				))}
		</Grid.Row>
	);
};

export default StepsComponent;
