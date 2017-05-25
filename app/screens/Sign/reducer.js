export default function reducer(state={
    fetching: false,
    fetched: false,
    error: null
}, action){

    switch(action.type) {
        case 'FETCH_USER': {
            return {...state, fetching: true}
        }
        case 'FETCH_USER_REJECTED': {
            return {...state, fetching: false, error: 'error'}
        }
        case 'FETCH_USER_FULFILLED': {
            return {
                ...state,
                fetching: false,
                fetched: true,
                user: action.payload
            }
        }
        case 'CLOSE_ERROR': {
            return {...state, error: false}
        }
        case 'PROFILE_SAVE_SUCCESS': {
            let data = {...state};
            data.user.user = action.payload;
            return data;
        }
    }
    return state;
}