import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { normalize } from "normalizr";
import get from "lodash/get";

import { api, queryBuilder } from "services";
import Actions from "store/actions";
import EntitySchema from "./schema";

export function* LoadAll(action) {
	const { entity, name, url, params, dataKey, metaKey, appendData, prependData, primaryKey, cb } = action.payload;

	try {
		const { data } = yield call(api.request.get, queryBuilder(url, params));

		const normalized = normalize(typeof dataKey === "function" ? dataKey(data) : data[dataKey], [EntitySchema(entity, primaryKey)]);

		yield put(Actions.entities.Load.success(normalized.entities));

		yield put(
			Actions.entity.LoadAll.success({
				ids: normalized.result,
				entity,
				name,
				appendData,
				prependData,
				params,
				meta:
					typeof metaKey === "function"
						? metaKey(data)
						: {
								currentPage: data.current_page,
								pageCount: data.last_page,
								perPage: data.per_page,
								totalCount: data.total
						  }
			})
		);

		yield call(cb.success, data);
	} catch (error) {
		yield put(
			Actions.entity.LoadAll.failure({
				entity,
				name,
				error
			})
		);

		yield call(cb.error, error);
	}
}

export function* LoadOne(action) {
	const { id, entity, name, url, params, primaryKey, cb, relations } = action.payload;

	try {
		const { data } = yield call(api.request.get, queryBuilder(url, params));

		let normalized = normalize(data, EntitySchema(entity, primaryKey, relations));

		if (primaryKey === id) {
			normalized = normalize({ [primaryKey]: id, ...data }, EntitySchema(entity, primaryKey, relations));
		}
		yield put(Actions.entities.Load.success(normalized.entities));

		yield put(
			Actions.entity.LoadOne.success({
				entity,
				name,
				params,
				id: id ? id : normalized.result
			})
		);

		yield call(cb.success, data);
	} catch (error) {
		yield put(
			Actions.entity.LoadOne.failure({
				entity,
				name,
				error
			})
		);

		yield call(cb.error, error);
	}
}

export function* LoadDefault(action) {
	const { url, params, cb, ...otherProps } = action.payload;

	try {
		const { data } = yield call(api.request.get, queryBuilder(url, params), otherProps);

		yield call(cb.success, data);
	} catch (error) {
		yield put(
			Actions.entity.LoadDefault.failure({
				error
			})
		);

		yield call(cb.error, get(error, "response.data", []));
	}
}

export function* Form(action) {
	const {
		id,
		entity,
		name,
		url,
		params,
		method,
		primaryKey,
		isMulti,
		values,
		appendData,
		prependData,
		updateData,
		deleteData,
		normalizeData,
		cb
	} = action.payload;

	try {
		const { data } = yield call(api.request[method], queryBuilder(url, params), values);

		if (normalizeData) {
			const normalized = normalize(
				typeof normalizeData === "function" ? normalizeData(data) : data[normalizeData],
				isMulti ? [EntitySchema(entity, primaryKey)] : EntitySchema(entity, primaryKey)
			);

			yield put(Actions.entities.Load.success(normalized.entities));

			yield put(
				Actions.entity.Form.success({
					id: normalized.result,
					entity,
					name,
					appendData,
					prependData,
					updateData,
					deleteData
				})
			);
		} else {
			yield put(
				Actions.entity.Form.success({
					id,
					entity,
					name,
					appendData,
					prependData,
					updateData,
					deleteData
				})
			);
		}

		yield call(cb.success, data);
	} catch (error) {
		yield put(
			Actions.entity.Form.failure({
				id,
				entity,
				name,
				error
			})
		);

		yield call(cb.error, get(error, "response.data", []));
	} finally {
		yield call(cb.finally);
	}
}

export function* FormDefault(action) {
	const { url, params, method, values, cb } = action.payload;

	try {
		const { data } = yield call(api.request[method], queryBuilder(url, params), values);

		if (cb.success) {
			yield call(cb.success, data);
		}
	} catch (error) {
		yield put(
			Actions.entity.FormDefault.failure({
				error
			})
		);

		if (cb.error) {
			yield call(cb.error, get(error, "response.data", []));
		}
	} finally {
		if (cb.finally) {
			yield call(cb.finally);
		}
	}
}

export function* Append(action) {
	const { entity, name, params, appendIds, prependIds, primaryKey, relations, data } = action.payload;
	try {
		const normalized = normalize(data, [EntitySchema(entity, primaryKey, relations)]);
		yield put(Actions.entities.Load.success(normalized.entities));

		yield put(
			Actions.entity.Append.success({
				entity,
				name,
				appendIds,
				prependIds,
				params,
				ids: normalized.result,
				meta: data._meta
			})
		);
	} catch (error) {
		yield put(
			Actions.entity.LoadAll.failure({
				entity,
				name,
				error
			})
		);
	}
}

export default function* root() {
	yield all([
		takeEvery(Actions.entity.LoadAll.REQUEST, LoadAll),
		takeEvery(Actions.entity.LoadOne.REQUEST, LoadOne),
		takeEvery(Actions.entity.LoadDefault.REQUEST, LoadDefault),
		takeLatest(Actions.entity.Form.REQUEST, Form),
		takeLatest(Actions.entity.FormDefault.REQUEST, FormDefault),
		takeEvery(Actions.entity.Append.REQUEST, Append)
	]);
}
