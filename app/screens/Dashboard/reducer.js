/**
 * Created by Petr on 27.1.2017.
 */

export default function reducer(state={
    smsSent: null,
    creditSpent: null,
    month: null,
    fetching: false,
    fetched: false,
    error: null
}, action){

    switch(action.type) {
        case 'FETCH_DASHBOARD': {
            return {...state, fetching: true}
        }
        case 'FETCH_DASHBOARD_REJECTED': {
            return {...state, fetching: false, error: action.payload}
        }
        case 'FETCH_DASHBOARD_FULFILLED': {
            return {
                ...state,
                fetching: false,
                fetched: true,
                user: action.payload
            }
        }
    }
    return state;
}