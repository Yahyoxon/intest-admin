import config from "config";
import systemActions from "../actions/system";

const initialState = {
  currentLangCode: config.DEFAULT_LANGUAGE,
  callback: false,
  theme: null,
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = initialState, action) => {
  switch (action.type) {

    case systemActions.Callback.SUCCESS: {
      return {
        ...state,
        callback: true
      };
    }
    case systemActions.Callback.FAILURE: {
      return {
        ...state,
        callback: false
      };
    }

    case systemActions.ChangeLanguage.TRIGGER: {
      return { ...state, currentLangCode: action.payload };
    }

    case systemActions.ChangeTheme.TRIGGER: {
      return { ...state, theme: action.payload }
    }

    default:
      return state;
  }
};
