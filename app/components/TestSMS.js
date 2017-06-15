/**
 * Created by Petr on 19.5.2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Modal,
    Text,
    Picker,
    View,
    Image,
    Switch,
    Dimensions,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import Button from './Button';
import { connect } from 'react-redux';
import { save } from '../actions/index';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        myPhone: store.user.user.user.phone_number,
    }
};

export default class TestSMS extends Component {
    constructor(props){
        super(props)
        this.state = {
            recipient: '',
            tooltip: false,
            buttonStatus: 'default'
        }
    }

    componentDidMount(){
        this.refs.textInput.focus();
    }

    blurRecipientInput(){
        this.refs.textInput.blur();
        this.setState({tooltip: false})
    }

    handleInputClick(){
        this.setState({recipient: this.props.myPhone});
        this.refs.textInput.blur();
    }

    handleSend(){
        this.setState({buttonStatus: 'saving'}, ()=>{
            this.props.dispatch(save('campaign/send-test-sms', {reducer: 'campaign'}, {campaign_id: this.props.campaign_id, phone_number: this.state.recipient}, ()=>{
                this.setState({buttonStatus: 'saved'}, ()=>Actions.pop())
            }))
        })
    }

    render() {

        let tooltip;
        if(this.state.tooltip){
            tooltip = <TouchableOpacity onPress={()=>this.handleInputClick()}>
                <View style={{ height: 50, marginLeft: 49, marginRight: 14,backgroundColor: 'white', borderColor: '#EFF1F0', borderWidth: 1, marginTop: -17}}>
                    <Text style={{fontSize: 16, padding: 15}}>{_('My phone number')}</Text>
                </View>
            </TouchableOpacity>
        }

        let button;
        if(this.state.recipient !== ''){
            button =  <Button
                click={() => this.handleSend()}
                text={_('Send').toUpperCase()}
                buttonStatus={this.state.buttonStatus}
            />
        }

        return (
            <View style={styles.container}>
                <View style={{borderBottomColor: 'grey', paddingTop: 5, flexDirection: 'row', backgroundColor: '#EFF1F0', alignItems: 'center'}}>
                    <TouchableWithoutFeedback  onPress={(event) => Actions.pop()} >
                        <View style={{width: 35, paddingLeft: 15, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon style={styles.menuIcon} name="arrow-back" size={30}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TextInput
                        onChangeText={(recipient) => this.setState({recipient})}
                        ref={'textInput'}
                        value={this.state.recipient}
                        keyboardType="numeric"
                        style={{flex: 1, fontSize: 18, height: 40, marginLeft: 10, marginRight: 10}}
                        placeholder="Recipient"
                        onFocus={()=>this.setState({tooltip: true})}
                        onBlur={()=>this.setState({tooltip: false})}
                    />
                </View>
                {tooltip}
                <TouchableWithoutFeedback onPress={()=>this.blurRecipientInput()}>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <View style={styles.sentMessage}>
                            <Text style={{textAlign: 'justify', color: 'white', fontSize: 15}}>
                                {this.props.template}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{alignItems: 'flex-end', margin: 15}}>
                    {button}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    sentMessage: {
        marginBottom: 10,
        maxWidth: window.width / 10 * 8,
        padding: 10,
        marginRight: 15,
        backgroundColor: '#0084FF',
        borderRadius: 10
    },
});

module.exports = connect(mapStateToProps)(TestSMS);
