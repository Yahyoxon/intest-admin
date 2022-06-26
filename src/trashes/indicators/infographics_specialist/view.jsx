import React, { useEffect, useState } from "react";
import { Button, Modal, NoData, Spinner } from "components";
import Actions from "modules/entity/actions";
import Create from "./components/create";
import CreateDocument from "./components/createDocument";

import { useDispatch } from "react-redux";
import get from "lodash/get";
import EntityContainer from "../../../modules/entity/containers";
import Ticket from "./components/ticket";
import { useAccess } from "../../../hooks";
import CheckModal from "./components/checkModal";
import RejectModal from "./components/rejectModal";

const View = ({ match }) => {
	const [statistic, setStatistic] = useState(null);
	const [isFetched, setFetched] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [createDocumentModal, setCreateDocumentModal] = useState(false);
	const [checkModal, setCheckModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [canUpdate, setUpdate] = useState(false);
	const dispatch = useDispatch();

	const is_republic_isp_indicator_excel = useAccess({ roles: ["republic_isp_indicator_excel"] });

	const id = match.params.id;
	const loadStatistics = () => {
		setFetched(false);
		dispatch(
			Actions.LoadDefault.request({
				url: `/statistics/${id}`,
				params: {
					include: "options"
				},
				cb: {
					success: data => {
						setFetched(true);
						setStatistic(data);
					},
					error: () => { }
				}
			})
		);
	};

	useEffect(() => {
		loadStatistics();
		//eslint-disable-next-line
	}, []);

	const openCheckModal = item => {
		setSelected(item);
		setCheckModal(true);
	};
	const closeCheckModal = () => {
		setCheckModal(false);
		setTimeout(() => {
			setSelected(null);
		}, 500);
	};

	const copyHandle = item => {
		setSelected(item);
		if (get(statistic, "type") === 4) {
			setCreateDocumentModal(true);
		} else {
			setCreateModal(true);
		}
	};

	return (
		<div className="pageContainer">
			<Modal.Default
				size={"xl"}
				header={get(statistic, "title_ru")}
				toggle={createModal}
				setToggle={() => {
					setCreateModal(false);
					setSelected(null);
				}}>
				{createModal && (
					<Create
						{...{ id, setCreateModal, selected, setSelected }}
						options={get(statistic, "options", [])}
						statistic_id={get(statistic, "id")}
						statistic_type={get(statistic, "type")}
					/>
				)}
			</Modal.Default>

			<Modal.Default
				size={"xl"}
				header={get(statistic, "title_ru")}
				toggle={createDocumentModal}
				setToggle={() => {
					setCreateDocumentModal(false);
					setSelected(null);
				}}>
				{createDocumentModal && (
					<CreateDocument
						{...{ id, setCreateDocumentModal, selected }}
						options={get(statistic, "options", [])}
						statistic_id={get(statistic, "id")}
						statistic_type={get(statistic, "type")}
					/>
				)}
			</Modal.Default>

			<Modal.Default className="indicator-modal" toggle={checkModal} setToggle={closeCheckModal}>
				<CheckModal {...{ canUpdate, setUpdate, checkModal, closeCheckModal, selected, id, setRejectModal }} statistic_type={get(statistic, "type")} />
			</Modal.Default>

			<Modal.Default className="modalRefusel" toggle={rejectModal} setToggle={() => setRejectModal(false)}>
				{selected && <RejectModal {...{ setRejectModal, closeCheckModal, selected }} />}
			</Modal.Default>

			{!isFetched && <Spinner className="md" />}
			{isFetched && (
				<>
					<h4 className="font-medium text-xl mb-5">Показатель - {get(statistic, "title_ru")}</h4>

					<div className="d-flex justify-content-between align-items-center mb-5">
						<div className="font-medium">История изменения показателей</div>
						{is_republic_isp_indicator_excel && (
							<Button.Default
								type="blue"
								className="mr-0"
								onClick={() => {
									if (get(statistic, "type") === 4) {
										setCreateDocumentModal(true);
									} else setCreateModal(true);
								}}>
								Добавить
							</Button.Default>
						)}
					</div>
				</>
			)}

			{isFetched && (
				<EntityContainer.All
					entity="statisticsTicket"
					name={`all-${id}`}
					url="/statistics-ticket"
					primaryKey="id"
					canUpdate={canUpdate}
					params={{
						include: "values.option,values.file.file,user,moderator.user",
						sort: "-id",
						limit: 30,
						filter: { statistics_id: match.params.id }
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<div>
								{isFetched &&
									items.map(item => (
										<Ticket
											{...{ item, openCheckModal, copyHandle }}
											hasCheckModal={true}
											key={item.id}
											isDocument={get(statistic, "type") === 4}
										/>
									))}

								{isFetched && items.length < 1 && <NoData text="Этого раздела нет показателов" />}
							</div>
						);
					}}
				</EntityContainer.All>
			)}
		</div>
	);
};

export default View;
