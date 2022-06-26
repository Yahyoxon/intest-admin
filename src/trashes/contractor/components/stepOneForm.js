import React from "react";
import { Fields, Button } from "components";
import { Field } from "formik";
import { helpers } from "services";
import { useAccess } from "hooks";

const StepOneForm = ({ values, setFieldValue, isSubmitting }) => {
	const is_moderator = useAccess({ roles: ["moderator"] });
	return (
		<div className="mt-5 shadow-none">
			<Field component={Fields.Input} name="name" type="text" placeholder="Введите вашу почту" label="Имя компании" />
			<Field component={Fields.Input} name="inn" type="number" placeholder="Введите вашу почту" label="ИНН" />
			<Field
				component={Fields.Select}
				name="option_1"
				label="1. Шартномавий режанинг ўз вақтида бажарилганлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.evaluationSystemOne}
			/>
			<Field
				component={Fields.Select}
				name="option_2"
				label="2. Объектларнинг ўз вақтида фойдаланишга топширилганлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.evaluationSystemTwo}
			/>
			<Field component={Fields.Input} type="number" name="option_3" label="3. Охирги 3 йилликда  йўл объектларида ўз кучи билан бажарган иш ҳажми." />
			<Field component={Fields.Input} type="number" name="option_4" label="4. Йўл қурилиш ишларидаги тажрибаси." />
			<Field component={Fields.Input} type="number" name="option_5" label="5. Ўтган йилдаги фойдаси (солиқ тўлангунга қадар)." />

			<Field
				component={Fields.Select}
				name="option_6"
				label="6. Ўз айланма маблағлари билан  таъминланганлик коэффициенти 0,2 ва ундан кўп."
				optionValue="value"
				optionLabel="label"
				options={helpers.evaluationSystemSix}
			/>
			<Field
				component={Fields.Select}
				name="option_7"
				label="7. Лойиҳани бажариш учун зарур бўлган 17 та дан кам бўлмаган охирги 15 йилликда ишлаб чиқарилган   қурилиш махсус машина ва механизмларининг мавжудлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.evaluationSystemSeven}
			/>
			<Field
				component={Fields.Input}
				name="option_8"
				type="number"
				label="8. Назорат органлари томонидан объектларда йўл қўйилган камчиликлар тўғрисида расмийлаштирилган далолатномалар сони."
			/>

			<Field
				component={Fields.Input}
				name="option_9"
				type="number"
				label="9. Муддати ўтган кредиторлик, солиқ ва бошқа қарздорликларнинг корхона активига нисбатан фоизи."
			/>
			<Field
				component={Fields.Select}
				name="option_10"
				label="10. Кўприкларни қуриш ва таъмирлаш фаолияти бўйича лицензияси мавжудлиги."
				optionValue="value"
				optionLabel="label"
				options={helpers.evaluationSystemTen}
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
					<Button.Outline className="px-10" disabled={isSubmitting} buttonType="submit" loading={isSubmitting}>
						Далее
					</Button.Outline>
				</div>
			)}
		</div>
	);
};

export default StepOneForm;
