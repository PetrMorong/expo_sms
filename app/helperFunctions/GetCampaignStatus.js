import React, {Component} from 'react';
import {
    Text,
    View,

} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class GetCampaignStatus extends Component{

    getStatus(status) {

        if(status == 'summary' || status == 'summary-duplicity'){
            return <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <Icon name="sync" style={{color: '#fbc02d'}} size={20}/>
                <Text style={{color: '#fbc02d', marginLeft: 3}}>{_('Summary')}</Text>
            </View>
        }
        if(status == 'concept-text'){
            return <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <Icon name="text-fields" style={{color: '#2196F3'}} size={20}/>
                <Text style={{color: '#2196F3', marginLeft: 3}}>{_('Text')}</Text>
            </View>
        }
        if(status == 'concept-deal'){
            return <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <Icon name="shopping-cart" style={{color: '#2196F3'}} size={20}/>
                <Text style={{color: '#2196F3', marginLeft: 3}}>{_('Deal')}</Text>
            </View>
        }
        if(status == 'concept-contacts'){
            return <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <Icon name="group" style={{color: '#2196F3'}} size={20}/>
                <Text style={{color: '#2196F3', marginLeft: 3}}>{_('Contacts')}</Text>
            </View>
        }
        if(status == 'running'){
            return <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <Icon name="cloud-upload" style={{color: '#81C784'}} size={20}/>
                <Text style={{color: '#81C784', marginLeft: 3}}>{_('Running')}</Text>
            </View>
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

