import React from "react";
import { Fields, Button } from "components";
import { Field } from "formik";

import { useAccess } from "hooks";

const Form = ({ isSubmitting, setFormStep, steps, id }) => {
	const goBack = () => {
		setFormStep(steps[0]);
	};

	const is_moderator = useAccess({ roles: ["moderator"] });

	return (
		<div className="mt-5 shadow-none">
			<Field component={Fields.Input} disabled name="total" label="Жами" />
			<Field component={Fields.Input} disabled name="rate" label="Бал" />
			{!is_moderator && (
				<div className="flex justify-end">
					<Button.Default type="blue" buttonType="submit" loading={isSubmitting} className="ml-2">
						Сохранить
					</Button.Default>
					<Button.Default type="secondary" buttonType="button" onClick={() => goBack()}>
						Отменить
					</Button.Default>
				</div>
			)}
		</div>
	);
};

export default Form;
