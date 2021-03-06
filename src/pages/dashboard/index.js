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
								title="??????????????????"
								items={dashboardData}
								resultYear={setResultYear}
								resultData={setResultData}
								isFetched={!isLoading}
								className="mt-5 bg-white"
								emptyUiText="???????????? ??????????"
								columns={[
									{
										title: "?????????????????????????? ????????????",
										dataIndex: "accepted",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "???????????? ???? ????????????????????????",
										dataIndex: "completed",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "???????????? ???? ??????????????????????",
										dataIndex: "rejected",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									}
								]}
							/>

							<DropdownNew items={dashboardData} title="???????????????????? ???????????? ???? ????????????????" />
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
								title="??????????????????"
								emptyUiText="???????????? ??????????"
								columns={[
									{
										title: "?????????????????????????? ????????????",
										dataIndex: "active",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "???????????? ???? ????????????????????????",
										dataIndex: "inactive",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									},
									{
										title: "???????????? ???? ??????????????????????",
										dataIndex: "rejected",
										className: "w-4 text-center",
										render: value => <>{value && value.percentage}</>
									}
								]}
							/>
							<DropdownNew title="???????????????????? ???????????? ???? ????????????????" dropdownNow={true} items={propertiesData} />
						</Panel>
					</Grid.Column>
				</Grid.Row>
			</div>
		</>
	);
};

export default List;
