import React, {Component} from 'react';
import {
    Text,
    View,

} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';

export default class GetSender extends Component{

    get(item) {

        switch(item)
        {
            case 'gSystem':
                return 'System number';
                break;
            case 'gShort':
                return 'Short code';
                break;
            case 'gText':
                return 'Text sender';
                break;
            case 'gOwn':
                return 'Own number';
                break;
            default:
                return '-';
        }

    }

    render(){
        return(
            <View>
                <Text>{this.get(this.props.sender)}</Text>
            </View>
        )
    }
}