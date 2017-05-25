import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../../../traits/index';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: true,
    fetched: false,
    newTemplate: ''
}, action){

    try{
        if(action.meta.reducer !== "templateList"){
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

    if (action.type == "FETCH_FULFILLED"){
        result.fetching = false;
        result.fetched = true;
        result.data = action.payload;

    }

    if (action.type == "LOAD_TEMPLATE"){
        result.newTemplate = action.payload;
    }



    return result;
}

