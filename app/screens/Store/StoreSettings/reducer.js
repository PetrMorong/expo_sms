import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../traits/index';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: true,
    fetched: false
}, action){

    try{
        if(action.meta.reducer !== "storeSettings"){
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

    if (action.type == "CHANGE_STORE"){
        result = action.payload;
    }


    return result;
}

