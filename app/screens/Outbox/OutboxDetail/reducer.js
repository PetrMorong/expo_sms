import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../traits/index';
import { fromJS } from 'immutable';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: false,
    fetched: false,
    list: []
}, action){

    try{
        if(action.meta.reducer !== "outboxDetail"){
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
                result.list = [...action.payload.result.data];
                result.emptyData =  false;
            }else{
                result.list = fromJS(result.list).push(...action.payload.result.data).toJS();
                result.emptyData = false;
            }
        }catch(e){
            result.emptyData =  true;
            result.list = []

        }
    }

    if (action.type == "DELETE_FULFILLED"){

        try{
            //TODO pořešit
            action.payload.id.map((item)=>{
                delete result.data.result.list[item]
            });

            action.meta.onSuccess()
        }catch (e){
            action.meta.onError()
        }

    }


    return result;
}

