import merge from "lodash/merge";
import Actions from "store/actions";


const initialState = {};


/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = initialState, action) => {

	switch (action.type) {

		case Actions.entities.Load.SUCCESS: {
			return merge({}, state, action.payload);
		}

		case Actions.entities.Update.SUCCESS: {
			const { entity, entityId, data } = action.payload;
			return {
				...state,
				[entity]: {
					...state[entity],
					[entityId]: {
						...state[entity][entityId],
						...data
					}
				}
			};
		}

		default:
			return state;
	}

}