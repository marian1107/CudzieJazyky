import { combineReducers } from 'redux';
import { Actions } from './actions';


// type Item = { user: any, logged:boolean };

export type State = { user: any, logged:boolean };

const userReducer = (state: State, action: Actions) => {
    /* if (action.type === "login" || action.type === "registrate"){
        return {...state, user: action.user, logged: true};
    }
    
    return {user: {}, logged: false}; */

    switch (action.type) {
        case 'login':
            return {...state, user: action.user, logged: true};
        case 'registrate':
            return {...state, user: action.user, logged: true};
        case 'update':
            return {...state, user: action.user, logged: true};
        case 'logout':
            return {...state, user: {}, logged: false};
        default:
            return {...state, user: {}, logged: false};
      }
}

const rootReducer = combineReducers({user: userReducer});
export default rootReducer;