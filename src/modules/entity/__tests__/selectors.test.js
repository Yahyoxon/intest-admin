import React from 'react';
import Selectors from '../selectors';

describe('Entity Selectors', () => {

	const entity = 'movie';
	const entityType = 'movieEntityType';
	const id = 1;
	const state = {
		entities: {
			[entity]: {
				1: {
					id: 1,
					name: 'Movie 1'
				},
				2: {
					id: 2,
					name: 'Movie 2'
				}
			}
		},
		entity: {
			[entity]: {
				[entityType]: {
					isFetched: true,
					ids: [2],
					meta: {
						totalCount: 0,
						pageCount: 1,
						currentPage: 1,
						perPage: 20
					}
				},
				[`${entityType}One`]: {
					isFetched: true,
					id
				}
			}
		}
	};

	it('getAll selector', () => {

		const props = { entity, name: entityType };
		const selector = Selectors.getAll();

		expect(selector(state, props)).toEqual({
			isFetched: true,
			items: [
				{
					id: 2,
					name: 'Movie 2'
				}
			],
			meta: {
				totalCount: 0,
				pageCount: 1,
				currentPage: 1,
				perPage: 20
			}
		});

		expect(selector(state, props)).toMatchSnapshot();
	});

	it('getOne selector', () => {
		const props = { entity, name: entityType, id };
		const selector = Selectors.getOne();

		expect(selector(state, props)).toEqual({
			isFetched: true,
			item: state.entities[entity][props.id]
		});

		expect(selector(state, props)).toMatchSnapshot();
	});

});