import storageActions from "../actions/storage";

const initialState = {};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = initialState, action) => {
	switch (action.type) {
		case storageActions.SAVE_TEMPRORY_DATA.SUCCESS:
			return action.payload;
		default:
			return state;
	}
};
