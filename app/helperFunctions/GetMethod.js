import React, {Component} from 'react';
import {
    Text,
    View,

} from 'react-native';

export default class GetMethod extends Component{

    getMethod(method) {

        switch(method)
        {
            case 'paypal':
                return <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#222d65', fontSize: 16, fontWeight: '500'}}>Pay</Text>
                    <Text style={{fontSize: 16, color: '#179bd7', fontWeight: '500'}}>Pal</Text>
                </View>;
                break;
            case 'creditcard':
                return <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#d81e05', fontSize: 16, fontWeight: '500'}}>Credit</Text>
                    <Text style={{fontSize: 16, color: '#fca311', fontWeight: '500'}}>Card</Text>
                </View>;
                break;
            case 'moneybookers':
            case 'moneybrookers':
                return <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#852064', fontSize: 16, fontWeight: '500'}}>Skrill</Text>
                </View>;
                break;
            default:
                return <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#2e7d32', fontSize: 16, fontWeight: '500' }}>Bank</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>Transfer</Text>
                </View>;
        }

    }

    render(){
        return(
            <View>
                {this.getMethod(this.props.method)}
            </View>
        )
    }
}