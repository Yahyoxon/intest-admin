import React, { useState } from "react";
import cx from "classnames";
import "./style.scss";

const AccordionComponent = ({ className, boxed = false, accordions }) => {
	const classNames = cx("accordion", boxed && "accordion-boxed", className && className);
	const [accordion, setAccordion] = useState(false);
	const [id, setId] = useState(-1);

	return (
		<div className={classNames}>
			{accordions &&
				accordions.map(item => (
					<div
						key={item.id}
						className="accordion-item"
						onClick={() => {
							setAccordion(!accordion);
							if (accordion) setId(-1);
							else setId(item.id);
						}}>
						<div className="accordion-header">
							<button className={`accordion-button ${accordion && id === item.id ? "" : "collapsed"}`} type="button">
								{item.title}
							</button>
						</div>
						<div className={`accordion-collapse collapse ${accordion && id === item.id ? "show" : ""}`}>
							<div className="accordion-body text-gray-700 dark:text-gray-600 leading-relaxed">{item.text}</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default AccordionComponent;
