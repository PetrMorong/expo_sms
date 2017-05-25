import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../traits/index';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: false,
    fetched: false
}, action){

    try{
        if(action.meta.reducer !== "orderList"){
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

    if (action.type == "DELETE_FULFILLED"){

        action.payload.id.map((item)=>{
            delete result.data.result.list[item]
        });

        try{
            action.meta.onSuccess()
        }catch (e){}
    }


    return result;
}

