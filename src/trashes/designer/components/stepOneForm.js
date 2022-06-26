import React from "react";
import { Fields, Button } from "components";
import { Field } from "formik";
import { helpers } from "services";
import { useAccess } from "hooks";

const StepOneForm = ({ isUpdate, values, rejectData, setFieldValue, isSubmitting }) => {
	const is_moderator = useAccess({ roles: ["moderator"] });
	return (
		<div className="mt-5 shadow-none">
			{rejectData && (
				<div className="rejectMessage-info">
					<div className="rejectMessage-info_title">
						<h1>
							<span />
							Причина отказа
						</h1>
					</div>
					<p>{rejectData.message}</p>
				</div>
			)}
			<Field component={Fields.Input} name="name" type="text" placeholder="Введите вашу почту" label="Имя компании" />
			<Field component={Fields.Input} name="inn" type="number" placeholder="Введите вашу почту" label="ИНН" />
			<Field component={Fields.Input} name="option_1" label="1. Иштирокчининг иш тажрибаси" />
			<Field
				component={Fields.Select}
				name="option_2"
				label="2. Шартномавий режанинг ўз муддатида бажарганлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.designerEvaluationSystemTwo}
			/>
			<Field component={Fields.Input} type="number" name="option_3" label="3. Иштирокчининг ташкилий шакли." />
			<Field
				component={Fields.Input}
				type="number"
				name="option_4"
				label="4. Ташкилотда 10 кишидан кам бўлмаган малакали лойиҳачи ва мутахассисларнинг мавжудлиги."
			/>
			<Field
				component={Fields.Select}
				type="number"
				name="option_5"
				label="5. Ташкилотда иш стажи 5 йилдан кам бўлмаган автомобиль йўллари ва кўприкларни лойиҳалаш бўйича 2 та лойиҳа бош мухандиси (ЛБМ) нинг мавжудлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.designerEvaluationSystemFive}
			/>

			<Field
				component={Fields.Input}
				type="number"
				name="option_6"
				label="6. Ташкилотда иш стажи 5 йилдан кам бўлмаган автомобиль йўллари ва кўприкларни лойиҳалаш бўйича 4 та мухандис техник ходимлар мавжудлиги."
			/>
			<Field
				component={Fields.Select}
				name="option_7"
				label="7. Бюджет олдида қарздорлиги йўқлиги тўғрисида маълумотнома мавжудлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.designerEvaluationSystemSeven}
			/>
			<Field
				component={Fields.Input}
				name="option_8"
				type="number"
				label="8. Иштирокчининг тегишли даври учун ходимларнинг ўртача йиллик иш ҳақи жамғармаси."
			/>

			<Field
				component={Fields.Select}
				name="option_9"
				type="number"
				label="9. Ўз айланма маблағлари билан  таъминланганлик коэффициенти 0,2 ва ундан кўп."
				optionValue="value"
				optionLabel="label"
				options={helpers.designerEvaluationSystemNine}
			/>
			<Field component={Fields.Input} name="option_10" type="number" label="10. Иштирокчининг асосий воситалари қолдиқ қиймати." />
			<Field component={Fields.Input} name="option_11" type="number" label="11. Иштирокчининг ўтган йилда фойдаси (солиқ тўлангунга қадар)." />
			<Field
				component={Fields.Input}
				name="option_12"
				type="number"
				label="12. Иштирокчининг сўнгги уч йил давомида ишлаб чиқилган лойиҳа-смета ҳужжатлари сони."
			/>

			<Field
				component={Fields.Switch}
				name="status"
				label="Статус"
				className="text-end mx-auto"
				onChange={() => {
					setFieldValue("status", !values.status);
				}}
			/>

			{is_moderator ? (
				""
			) : (
				<div className="flex justify-end">
					<Button.Outline className="px-10" buttonType="submit" disabled={isSubmitting} loading={isSubmitting}>
						Далее
					</Button.Outline>
				</div>
			)}
		</div>
	);
};

export default StepOneForm;
