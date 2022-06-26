import Actions from "./actions";
import get from "lodash/get";
import uniq from "lodash/uniq";
import isEqual from "lodash/isEqual";
import isArray from "lodash/isArray";

const initialState = {
	all: {
		ids: [],
		isFetched: false,
		meta: {}
	}
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = initialState, action) => {

	switch (action.type){

		case Actions.LoadAll.REQUEST:{
			const { entity, name } = action.payload;
			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						isFetched: false
					}
				}
			};
		}

		case Actions.LoadAll.SUCCESS:{
			const { entity, name, ids, meta, appendData, prependData, params: { page, ...params }, infiniteScroll } = action.payload;

			const isNewParams = !isEqual(params, get(state, `${entity}.${name}.params`, {}));

			const prevIds = get(state, `${entity}.${name}.ids`, []);
			const stateCurrentPage = get(state, `${entity}.${name}.meta.currentPage`, 1);
			const nextIds = isNewParams ? [ ...ids ] : (appendData ? [...prevIds, ...ids] : prependData ? [...ids, ...prevIds] : [ ...ids ]);

			let newMeta = {};
			if(meta){
				newMeta = {
					...meta,
					currentPage:
						!infiniteScroll ||
						isNewParams ||
						meta.currentPage > stateCurrentPage
							? meta.currentPage
							: stateCurrentPage
				}
			}

			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						ids: uniq(nextIds),
						meta: newMeta,
						params,
						isFetched: true
					}
				}
			};
		}

		case Actions.LoadAll.FAILURE:{
			const { entity, name, error } = action.payload;
			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						error,
						isFetched: true
					}
				}
			};
		}

		case Actions.LoadOne.REQUEST:{
			const { entity, name } = action.payload;

			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[`${name}`]: {
						...get(state, `${entity}.${name}`, {}),
						isFetched: false
					}
				}
			};
		}

		case Actions.LoadOne.SUCCESS:{
			const { id, entity, name } = action.payload;
			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[`${name}`]: {
						...get(state, `${entity}.${name}`, {}),
						id,
						isFetched: true
					}
				}
			};
		}

		case Actions.LoadOne.FAILURE:{
			const { entity, name, error } = action.payload;
			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[`${name}`]: {
						...get(state, `${entity}.${name}`, {}),
						error,
						isFetched: true
					}
				}
			};
		}

		case Actions.Form.REQUEST: {

			const { entity, name } = action.payload;

			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						isFetched: false
					}
				}
			}
		}

		case Actions.Form.SUCCESS: {

			const { id, entity, name, appendData, prependData, updateData, deleteData } = action.payload;

			let newIds = isArray(id) ? [ ...id ] : [ id ];

			const prevIds = get(state, `${entity}.${name}.ids`, []);
			const nextIds = appendData ? [ ...prevIds, ...newIds ] : prependData ? [ ...newIds, ...prevIds ] : [ ...newIds ];

			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						isFetched: true,
						ids: updateData ? prevIds : (deleteData ? prevIds.filter(sid => sid !== id) : uniq(nextIds))
					}
				}
			};
		}

		case Actions.Form.FAILURE: {

			const { entity, name, error } = action.payload;

			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						error,
						isFetched: true
					}
				}
			};
		}

		case Actions.Append.SUCCESS:{
			const { entity, name, ids } = action.payload;

			const prevIds = get(state, `${entity}.${name}.ids`, []);
			const nextIds = [...ids, ...prevIds];

			return {
				...state,
				[entity]: {
					...get(state, entity, {}),
					[name]: {
						...get(state, `${entity}.${name}`, {}),
						ids: uniq(nextIds),
						isFetched: true
					}
				}
			};
		}

		default:
			return state;
	}
}