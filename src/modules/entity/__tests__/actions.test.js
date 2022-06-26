import React from 'react';
import Actions from '../actions';

describe('Entity Actions', () => {

	const entity = 'movie';
	const entityType = 'movieEntityType';

	describe('LoadAll', () => {

		const LoadAll = Actions.LoadAll;

		it('Request', () => {

			const payload = {
				entity,
				name: entityType,
				url: '/movies/popular',
				options: {},
				meta: {
					limit: 10,
					page: 1
				}
			};

			const action = LoadAll.request(payload);

			expect(action).toEqual({
				type: "LOAD_ALL_ENTITY/REQUEST",
				payload
			});

			expect(action).toMatchSnapshot();
		});

		it('Success', () => {

			const payload = {
				entity,
				name: entityType,
				ids: [1,2,3],
				meta: {
					totalCount: 0,
					pageCount: 1,
					currentPage: 1,
					perPage: 20
				}
			};

			const action = LoadAll.success(payload);

			expect(action).toEqual({
				type: "LOAD_ALL_ENTITY/SUCCESS",
				payload
			});

			expect(action).toMatchSnapshot();
		});

		it('Failure', () => {

			const payload = {
				entity,
				name: entityType,
				error: 'error text'
			};

			const action = LoadAll.failure(payload);

			expect(action).toEqual({
				type: "LOAD_ALL_ENTITY/FAILURE",
				payload
			});

			expect(action).toMatchSnapshot();
		});

	});

	describe('LoadOne', () => {

		const LoadOne = Actions.LoadOne;

		it('Request', () => {

			const payload = {
				entity,
				id: 1,
				url: '/movies/popular/1'
			};

			const action = LoadOne.request(payload);

			expect(action).toEqual({
				type: "LOAD_ONE_ENTITY/REQUEST",
				payload
			});

			expect(action).toMatchSnapshot();
		});

		it('Success', () => {

			const payload = {
				entity,
				id: 1
			};

			const action = LoadOne.success(payload);

			expect(action).toEqual({
				type: "LOAD_ONE_ENTITY/SUCCESS",
				payload
			});

			expect(action).toMatchSnapshot();
		});

		it('Failure', () => {

			const payload = {
				entity,
				id: 1,
				error: 'error text'
			};

			const action = LoadOne.failure(payload);

			expect(action).toEqual({
				type: "LOAD_ONE_ENTITY/FAILURE",
				payload
			});

			expect(action).toMatchSnapshot();
		});

	});

});