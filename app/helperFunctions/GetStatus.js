import React, {Component} from 'react';
import {
    Text,
    View,

} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';

export default class GetStatus extends Component{

    getStatus(status) {

        switch(status)
        {
            case '1':
            case '10':
                return <Icon name="call-made" size={20} style={{color: 'green', marginTop: 8}}/>;
                break;
            case '2':
                return <Icon name="error" size={20} style={{color: 'red', marginTop: 8}}/>;
                break;
            case '11':
                return <Icon name="done" size={20} style={{color: 'green', marginTop: 8}}/>;
                break;
            case '12':
                return <Icon name="phone-missed" size={20} style={{color: 'yellow', marginTop: 8}}/>;
                break;
            case '16':
                return <Icon name="not-interested" size={20} style={{color: 'red', marginTop: 8}}/>;
                break;
            default:
                return '-';
        }

    }

    render(){
        return(
            <View>
                {this.getStatus(this.props.status)}
            </View>
        )
    }
}