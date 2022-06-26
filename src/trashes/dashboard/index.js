import React, { useEffect, useState } from "react";
import Actions from "modules/entity/actions";
import { Header, Grid, Panel } from "components";
import DropdownNew from "./DropdownNew";
import ResultsChart from "./ResultsChart";
import { useDispatch } from "react-redux";
import { helpers } from "services";
const List = ({ history, location }) => {
	const dispatch = useDispatch();
	const [dashboardData, setDashboardData] = useState();
	const [isLoading, setLoading] = useState(false);
	const [resultData, setResultData] = useState();
	const [resultYear, setResultYear] = useState();
	const [dropdownNow, setDropdownNow] = useState(false);
	const [propertiesData, setPropertiesData] = useState();
	const [propertiesResultData, setPropertiesResultData] = useState();
	const [propertiesYear, setPropertiesYear] = useState();

	const monthData = new Date();
	let currentMonth = helpers.months[monthData.getMonth()];

	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "/feedback/dashboard",
				cb: {
					success: data => {
						setDashboardData(data);
						setLoading(false);
					},
					error: () => {
						setLoading(false);
					}
				},
				params: {
					extra: {
						month: resultData ? resultData : currentMonth.id,
						year: resultYear
					}
				}
			})
		);
		//eslint-disable-next-line
	}, [resultData, setResultData, resultYear, setResultYear]);

	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "/properties/dashboard",
				cb: {
					success: data => {
						setPropertiesData(data);
						setLoading(false);
						console.log(data);
					},
					error: () => {
						setLoading(false);
					}
				},
				params: {
					extra: {
						month: propertiesResultData ? propertiesResultData : currentMonth.id,
						year: propertiesYear
					}
				}
			})
		);
		//eslint-disable-next-line
	}, [propertiesResultData, setPropertiesResultData, propertiesYear, setPropertiesYear]);
	return (
		<>
			<div className="pageContainer">
				<Header title="Dashboard" hasButton={false} />
				<Grid.Row cols={12} className={"my-8"}>
					<Grid.Column xs={12} xl={6}>
						<Panel>
							<ResultsChart
								currentMonth={currentMonth}
								title="Заявления"
								items={dashboardData}
								resultYear={setResultYear}
								resultData={setResultData}
								isFetched={!isLoading}
								className="mt-5 bg-white"
								emptyUiText="Список пусто"
								columns={[
									{
										title: "Рассмотренные заявки",
										dataIndex: "accepted",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "Заявки на рассмотрении",
										dataIndex: "completed",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "Заявки не рассмотрены",
										dataIndex: "rejected",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									}
								]}
							/>

							<DropdownNew items={dashboardData} title="Количество заявок по областям" />
						</Panel>
					</Grid.Column>
					<Grid.Column xs={12} xl={6}>
						<Panel>
							<ResultsChart
								items={propertiesData}
								currentMonth={currentMonth}
								resultYear={setPropertiesYear}
								resultData={setPropertiesResultData}
								isFetched={!isLoading}
								className="mt-5"
								title="Заявления"
								emptyUiText="Список пусто"
								columns={[
									{
										title: "Рассмотренные заявки",
										dataIndex: "active",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "Заявки на рассмотрении",
										dataIndex: "inactive",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "Заявки не рассмотрены",
										dataIndex: "rejected",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									}
								]}
							/>
							<DropdownNew title="Количество заявок по областям" dropdownNow={true} items={propertiesData} />
						</Panel>
					</Grid.Column>
				</Grid.Row>
			</div>
		</>
	);
};

export default List;
