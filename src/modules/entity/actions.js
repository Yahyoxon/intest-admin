import { createRoutine } from "redux-saga-routines";

const LoadAll = createRoutine("LOAD_ALL_ENTITY");
const LoadOne = createRoutine("LOAD_ONE_ENTITY");
const LoadDefault = createRoutine("LOAD_DEFAULT");
const Form = createRoutine("FORM_ENTITY");
const FormDefault = createRoutine("FORM_DEFAULT");
const Append = createRoutine("APPEND_ENTITY");

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	LoadAll,
	LoadOne,
	LoadDefault,
	Form,
	FormDefault,
	Append
};
