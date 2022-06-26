import React  from "react";
import useNetwork from "./useNetwork";
import WifiAnimation from "./wifiAnimation";
import "./style.scss";

const Index = () => {
	const isOnline = useNetwork();

	return (
		<div className={`no-connection ${isOnline ? '' : '--visible'}`}>
			<div className="no-connection__overlay"/>
			<div className="no-connection__content">
				<div className="no-connection__text">
					No internet. Connection lost.
				</div>
				<div className="no-connection__icon">
					<WifiAnimation/>
				</div>
			</div>
		</div>
	);
};

export default Index;
