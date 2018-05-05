// Definition of reducers

import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import {
  NUMBER_INPUT,
  OPERATOR_INPUT,
  EVALUATION,
  COMPUTE,
  FLOAT_POINT,
} from './actions';

// float flag
const FLOAT_MODE = 'FLOAT_MODE';
const INTEGER_MODE = 'INTEGET_MODE';

// Initial number input to 0
const numberInitialReducer = (state = '0') => state;

const floatReducer = (state = INTEGER_MODE, action) => {
  switch (action.type) {
    case FLOAT_POINT:
      return FLOAT_MODE;
    default:
      return state;
  }
}

// Compute the input number
// isFloat is the flag to decide is there has a float point
const numberReducer = (state, action, isFloat) => {
  switch (action.type) {
    case NUMBER_INPUT:
      if (isFloat === FLOAT_MODE) {
        let nums = state.split('.');
        if (nums.length === 1) nums.push('');
        nums[1] += action.payload.number;
        return nums.join('.');
      }
      return state + action.payload.number;
    default:
      return state;
  }
};

// Initial the holder
// holder is for store the last input number and evaluate the result
const holderInitialReducer = (state = '0') => state;

const operatorReducer = (state = '', action) => {
  switch (action.type) {
    case OPERATOR_INPUT:
      return action.payload.operator;
    default:
      return state;
  }
}

const operationReducer = (state, action) => {
  switch (action.type) {
    case OPERATOR_INPUT:
      return Object.assign({}, state, {
        holder: state.number,
        number: '0'
      });
    default:
      return state;
  }
}

const evaluateReducer = (state, action) => {
  if (action.type === EVALUATION) {
    let holder = Number(state.holder);
    let number = Number(state.number);
    switch (state.operator) {
      case COMPUTE.ADD:
        return Object.assign({}, state, {
          number: holder + number
        });
      case COMPUTE.SUBTRACT:
        return Object.assign({}, state, {
          number: holder - number
        });
      case COMPUTE.MULTIPLY:
        return Object.assign({}, state, {
          number: holder * number
        });
      case COMPUTE.DIVIDE:
        return Object.assign({}, state, {
          number: holder / number
        });
      default:
        return state;
    }
  }
  return state;
}

const inputReducer = (state, action) => {
  return Object.assign({}, state, {
    number: numberReducer(state.number, action, state.isFloat)
  });
}

const rootReducer = combineReducers({
  operator: operatorReducer,
  number: numberInitialReducer,
  holder: holderInitialReducer,
  isFloat: floatReducer,
});

export default reduceReducers(
  rootReducer,
  operationReducer,
  evaluateReducer,
  inputReducer
)