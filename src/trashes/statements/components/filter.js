import React, { Component } from "react";
import qs from "qs";
import { Field, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";
import { helpers } from "services";

class Filter extends Component {
	render() {
		const { handleSubmit, t } = this.props;

		return (
			<div>
				{/* <h1 onClick={() => setFilter(!setFilter)}>X</h1> */}
				<Grid.Row gutterY={0} className="mb-5">
					<Grid.Column xs={12} className="mb-5">
						<h2 className="text-xl font-medium">{t("Фильтровать список")}</h2>
					</Grid.Column>
					<Grid.Column xs={12}>
						<Field component={Fields.Input} name="name" placeholder="Поиск" containerClass="mb-0" />
					</Grid.Column>
					<Grid.Column xs={12}>
						<Field
							component={Fields.Select}
							name="role"
							placeholder="Фильтровать по ролям"
							options={helpers.usersRole}
							optionLabel="name"
							optionValue="value"
							isClearable={true}
							className="mb-0"
						/>
					</Grid.Column>
					<Grid.Column xs={12}>
						<Field
							component={Fields.Select}
							name="status"
							placeholder="Фильтровать по статусу"
							options={helpers.userStatus}
							optionLabel="name"
							isClearable={true}
							className="mb-0"
						/>
					</Grid.Column>
					<Grid.Column className="flex justify-end mt-5">
						<Button.Default type="blue" buttonType="submit" className="ml-2" onClick={handleSubmit}>
							{t("Фильтровать")}
						</Button.Default>
					</Grid.Column>
				</Grid.Row>
			</div>
		);
	}
}

Filter = withFormik({
	enableReinitialize: true,

	mapPropsToValues: ({ location, lang }) => {
		const params = qs.parse(location.search, { ignoreQueryPrefix: true });
		return {
			name: params.name,
			role: params.role,
			status: params.status
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		values = { ...values };
		const query = qs.parse(location.search);

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});

		setFilter(false);
		history.push({ search: qs.stringify(values, { encode: false }) });
	}
})(Filter);

export default withRouter(withTranslation("main")(Filter));
