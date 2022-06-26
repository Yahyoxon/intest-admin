import React from "react";
import { useDispatch } from "react-redux";

import storageActions from "store/actions/storage";
import { Grid, Fields } from "components";
import "./style.scss";


const StepsComponent = ({ values, steps, formStep, setFormStep }) => {
	const dispatch = useDispatch();
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
								dispatch(storageActions.SAVE_TEMPRORY_DATA.success(values));
								setFormStep(step);
							}}
						/>
					</Grid.Column>
				))}
		</Grid.Row>
	);
};

export default StepsComponent;
