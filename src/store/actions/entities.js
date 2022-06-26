import { createRoutine } from "redux-saga-routines";

const Load = createRoutine("LOAD_ENTITIES");
const Update = createRoutine("UPDATE_ENTITIES");

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	Load,
	Update
};