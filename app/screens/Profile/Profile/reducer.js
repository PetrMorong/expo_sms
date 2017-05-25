import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../traits/index';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: false,
    fetched: false
}, action){

    try{
        if(action.meta.reducer !== "profile"){
            return state;
        }
    }catch(e){
        return state;
    }

    let result = {...state};

    onFetch(result, action);

    onFetchRejected(result, action);

    onFetchFulfilled(result, action);

    onSave(result, action);

    onSaveRejected(result, action);

    onSaveFulfilled(result, action);

    return result;
}

