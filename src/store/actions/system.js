import { createRoutine } from "redux-saga-routines";

const ChangeLanguage = createRoutine("CHANGE_LANGUAGE");
const Reset = createRoutine("RESET");
const Callback = createRoutine("CALLBACK");
const UploadFile = createRoutine("UPLOAD_FILE");
const DeleteFile = createRoutine("DELETE_FILE");
const ChangeTheme = createRoutine("CHANGE_THEME")

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  ChangeLanguage,
  Reset,
  Callback,
  UploadFile,
  DeleteFile,
  ChangeTheme,
};
