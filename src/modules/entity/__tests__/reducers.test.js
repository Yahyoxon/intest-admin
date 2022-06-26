import React from 'react';
import Actions from '../actions';
import Reducer from '../reducers';

describe('Entity Reducers', () => {

	const entity = 'movieEntity';
	const entityType = 'movieEntityType';

	describe('LoadALL with empty data', () => {

		const state = {};

		it('Request', () => {

			const payload = {
				entity,
				name: entityType
			};

			expect(Reducer(state, Actions.LoadAll.request(payload))).toEqual({
				[entity]: {
					[entityType]: {
						isFetched: false
					}
				}
			});
		});

		it('Success', () => {

			const payload = {
				entity,
				name: entityType,
				ids: [1, 2, 3],
				meta: {
					totalCount: 0,
					pageCount: 1,
					currentPage: 1,
					perPage: 20
				},
				params: { page: 1, limit: 3, sort: "-id", fields: [], include: [], filter: {}, extra: {} },
			};

			const reducer = Reducer(state, Actions.LoadAll.success(payload));

			expect(reducer).toEqual({
				[entity]: {
					[payload.name]: {
						isFetched: true,
						ids: payload.ids,
						meta: payload.meta,
						params: { filter: payload.params.filter, extra: payload.params.extra }
					}
				}
			})
		});

		it('Failure', () => {

			const payload = {
				entity,
				name: entityType,
				error: 'error text'
			};

			const reducer = Reducer(state, Actions.LoadAll.failure(payload));

			expect(reducer).toEqual({
				[entity]: {
					[payload.name]: {
						isFetched: true,
						error: payload.error
					}
				}
			})
		});

	});

	describe('LoadALL with initial state', () => {

		const state = {
			[entity]: {
				[entityType]: {
					isFetched: true,
					ids: [1, 2, 3],
					meta: {
						totalCount: 0,
						pageCount: 1,
						currentPage: 1,
						perPage: 20
					},
					params: { filter: {}, extra: {} }
				}
			}
		};

		it('REQUEST', () => {

			const payload = {
				entity,
				name: entityType
			};

			const reducer = Reducer(state, Actions.LoadAll.request(payload));

			expect(reducer).toEqual({
				[payload.entity]: {
					...state[payload.entity],
					[payload.name]: {
						...state[payload.entity][payload.name],
						isFetched: false
					}
				}
			});

			expect(reducer).toMatchSnapshot();
		});

		it('SUCCESS', () => {

			const payload = {
				entity,
				name: entityType,
				ids: [4, 5, 6],
				meta: {
					totalCount: 0,
					pageCount: 1,
					currentPage: 1,
					perPage: 20
				},
				params: { page: 1, limit: 3, sort: "-id", fields: [], include: [], filter: {}, extra: {} },
				appendIds: true
			};

			const reducer = Reducer(state, Actions.LoadAll.success(payload));

			expect(reducer).toEqual({
				[payload.entity]: {
					...state[payload.entity],
					[payload.name]: {
						...state[payload.entity][payload.name],
						isFetched: true,
						ids: [
							...state[payload.entity][payload.name].ids,
							...payload.ids
						],
						meta: payload.meta,
						params: { filter: payload.params.filter, extra: payload.params.extra }
					}
				}
			});

			expect(reducer).toMatchSnapshot();
		});

		it('FAILURE', () => {

			const payload = {
				entity,
				name: entityType,
				error: 'error text'
			};

			const reducer = Reducer(state, Actions.LoadAll.failure(payload));

			expect(reducer).toEqual({
				[payload.entity]: {
					...state[payload.entity],
					[payload.name]: {
						...state[payload.entity][payload.name],
						isFetched: true,
						error: payload.error
					}
				}
			});

			expect(reducer).toMatchSnapshot();
		});

	});

	describe('LoadOne with empty data', () => {

		const state = {};

		const id = 1;

		it('Request', () => {

			const payload = {
				entity,
				name: entityType,
				id
			};

			expect(Reducer(state, Actions.LoadOne.request(payload))).toEqual({
				[entity]: {
					[`${payload.name}One`]: {
						isFetched: false
					}
				}
			});
		});

		it('Success', () => {

			const payload = {
				entity,
				name: entityType,
				id
			};

			const reducer = Reducer(state, Actions.LoadOne.success(payload));

			expect(reducer).toEqual({
				[entity]: {
					[`${payload.name}One`]: {
						isFetched: true,
						id: payload.id
					}
				}
			})
		});

		it('Failure', () => {

			const payload = {
				entity,
				name: entityType,
				error: 'error text'
			};

			const reducer = Reducer(state, Actions.LoadOne.failure(payload));

			expect(reducer).toEqual({
				[entity]: {
					[`${payload.name}One`]: {
						isFetched: true,
						error: payload.error
					}
				}
			})
		});

	});

	describe('LoadOne with initial state', () => {

		const state = {
			[entity]: {
				[`${entityType}One`]: {
					isFetched: true,
					id: 1,
					meta: {
						totalCount: 0,
						pageCount: 1,
						currentPage: 1,
						perPage: 20
					}
				}
			}
		};

		const id = 1;

		it('REQUEST', () => {

			const payload = {
				entity,
				name: entityType,
				id
			};

			const reducer = Reducer(state, Actions.LoadOne.request(payload));

			expect(reducer).toEqual({
				[payload.entity]: {
					...state[payload.entity],
					[`${payload.name}One`]: {
						...state[payload.entity][`${payload.name}One`],
						isFetched: false
					}
				}
			});

			expect(reducer).toMatchSnapshot();
		});

		it('SUCCESS', () => {

			const payload = {
				entity,
				name: entityType,
				id: 1,
				meta: {
					totalCount: 0,
					pageCount: 1,
					currentPage: 1,
					perPage: 20
				}
			};

			const reducer = Reducer(state, Actions.LoadOne.success(payload));

			expect(reducer).toEqual({
				[payload.entity]: {
					...state[payload.entity],
					[`${payload.name}One`]: {
						...state[payload.entity][`${payload.name}One`],
						isFetched: true,
						id: payload.id,
						meta: payload.meta
					}
				}
			});

			expect(reducer).toMatchSnapshot();
		});

		it('FAILURE', () => {

			const payload = {
				entity,
				name: entityType,
				error: 'error text'
			};

			const reducer = Reducer(state, Actions.LoadOne.failure(payload));

			expect(reducer).toEqual({
				[payload.entity]: {
					...state[payload.entity],
					[`${payload.name}One`]: {
						...state[payload.entity][`${payload.name}One`],
						isFetched: true,
						error: payload.error
					}
				}
			});

			expect(reducer).toMatchSnapshot();
		});

	});

});