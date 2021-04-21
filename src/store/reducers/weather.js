import {STORE_CITIES} from '../actions/weather';

export const initialState = {
  cityList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case STORE_CITIES: {
      return {
        ...state,
        cityList: action.payload,
      };
    }
    default:
      return state;
  }
};
