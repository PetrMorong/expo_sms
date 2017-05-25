import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../traits/index';
import { fromJS } from 'immutable';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: true,
    fetched: false,
    emptyData: false
}, action){

    try{
        if(action.meta.reducer !== "statistics"){
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

        result.data.result.country.count.sort(function (a, b) {
            return a[1] < b[1] ? 1 : -1;
        });

        result.data.result.country.price.sort(function (a, b) {
            return a[1] < b[1] ? 1 : -1;
        });


        //convert operetor count from object to array
        let operatorCount = result.data.result.operator.count;
        operatorCount = Object.keys(operatorCount).map((item, index)=>{
           return operatorCount[item]
        });

        operatorCount.sort(function (a, b) {
            return a[1] < b[1] ? 1 : -1;
        });

        result.data.result.operator.count = operatorCount;

        //convert operetor price from object to array
        let operatorPrice = result.data.result.operator.price;
        operatorPrice = Object.keys(operatorPrice).map((item, index)=>{
            return operatorPrice[item]
        });

        operatorPrice.sort(function (a, b) {
            return a[1] < b[1] ? 1 : -1;
        });

        result.data.result.operator.price = operatorPrice;


        result.data.result == false ? result.emptyData = true : result.emptyData = false;

    }

    return result;
}

