import React from 'react';
import EntitySchema from '../schema';

describe('Entity Schema', () => {

	const entity = 'movie';

	it('should return schema', () => {

		const Schema = EntitySchema(entity, `${entity}Id`);

		expect(Schema).toEqual({
			"_getId": expect.any(Function),
			"_idAttribute": `${entity}Id`,
			"_key": entity,
			"_mergeStrategy": expect.any(Function),
			"_processStrategy": expect.any(Function),
			"schema": {}
		});

		expect(Schema).toMatchSnapshot();
	});

});