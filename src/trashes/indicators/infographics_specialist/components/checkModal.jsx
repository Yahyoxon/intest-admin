import React, { useEffect, useState } from "react";
import { Button, NoData } from "components";
import "../../actions/style.scss";
import Ticket from "./ticket";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";

export default function CheckModal({canUpdate, setUpdate, checkModal, closeCheckModal, selected, id, setRejectModal, statistic_type}) {
	const dispatch = useDispatch();
	const [submittingApprove, setSubmittingApprove] = useState(false)
	const [before, setBefore] = useState(null);

	const afterBtn = [
		{ value: 1, name: "Before" },
		{ value: 2, name: "After" }
	];
	const [btnAfter, setBtnAfter] = useState(afterBtn[1]);

	const approve = () => {
		setSubmittingApprove(true)
		dispatch(Actions.Form.request({
			method: 'post',
			url: `/statistics-ticket/approve/${selected.id}`,
			entity: 'statisticsTicket',
			name: 'all',
			updateData: true,
			normalizeData: data => data,
			primaryKey: "id",
			id: selected.id,
			params: {
				include: 'values.option,values.file.file,user,moderator.user'
			},
			cb: {
				success: () => {
					setUpdate(!canUpdate)
					closeCheckModal()
				},
				error: () => {},
				finally: () => {
					setSubmittingApprove(false)
				},
			}
		}))
	}

	const loadBeforeTicket = () => {
		dispatch(Actions.LoadDefault.request({
			url: `/statistics-ticket/before/${id}`,
			params: {
				include: 'values.option,user,values.file.file'
			},
			cb: {
				success: (data) => {
					setBefore(data)
				},
				error: () => {}
			}
		}))
	}

	useEffect(() => {
		if(checkModal){
			loadBeforeTicket()
		}
		//eslint-disable-next-line
	}, [checkModal])

	return (
		<>
			<div className="d-flex justify-content-center">
				<div>
					{afterBtn &&
						afterBtn.length > 0 &&
						afterBtn.map((item, i) => (
							<Button.Default
								key={i}
								className={`indicatorResultTabBtn ${item.value === btnAfter.value ? "active" : ""}`}
								onClick={() => setBtnAfter(item)}>
								{item.name}
							</Button.Default>
						))}
				</div>
			</div>
			<span className="modalRefusel-inner-span" onClick={() => closeCheckModal()}>X</span>
			{btnAfter.value === 1 && (
				<div>
					{before ? (
						<Ticket item={before} isDocument={statistic_type === 4}/>
					) : (
						<NoData text="Этого алиасе нет меню" />
					)}
				</div>
			)}

			{(btnAfter.value === 2 && selected) && (
				<div>
					<Ticket item={selected} isDocument={statistic_type === 4}/>
				</div>
			)}

			<div className="text-right">
				<Button.Default
					type={"blue"}
					className="all-btn"
					loading={submittingApprove}
					disabled={submittingApprove}
					onClick={approve}
				>
					Подтвердить
				</Button.Default>
				<Button.Outline className="all-btn indicatorResultModalBtnRed mr-0 mt-5" onClick={() => setRejectModal(true)}>
					Отказать
				</Button.Outline>
			</div>
		</>
	);
}
