import { createStore, compose, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

import middlewares, { sagaMiddleware } from "./middlewares";


/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (initialState = {}) => {

	let store;

	if(process.env.NODE_ENV === "production"){

		store = createStore(
			rootReducer,
			initialState,
			compose(applyMiddleware(...middlewares))
		);

	} else {

		store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

	}

	sagaMiddleware.run(rootSaga);

	if(module.hot){
		module.hot.accept("./reducers", () => {
			store.replaceReducer(require("./reducers/index").default);
		});
	}

	return store;

};