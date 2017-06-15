import React, {Component} from 'react';
import {
    Text,
    View,

} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Color from '../config/Variables';


export default class GetName extends Component{

    getNameHistory(name, item) {

        if(item == 'Name'){

            switch(name)
            {
                case 11:
                    return <Text>Delivery</Text>;
                    break;
                case 12:
                    return <Text>Recipient unavailable</Text>;
                    break;
                case 16:
                    return <Text>Dnd</Text>;
                    break;
                case 1:
                    return <Text>Sent</Text>;
                    break;
                case 2:
                    return <Text>Error</Text>;
                    break;
                default:
                    return <Text>-</Text>;
            }

        }else if(item == 'type'){

            switch(name)
            {
                case 0:
                    return <Text>Unknown</Text>;
                    break;
                case 1:
                    return <Text>Transactional</Text>;
                    break;
                case 2:
                    return <Text>Promotional</Text>;
                    break;
                default:
                    return <Text>-</Text>;
            }

        }else if(item == 'recipient'){
            return <Text>{this.props.name}</Text>
        }

    }

    getNameTransactions(name, item){

        if(item == 'type'){

            switch(name){
                case 1:
                    return <Text>SMS</Text>
                    break;
                case 2:
                    return <Text>Flash sms</Text>
                    break;
                case 10:
                    return <Text>Long sms</Text>
                    break;
                case 12:
                    return <Text>Unicode sms</Text>
                    break;
                case 55:
                    return <Text>Service</Text>
                    break;
                case 58:
                    return <Text>Activation</Text>
                    break;
                case 60:
                    return <Text>Transfer</Text>
                    break;
                case 70:
                    return <Text>Reclamation minus</Text>
                    break;
                case 110:
                    return <Text>Charge</Text>
                    break;
                case 120:
                    return <Text>Bonus</Text>
                    break;
                case 150:
                    return <Text>Reclamation plus</Text>
                    break;
                default:
                    return <Text>-</Text>;
            }

        }

        if(item == 'amount_change'){

            switch(name){
                case 1:
                    return <Text>Plus</Text>
                    break;
                case -1:
                    return <Text>Minus</Text>
                    break;
                default:
                    return <Text>-</Text>
            }

        }

    }

    getNameBlacklist(name, item){

        if(item == 'number'){

            return <Text>{name}</Text>

        }

    }

    getNameInbox(name, item){

        if(item == 'from'){

            return <Text>{name}</Text>

        }

        if(item == 'text'){

            return <Text>{name}</Text>

        }

    }

    getNameStatistics(name, item){
        if(item == 'status'){

            switch(name)
            {
                case 11:
                    return <Text>Delivery</Text>;
                    break;
                case 12:
                    return <Text>Recipient unavailable</Text>;
                    break;
                case 16:
                    return <Text>Dnd</Text>;
                    break;
                case 1:
                    return <Text>Sent</Text>;
                    break;
                case 2:
                    return <Text>Error</Text>;
                    break;
                default:
                    return <Text>-</Text>;
            }

        }else if(item == 'type'){

            switch(name)
            {
                case 0:
                    return <Text>Unknown</Text>;
                    break;
                case 1:
                    return <Text>Transactional</Text>;
                    break;
                case 2:
                    return <Text>Promotional</Text>;
                    break;
                default:
                    return <Text>-</Text>;
            }

        }else if(item == 'recipient'){
            return <Text>{this.props.name}</Text>
        }
    }

    determine(){

        if(this.props.identifier == 'history'){
            return this.getNameHistory(this.props.name, this.props.item)
        }

        if(this.props.identifier == 'transactions'){
            return this.getNameTransactions(this.props.name, this.props.item)
        }

        if(this.props.identifier == 'blacklist'){
            return this.getNameBlacklist(this.props.name, this.props.item)
        }

        if(this.props.identifier == 'inbox'){
            return this.getNameInbox(this.props.name, this.props.item)
        }

        if(this.props.identifier == 'statistics'){
            return this.getNameStatistics(this.props.name, this.props.item)
        }


    }

    render(){

        return(
            <Text style={{color: Color.chipsText}}>{this.determine()}</Text>

        )
    }
}