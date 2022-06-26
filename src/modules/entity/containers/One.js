import { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { compose } from "recompose";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";

import Actions from "../actions";
import Selectors from "../selectors";

export class One extends Component {

	static propTypes = {
		id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
		entity: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		url: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]).isRequired,
		params: PropTypes.object,
		initialLoad: PropTypes.bool,
		primaryKey: PropTypes.string,
		relations: PropTypes.object,
		onSuccess: PropTypes.func,
		onError: PropTypes.func
	};

	static defaultProps = {
		initialLoad: true,
		primaryKey: "id",
		onSuccess: () => {},
		onError: () => {},
	};

	componentDidMount(){
		const { id, entity, name, url, params, initialLoad, primaryKey, relations, onSuccess, onError } = this.props;
		if(initialLoad){
			this.Load(id, entity, name, url, params, primaryKey, relations, onSuccess, onError);
		}
	}

	componentDidUpdate(prevProps){
		const { id, entity, name, url, params, primaryKey, relations, onSuccess, onError } = this.props;
		if(!isEqual(id, prevProps.id) || !isEqual(url, prevProps.url) || !isEqual(params, prevProps.params)){
			this.Load(id, entity, name, url, params, primaryKey, relations, onSuccess, onError);
		}
	}

	Load = (id, entity, name, url, { fields = [], include = [], extra = {} } = {}, primaryKey, relations, onSuccess, onError) => {
		const { LoadOne } = this.props;
		LoadOne({
			id,
			entity,
			name,
			url,
			params: { fields, include, extra },
			primaryKey,
			relations,
			cb: {
				success: (data) => {
					onSuccess(data);
				},
				error: (error) => {
					onError(error);
				}
			}
		});
	};

	render(){

		const { item, isFetched, children } = this.props;

		return children({ item, isFetched });
	}
}

const mapStateToProps = () => {
	const getOne = Selectors.getOne();
	return (state, props) => {
		const { item, isFetched } = getOne(state, props);
		return ({ item, isFetched });
	};
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
	{
		LoadOne: Actions.LoadOne.request
	},
	dispatch
);

export default compose(
	connect(mapStateToProps, mapDispatchToProps)
)(One);