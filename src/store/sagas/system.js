import { takeLatest, put, all, call } from "redux-saga/effects";

import { storage } from "services";
import systemActions from "../actions/system";
import { api, queryBuilder } from "services";

function* ChangeLanguage(action) {
	storage.set("language", action.payload);
	yield put(systemActions.ChangeLanguage.success());
}

function* ChangeTheme(action) {
	storage.set("theme", action.payload);
	yield put(systemActions.ChangeTheme.success());
}

function* DeleteFile(action) {
	const { id, cb } = action.payload;

	try {
		yield put(systemActions.DeleteFile.request());
		const { data } = yield call(
			api.request.delete,
			queryBuilder(`/filemanager/${id}`)
		);
		yield put(systemActions.DeleteFile.success({ files: data }));
		yield call(cb.success, data);
	} catch (e) {
		yield put(systemActions.DeleteFile.failure(e));
		yield call(cb.failure, e);
	} finally {
		yield put(systemActions.DeleteFile.fulfill());
		yield call(cb.finally);
	}
}

function* UploadFile(action) {

	const {files, cb, load = () => {}} = action.payload;
	try {
		const { data } = yield call(api.request.post, queryBuilder("/filemanager/uploads"), files, {
			onUploadProgress: progressEvent => load(progressEvent.total, progressEvent.loaded)
		});

		yield call(cb.success, data);

	} catch (e) {
		yield put(systemActions.UploadFile.failure(e));
		yield call(cb.failure, e.response.data);

	} finally {
		yield put(systemActions.UploadFile.fulfill());
		yield call(cb.finally);
	}
}



export default function* root() {
	yield all([
		takeLatest(systemActions.ChangeLanguage.TRIGGER, ChangeLanguage),
		takeLatest(systemActions.ChangeTheme.TRIGGER, ChangeTheme),
		takeLatest(systemActions.UploadFile.TRIGGER, UploadFile),
		takeLatest(systemActions.DeleteFile.TRIGGER, DeleteFile)
	]);
}
