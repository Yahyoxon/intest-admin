import { takeEvery, call, put, all } from "redux-saga/effects";
import { api, queryBuilder, storage } from "services";
import get from "lodash/get";
import authActions from "../actions/auth";

export function* LoginRequest(action) {
	const {
		values: { name, password },
		cb
	} = action.payload;

	try {
		const { data } = yield call(api.request.post, queryBuilder("/user/sign-in"), {
			name,
			password
		});

		if (get(data, "success.token")) {
			yield call(storage.set, "token", data.success.token);

			yield put(authActions.Login.success(data));
		}

		yield call(cb.success, data);
	} catch (error) {
		yield put(
			authActions.Login.failure({
				error
			})
		);

		yield call(cb.error, get(error, "response.data"));
	} finally {
		yield call(cb.finally);
	}
}

export function* RegistrationRequest(action) {
	const { values, cb } = action.payload;

	try {
		const { data } = yield call(api.request.post, queryBuilder("/user/register"), values);

		yield put(authActions.Registration.success(data));

		yield call(cb.success);
	} catch (error) {
		yield put(
			authActions.Registration.failure({
				error
			})
		);

		yield call(cb.error, get(error, "response.data"));
	} finally {
		yield call(cb.finally);
	}
}

export function* GetMeRequest() {
	try {
		const { data } = yield call(api.request.get, queryBuilder("/user/get-me"));

		yield put(
			authActions.GetMe.success({
				data
			})
		);
	} catch (error) {
		yield put(
			authActions.GetMe.failure({
				error
			})
		);
	}
}

export function* LogoutRequest() {
	yield call(storage.remove, "token");
}

export default function* root() {
	yield all([
		takeEvery(authActions.Registration.REQUEST, RegistrationRequest),
		takeEvery(authActions.Login.REQUEST, LoginRequest),
		takeEvery(authActions.GetMe.TRIGGER, GetMeRequest),
		takeEvery(authActions.Logout.REQUEST, LogoutRequest)
	]);
}
