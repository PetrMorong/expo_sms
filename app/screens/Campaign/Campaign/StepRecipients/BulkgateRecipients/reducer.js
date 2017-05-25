import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../../../traits/index';
import { fromJS } from 'immutable';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: true,
    fetched: false,
    list: [],
    searched: false
}, action){

    try{
        if(action.meta.reducer !== "bulkgateRecipients"){
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

    if (action.type == "FETCH_FULFILLED"){
        result.fetching = false;
        result.fetched = true;
        result.data = action.payload;
        try{

            if(action.meta.newData){
                result.list = Object.keys(action.payload.result.data).map((i)=>{
                    return action.payload.result.data[i]
                })
            }else{
                let newArray = Object.keys(action.payload.result.data).map((i)=>{
                    return action.payload.result.data[i]
                })
                result.list = fromJS(result.list).push(...newArray).toJS();
            }

            result.total = action.payload.result.count;
            result.searched = false;

        }catch(e){

            result.list = action.payload.result;
            result.searched = true;

        }

    }


    return result;
}

