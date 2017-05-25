import { onFetch, onFetchRejected, onFetchFulfilled, onSave, onSaveRejected, onSaveFulfilled } from '../../../traits/index';

export default function reducer(state={
    saving: false,
    saved: false,
    error: null,
    fetching: true,
    fetched: false
}, action){

    try{
        if(action.meta.reducer !== "campaign"){
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
        result.searched = false;

        let x = action.payload.result;


        //format deal expiration
        try{
            if(result.data.result.deal.expiration_hours < 10){
                result.data.result.deal.expiration_hours = '0'+result.data.result.deal.expiration_hours
            }
            if(result.data.result.deal.expiration_minutes == 0){
                result.data.result.deal.expiration_minutes = '0'+result.data.result.deal.expiration_minutes
            }
            result.data.result.deal.expiration_date = result.data.result.deal.expiration_date + ' ' + result.data.result.deal.expiration_hours +':'+ result.data.result.deal.expiration_minutes;
        }catch(e){}


        //format campaign scheduled
       try{
           if(result.data.result.campaign.scheduled_hours < 10){
               result.data.result.campaign.scheduled_hours = '0'+result.data.result.campaign.scheduled_hours
           }
           if(result.data.result.campaign.scheduled_minutes == 0){
               result.data.result.campaign.scheduled_minutes = '0'+result.data.result.campaign.scheduled_minutes
           }
           result.data.result.campaign.scheduled_date = result.data.result.campaign.scheduled_date + ' ' + result.data.result.campaign.scheduled_hours +':'+ result.data.result.campaign.scheduled_minutes;
       }catch(e){}

        //convert to bool
        result.data.result.campaign.opt_restriction = numberToBool(x.campaign.opt_restriction);
        result.data.result.campaign.opt_flash= numberToBool(x.campaign.opt_flash);
        result.data.result.campaign.opt_scheduled= numberToBool(x.campaign.opt_scheduled);
        result.data.result.campaign.opt_unicode= numberToBool(x.campaign.opt_unicode);
        result.data.result.campaign.opt_variables= numberToBool(x.campaign.opt_variables);

        result.csv_excel_list = Object.keys(x.recipientsCount.csv_excel_list).map((i, index)=>{
            return {
                name: [i],
                count: x.recipientsCount.csv_excel_list[i]
            }
        });

        result.vcard_list = Object.keys(x.recipientsCount.vcard_list).map((i, index)=>{
            return {
                name: [i],
                count: x.recipientsCount.vcard_list[i]
            }
        });

        result.address_book_contacts_selected = Object.keys(x.campaign.address_book_contacts).map((i)=>{
            return parseInt(i)
        });

        result.address_book_groups_selected = Object.keys(x.campaign.address_book_groups).map((i)=>{
            return parseInt(i)
        });

        result.address_book_groups = Object.keys(x.recipientsCount.address_book_groups).map((i)=>{
            return x.recipientsCount.address_book_groups[i]
        });

        result.address_book_groups_original = result.address_book_groups;

    }

    if (action.type == "FILTER_GROUPS"){

        result.address_book_groups_original = result.address_book_groups;

        let newArray = result.address_book_groups_original.filter((item)=>{
            return item.name.indexOf(action.payload) ==! -1 ? true : false
        })

        result.searched = true;
        result.address_book_groups = newArray;

    }

    if(action.type == "CANCEL_FILTER_GROUPS"){
        result.searched = false;
        result.address_book_groups = result.address_book_groups_original;

    }


    return result;
}

