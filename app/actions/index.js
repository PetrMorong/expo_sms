/**
 * Created by Petr on 27.1.2017.
 */
import { post } from '../fetch/index';
import { AsyncStorage } from 'react-native';
import request from 'superagent';

export function save(url, meta={}, data, onSuccess, onError){
    return function(dispatch) {
        dispatch({type: 'SAVE', meta});
        post(url, data)
            .end(function(err, res){
                console.log(res);
                let parsedResponse;
                try{
                    parsedResponse = JSON.parse(res.text);
                    if(parsedResponse.error){
                        meta.onError = onError;
                        dispatch({type: 'SAVE_REJECTED', meta, payload: parsedResponse.error[0]});
                    }else {
                        meta.onSuccess = onSuccess;
                        dispatch({type: 'SAVE_FULFILLED', meta, payload: parsedResponse.result});
                    }
                }
                catch (err){
                    meta.onError = onError;
                    dispatch({type: 'SAVE_REJECTED', meta, payload: {error: true} });
                }
            });
    }
}

export function saveImage(url, data){
    return function(dispatch) {
        post(url, data)
            .end(function(err, res){
                console.log('saveimage',res);
                let parsedResponse;
                try{
                    parsedResponse = JSON.parse(res.text);
                    dispatch({type: 'SAVE_IMAGE_FULFILLED', payload: parsedResponse.result});
                }
                catch (err){
                    dispatch({type: 'SAVE_REJECTED'});
                }
            });
    }
}

export function fetch(url, meta={}, data={},onSuccess, onError){
    return function(dispatch) {
        dispatch({type: 'FETCH', meta});
        post(url, data)
            .end(function(err, res){
                console.log('fetch',res);
                let parsedResponse = JSON.parse(res.text);
                try{
                    meta.onSuccess = onSuccess;
                    dispatch({type: 'FETCH_FULFILLED', payload: parsedResponse, meta});
                }
                catch (err){
                    meta.onError = onError;
                    dispatch({type: 'FETCH_REJECTED', meta, payload: {error: true}});
                }
            });
    }
}


export function deleteListItem(url, meta={}, data={}, onSuccess, onError){
    return function(dispatch) {
        dispatch({type: 'DELETE', meta});
        post(url, data)
            .end(function(err, res){
                console.log('delete',res);
                let parsedResponse = JSON.parse(res.text);
                try{
                    meta.onSuccess = onSuccess;
                    meta.onError = onError;
                    dispatch({type: 'DELETE_FULFILLED', payload: data, meta});
                }
                catch (err){
                    meta.onError = onError;
                    dispatch({type: 'DELETE_REJECTED', meta, payload: {error: true}});
                }
            });
    }
}

export function insertRecipient(url, meta={}, data={}, onSuccess, onError){
    return function(dispatch) {
        dispatch({type: 'SAVE', meta});
        post(url, data)
            .end(function(err, res){

                console.log('insertRecipient',res);
                let parsedResponse = JSON.parse(res.text);

                if(parsedResponse.result){
                    meta.onSuccess = onSuccess;
                    dispatch({type: 'SAVE_FULFILLED', payload: data, meta});
                }else{
                    meta.onError = onError;
                    dispatch({type: 'SAVE_REJECTED', meta, payload: {error: 'Wrong number'}});
                }
            });
    }
}


export function getTranslations(){
    return function(dispatch) {
        request
            .get('https://bulkgate-node.herokuapp.com/translations')
            .end(function(err, res){
                AsyncStorage.setItem('translations', res.text);
                dispatch({type: 'GOT_TRANSLATIONS', payload: JSON.parse(res.text)})
            });
    }
}


