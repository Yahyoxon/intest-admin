import React from "react";
import EntityContainer from "../../../modules/entity/containers";
import Ticket from "../infographics_specialist/components/ticket";
import { NoData } from "../../../components";
import { useParams } from "react-router";

const Index = () => {
	const params = useParams();
	return (
		<div className="mt-5">
			<EntityContainer.All
				entity="statisticsTicket"
				name={`all`}
				url="/statistics-ticket"
				primaryKey="id"
				params={{
					include: 'values.option,user',
					sort: '-id',
					limit: 30,
					filter: {statistics_id: params.id}
				}}
			>
				{({items, isFetched}) => {
					return (
						<div>
							{items.map(item => (
								<Ticket {...{item}} key={item.id}/>
							))}
							{isFetched && items.length < 1 && (
								<NoData text="Этого раздела нет показателов" />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</div>
	);
};

export default Index;