import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../traits/index';
import { fromJS, List } from 'immutable';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: false,
    fetched: false,
    list: [],
    emptyData: false
}, action){

    try{
        if(action.meta.reducer !== "invoices"){
            return state;
        }
    }catch(e){
        return state;
    }

    let result = {...state};

    onFetch(result, action);

    onFetchRejected(result, action);

    onSave(result, action);

    onSaveRejected(result, action);

    onSaveFulfilled(result, action);

    if (action.type == "SAVE_FULFILLED"){
        result.saving = false;
        result.saved = true;
        result.data = action.payload;

    }


    if (action.type == "FETCH_FULFILLED"){
        result.fetching = false;
        result.fetched = true;
        result.data = action.payload;

        try{
            if(action.meta.newData){
                result.list = [...action.payload.result.list.data]
                result.emptyData =  false;
            }else{
                result.list = fromJS(result.list).push(...action.payload.result.list.data).toJS();
                result.emptyData = false;
            }
        }catch(e){
            result.emptyData =  true;
            result.list = []
        }

    }

    return result;
}

