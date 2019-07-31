import axios from "axios";

export const alarmDetailReducerKey = "alarmDetail";

// Action
export const ALARM_LOADING = "ALARM_LOADING";
export const ALARM_LOAD_OK = "ALARM_LOAD_OK";

// Reducer
const initState = {
  positionArray: []
};

export default (state = initState, action) => {
  let data = action.payload;

  switch (action.type) {
    case ALARM_LOADING:
      return Object.assign({}, state, data);
    default:
      return state;
  }
};

// Action Create

export const actions = {
  initProps: () => {
    const payload = initState;
    return { type: ALARM_LOADING, payload };
  }
};
