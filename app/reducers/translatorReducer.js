/**
 * Created by Petr on 9.3.2017.
 */
/**
 * Created by Petr on 27.1.2017.
 */

export default function reducer(state={
    translations: ''
}, action){

    switch(action.type) {
        case 'GOT_TRANSLATIONS': {
            return {
                ...state,
                translations: action.payload
            }
        }
    }
    return state;
}