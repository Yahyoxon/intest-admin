import requireContext from "require-context.macro";
import { combineReducers } from "redux";
import { importAll } from "store/utils";

const moduleReducers = importAll(requireContext("modules", true, /\/reducers.js$/), "reducers.js");
const reducers = importAll(requireContext(".", true, /^\.\/(?!index)\w+$/), ".js");

const rootReducer = combineReducers({
	...moduleReducers,
	...reducers
});

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state, action) => (
	action.type === "RESET/TRIGGER" ? rootReducer({system: state.system}, action) : rootReducer(state, action)
)