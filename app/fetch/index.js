import request from 'superagent';
import { AsyncStorage } from 'react-native';

export const urlBase = 'http://10.0.0.19/bulkgate/mobile-api/';

let token;
AsyncStorage.getItem('token', (err, result) => {


    token = result;
    console.log(result)
});

export function post(url, data){
    console.log(token);
   return request
        .post(urlBase + url)
        .set('X-BulkGate-Api-Token', token)
        .send(data)

}



