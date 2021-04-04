import { createStore } from 'redux';
import  rootReducer  from './reducer';

/* eslint-disable no-underscore-dangle */

const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  );
  
  export default store;