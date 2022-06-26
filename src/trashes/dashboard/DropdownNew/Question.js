import React, { useState } from "react";
import { Icon } from "../../../components";
export default function Question({ item, dropdownNow }) {
	const [showInfo, setShowInfo] = useState(null);
	function toggle(id) {
		if (showInfo === id) {
			return setShowInfo(null);
		}

		setShowInfo(id);
	}
	return (
		<>
			<div className={showInfo ? `question-dropdown` : "question-dropdown"}>
				<div>
					<div className={showInfo === item.id ? `question-header active` : "question-header"} onClick={() => (dropdownNow ? "" : toggle(item.id))}>
						<>
							<div className="question-header-left">
								<span>
									{dropdownNow ? (
										<Icon name="minus" />
									) : showInfo === item.id ? (
										<Icon name="chevron-down" strokeColor="#367BF5" />
									) : (
										<Icon name="chevron-right" strokeColor="#78909C" />
									)}
								</span>
								<h4>{item.region_name ? item.region_name : item.region}</h4>
							</div>
							<div className="question-header-right">
								<p>{item.feedback_count ? item.feedback_count : item.count}</p>
							</div>
						</>
					</div>

					{showInfo === item.id &&
						item.districts.map((item, id) => (
							<div className="question-inner" key={id}>
								<h1>{item.name_uz}</h1>
								<span>{item.feedbacks_count}</span>
							</div>
						))}
				</div>
			</div>
		</>
	);
}
