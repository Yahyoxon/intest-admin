import React, { useState } from "react";
import { Button, Panel } from "components";
import { groupBy, get } from "lodash";
import { helpers } from "services";
import TicketCols from "./ticketCols";
import TicketColsDoc from "./ticketColsDoc";
import {ReactComponent as CopyIcon} from "assets/images/copy-icon.svg";

import "../../actions/style.scss";
import { useAccess } from "hooks";

const Ticket = ({ item, openCheckModal, hasCheckModal = false, copyHandle, isDocument }) => {
	const [visibleRejectComment, setVisibleRejectComment] = useState(false);

	const getStatusLabel = status => {
		switch (status) {
			case 0:
				return "В модерации";
			case 1:
				return "Одобренный";
			case 2:
				return "Активный";
			case 3:
				return "Отказ";
			default:
				return "-";
		}
	};

	const getStatusColor = status => {
		switch (status) {
			case 0:
				return "after-left_info_span --orange";
			case 1:
				return "after-left_info_span --green";
			case 2:
				return "after-left_info_span --green";
			case 3:
				return "after-left_info_span --red";
			default:
				return "-";
		}
	};

	const status = get(item, "status");
	const full_name = get(item, "user.name");
	const middle_name = get(item, "user.full_name");
	const date = helpers.formatDate(item.created_at);

	const groupedYears = groupBy(item.values, "year");
	const yearsLabel = Object.keys(groupedYears);
	const yearsValue = Object.values(groupedYears);

	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_republic_isp_indicator_excel = useAccess({ roles: ["republic_isp_indicator_excel"] });

	return (
		<Panel className="indicatorResult-panel mb-3">
			<div className="d-flex indicatorResult">
				{is_republic_isp_indicator_excel && (
					<div className="indicatorResult--copy" onClick={() => copyHandle(item)}>
						<CopyIcon/>
					</div>
				)}

				<div className="after-left_info">
					<>
						<div className="reject_comment-wrapper">
							<span className={getStatusColor(status)} onClick={() => {
								if(status === 3){
									setVisibleRejectComment(true)
								}
							}}>{getStatusLabel(status)}</span>

							{status === 3 && (
								<div className={`reject_comment ${visibleRejectComment ? '--show' : ''}`}>
									<span className="modalRefusel-inner-span" onClick={() => setVisibleRejectComment(false)}>
										X
									</span>
									<div className="reject_comment-title">
										Причина отказа
									</div>
									<div className="reject_comment-message">
										{get(item, "reject_comment") ? get(item, "reject_comment") : 'Причина отказа отсутствует'}
									</div>

								</div>
							)}
						</div>


						<div className="after-left_info_date">
							<span>Дата добавления</span>
							<p>{date}</p>
						</div>
						<div className="after-left_info_author">
							<span>Автор</span>
							<p>
								{full_name} <br /> {middle_name}
							</p>
						</div>
						<div className="after-left_info_author mt-10" >
							<span>Модератор</span>
							{get(item, 'moderator') ? (
								<p>{get(item, 'moderator.user.name')} <br/> {get(item, 'moderator.user.full_name')}</p>
							) : <p>-</p>}
						</div>


						{status === 0 && is_moderator && hasCheckModal && (
							<Button.Default type="blue" className="after-left_btn" onClick={() => openCheckModal(item)}>
								Проверка
							</Button.Default>
						)}

						{status === 1 && is_moderator && hasCheckModal && (
							<Button.Default type="blue" className="after-left_btn" onClick={() => openCheckModal(item)}>
								Активировать
							</Button.Default>
						)}
					</>
				</div>
				{isDocument ? (
					<div className="after-right_info">
						{yearsValue.map((value, i) => (
							<TicketColsDoc value={value} year={yearsLabel[i]} key={i}/>
						))}
					</div>
				) : (
					<div className={"after-right_info"}>
						{yearsValue.map((value, i) => (
							<TicketCols value={value} year={yearsLabel[i]} key={i}/>
						))}
					</div>
				)}
			</div>
		</Panel>
	);
};

export default Ticket;