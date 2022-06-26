import React, { useState } from "react";

import { Tab, Header } from "components";

// Tab Components
import Main from "./main";
import Actions from "./actions";

const View = ({ match }) => {
	const { id } = match.params;
	const [activeTab, setActiveTab] = useState(1);

	const tabsItems = [
		{ code: 1, title: "Основные " },
		{ code: 2, title: "Действия" }
	];

	return (
		<div className="pageContainer">
			<Header title={`Показател - ${id}`} hasButton={false} hasSearch={false} hasFilter={false} backBtn={true} />
			<Tab items={tabsItems} activeTab={activeTab} onChange={tab => setActiveTab(tab.code)} className="mt-5" />
			<>
				{activeTab === 1 && <Main {...{ id }} />}
				{activeTab === 2 && <Actions />}
			</>
		</div>
	);
};

export default View;
