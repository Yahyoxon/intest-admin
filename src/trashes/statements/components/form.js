import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Field } from "formik";
import { get } from "lodash";
import Modal from "components/Modal";
import { Avatar, Fields } from "components";

import MapComponent from "../map";

const Form = ({ values, item, files }) => {
	const [acceptModal, showAcceptModal] = useState(false);
	const acceptApp = () => {};
	return (
		<div>
			<Modal.Confirm
				type="success"
				title="Вы действительно хотите завершить?"
				toggle={acceptModal}
				setToggle={showAcceptModal}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => acceptApp(item.id)}
			/>
			<div className="feedback-single">
				<div className="feedback-single__left">
					<Field component={Fields.Input} name="name" type="text" placeholder="Введите ваше имя" label="Имя" disabled={true} />
					<Field component={Fields.InputMask} name="phone" placeholder="Введите ваш телефон" label="Телефон номер" disabled={true} />
					<Field component={Fields.Input} name="email" placeholder="Введите вашу почту" label="Почта" disabled={true} />
					<Field
						component={Fields.AsyncSelect}
						name={`region_id`}
						label="Регион"
						isDisabled={true}
						placeholder="Регион"
						isSearchable={true}
						isClearable={true}
						loadOptionsUrl={`/regions`}
						optionLabel="name_ru"
						loadOptionsParams={search => {
							return {
								extra: { name: search },
								sort: "-id"
							};
						}}
					/>
					<Field
						component={Fields.AsyncSelect}
						name={`district_id`}
						label="Район"
						isDisabled={true}
						placeholder="Укажите Район"
						isSearchable={true}
						loadOptionsUrl={`/districts`}
						optionLabel="name_ru"
						filterParams={{
							region_id: get(values, "region_id.id")
						}}
						loadOptionsParams={search => {
							return {
								extra: { name: search },
								sort: "-id"
							};
						}}
					/>
					<Field component={Fields.Textarea} rows={5} name="message" placeholder="Комментария" label="Комментария" disabled={true} />
				</div>
				<div className="feedback-single__right">
					<div className="mb-10">
						<div className="form-label">Таъмирга муҳтож манзил</div>
						<div style={{ width: "100%", height: "300px" }}>
							<MapComponent data={item ? item : null} />
						</div>
					</div>
					<div>
						<div className="form-label">Фото</div>
						<div className="d-flex flex-wrap">
							{files &&
								files.map(file => (
									<Avatar size="lg" zoomIn={false} className="avatar--rectangle" isProduct src={get(file, "thumbnails.small.src")} />
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Form);
