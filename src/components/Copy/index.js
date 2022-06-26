import React from "react";

import { Button } from "components";
import { useNotification } from "hooks";

const CopyToClipboard = ({ str, isVisible = true }) => {
	const { notification } = useNotification();
	const copyToClipboard = str => {
		var input = document.createElement("input");
		input.value = str;
		document.body.appendChild(input);
		input.select();
		document.execCommand("copy");
		document.body.removeChild(input);

		notification("Скопировано в буфер обмена", {
			type: "success"
		});
	};
	return (
		<div className="d-flex align-items-center">
			{isVisible && str}
			<Button.Icon type="secondary" size="sm" iconName="copy" className="w-10 ml-2 mb-0" onClick={() => copyToClipboard(str)} />
		</div>
	);
};
export default CopyToClipboard;
