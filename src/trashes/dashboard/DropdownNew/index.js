import React from "react";
import Question from "./Question";
import "./style.scss";

const DropdownNew = ({ items = [], title = "", menuDropdown = false, dropdownNow }) => {
	return (
		<div className="dropdownNew">
			<span className="dropdownNew-border"></span>
			{/* {items.length ? items[0].dashboard.map((item, i) => <p className="dropdown-title">{item.region_name}</p>) : "Malumot Yoq"} */}
			<p className="dropdown-title">{title}</p>
			{items.dashboard ? items.dashboard.map((item, i) => <Question key={i} {...{ item, menuDropdown, dropdownNow }} />) : <h1>Malumot Yoq</h1>}
		</div>
	);
};
export default DropdownNew;
