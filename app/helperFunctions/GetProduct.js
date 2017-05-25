import React, {Component} from 'react';
import {
    Text,
    View,

} from 'react-native';

export default class GetProduct extends Component{

    getProduct(product) {

        switch(product)
        {
            case 'ps':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: '#5abe37', fontSize: 16, fontWeight: '500'}}>Presta</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'oc':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: '#00c0f3', fontSize: 16, fontWeight: '500'}}>Cart</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'zs':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: '#fd0000', fontSize: 16, fontWeight: '500'}}>Zen</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'ms':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: '#ff892d', fontSize: 16, fontWeight: '500'}}>Mage</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'ws':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: '#a065a8', fontSize: 16, fontWeight: '500'}}>Woo</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'os':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: '#fec900', fontSize: 16, fontWeight: '500'}}>sms</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>Commerce</Text>
                </View>;
                break;
            case 'da':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: '500'}}>Sun</Text>
                    <Text style={{fontSize: 16, color: '#fec900', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'ha':
            case 'smsagent2':
            case 'smsagentnew':
            case 'smsagentnew2':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: 'teal', fontSize: 16, fontWeight: '500'}}>Gate</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>API</Text>
                </View>;
                break;
            case 'email2sms':
            case 'email2sms2':
            case 'lupl':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: 'purple', fontSize: 16, fontWeight: '500'}}>Email2</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>SMS</Text>
                </View>;
                break;
            case 'orig':
            case 'midlet':
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: 'yellow', fontSize: 16, fontWeight: '500'}}>SMS</Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>Midlet</Text>
                </View>;
                break;
            default:
                return <View style={{flexDirection: 'row', marginRight: 20}}>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: '500', fontStyle: 'italic'}}>Bulk</Text>
                    <Text style={{fontSize: 16, color: '#37ab9c', fontWeight: '500', fontStyle: 'italic'}}>Gate</Text>
                </View>;
        }

    }

    render(){
        return(
            <View>
                {this.getProduct(this.props.product)}
            </View>
        )
    }
}