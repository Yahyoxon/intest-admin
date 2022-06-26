import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import qs from "query-string";

import { Icon, Fields } from "..";
import "./style.scss";

const PaginationComponent = ({ history, location, limit = 20, pageCount = 1, perPage = "10", currentPage, className = "", handlePageClick }) => {
	const { t } = useTranslation();
	const query = qs.parse(location.search);
	const [pageLimit, setPageLimit] = useState({ id: 2, value: limit });

	const options = [
		{
			id: 1,
			value: "10"
		},
		{
			id: 2,
			value: "20"
		},
		{
			id: 3,
			value: "40"
		},
		{
			id: 4,
			value: "50"
		},
		{
			id: 5,
			value: "60"
		},
		{
			id: 6,
			value: "80"
		},
		{
			id: 7,
			value: "100"
		}
	];

	const handlePageLimit = (limit) => {
		history.push({
			search: qs.stringify({
				"page-limit": limit.value
			})
		});
		setPageLimit(limit);
	};

	useEffect(() => {
		if (query["page-limit"]) {
			const _limit = options.find(item => item.value === query["page-limit"]);
			setPageLimit(_limit);
		} else {
			const _limit = options.find(item => item.value === String(limit));
			setPageLimit(_limit);
		}
		// eslint-disable-next-line
	}, [limit, JSON.stringify(options)]);

	return (
		<div className={`pagination col-span-12 flex align-center justify-between mt-10 mb-10 sm:flex-row ${className}`}>
			<div className="page-size d-flex align-center">
				<div>{t("Лимит по списку")}</div>
				<Fields.Dropdown
					items={options}
					initialValue={pageLimit}
					setValue={handlePageLimit}
					optionLabel="value"
					optionValue="value"
					className="ml-5 mt-3"
				/>
			</div>
			<div className="flex align-center">
				<div className="pagination__link cursor-pointer" onClick={() => handlePageClick(0)}>
					<Icon name="chevrons-left" className="w-5 h-5" />
				</div>
				<ReactPaginate
					initialPage={currentPage - 1}
					forcePage={currentPage - 1}
					previousLabel={
						<div className="pagination__link">
							<Icon name="chevron-left" className="w-5 h-5" />
						</div>
					}
					nextLabel={
						<div className="pagination__link">
							<Icon name="chevron-right" className="w-5 h-5" />
						</div>
					}
					containerClassName={"pagination"}
					pageLinkClassName={"pagination__link"}
					activeLinkClassName={"pagination__link--active"}
					breakLinkClassName={"pagination__link"}
					pageCount={pageCount}
					marginPagesDisplayed={1}
					pageRangeDisplayed={2}
					onPageChange={(data) => handlePageClick(data.selected)}
					disableInitialCallback={true}
				/>
				<div className="pagination__link cursor-pointer" onClick={() => handlePageClick(pageCount - 1)}>
					<Icon name="chevrons-right" className="w-5 h-5" />
				</div>
			</div>
		</div>
	);
};

export default withRouter(PaginationComponent);
