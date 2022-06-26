import React, { Component } from "react";
import { icons } from "./icons";

class IconInner extends Component {
	createMarkup(markup) {
		return { __html: markup };
	}

	render() {
		const { name } = this.props;
		const iconMarkup = icons.filter(icon => icon.key === name)[0];

		if (iconMarkup) {
			return <g dangerouslySetInnerHTML={this.createMarkup(iconMarkup.value)} />;
		}
		return null;
	}
}

export default IconInner;
