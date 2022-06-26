import React, { Component } from "react";
import { Field, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import qs from "qs";

import { Fields, Grid, Button } from "components";

class Filter extends Component {
	render() {
		const { handleSubmit, t, history } = this.props;
		const clearForm = () => {
			history.push({
				search: qs.stringify({}, { encode: false })
			});
		};
		return (
			<>
				<Grid.Row gutterY={0} className="mt-5">
					<Grid.Column xs={12} lg={6} xl={4}>
						<Field component={Fields.Input} name="subsidy" placeholder="Поиск по субсидиям" label="Субсидия" />
					</Grid.Column>
					<Grid.Column xs={12} lg={6} xl={4}>
						<Field component={Fields.Input} name="percent" placeholder="Поиск по процент" label="Процент" />
					</Grid.Column>
					<Grid.Column xs={12} lg={6} xl={4}>
						<Field component={Fields.Input} name="limit" placeholder="Поиск по лимит" label="Лимит" />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column className="flex justify-end mt-0">
						<Button.Default type="secondary" onClick={clearForm}>
							{t("Очитстить фильтр")}
						</Button.Default>
						<Button.Default type="blue" buttonType="submit" className="ml-2" onClick={handleSubmit}>
							{t("Фильтровать")}
						</Button.Default>
					</Grid.Column>
				</Grid.Row>
			</>
		);
	}
}

Filter = withFormik({
	enableReinitialize: true,
	mapPropsToValues: ({ location, lang }) => {
		const params = qs.parse(location.search, { ignoreQueryPrefix: true });

		return {
			subsidy: params.subsidy || "",
			percent: params.percent || "",
			limit: params.limit || ""
		};
	},
	handleSubmit: (values, { props: { location, history, lang } }) => {
		values = {
			...values
		};
		const query = qs.parse(location.search);

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});

		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(Filter));
