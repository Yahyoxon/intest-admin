import { createSelector } from "reselect";
import { denormalize } from "normalizr";
import get from "lodash/get";

import EntitySchema from "./schema";

const getEntities = state => state.entities;

const getAll = () => (
	createSelector(
		getEntities,
		(state, props) => props.entity,
		(state, props) => get(state.entity, `${props.entity}.${props.name}`, []),
		(state, props) => props.primaryKey,
		(state, props) => props.relations,
		(entities, entityName, data, primaryKey, relations) => {
			const { ids, isFetched, meta } = data;
			const normalized = denormalize(
				{ [entityName]: ids },
				{ [entityName]: [EntitySchema(entityName, primaryKey, relations)] },
				{ ...entities, [entityName]: get(entities, entityName, {}) }
			);

			return {
				items: get(normalized, entityName, []),
				isFetched,
				meta
			};
		}
	)
);

const getOne = () => (
	createSelector(
		getEntities,
		(state, props) => props.id,
		(state, props) => props.entity,
		(state, props) => get(state.entity, `${props.entity}.${props.name}`, {}),
		(state, props) => props.primaryKey,
		(state, props) => props.relations,
		(entities, id, entityName, data, primaryKey, relations) => {
			const { isFetched } = data;
			const normalized = denormalize(
				{ [entityName]: id ? id : data.id},
				{ [entityName]: EntitySchema(entityName, primaryKey, relations) },
				{ ...entities, [entityName]: get(entities, entityName, {}) }
			);
			return {
				isFetched,
				item: get(normalized, entityName, {})
			};
		}
	)
);

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	getAll,
	getOne
};