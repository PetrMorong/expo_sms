/**
 * Created by Petr on 9.2.2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Modal,
    Button,
    Text,
    Picker,
    View,
    Image,
    Switch,
    Dimensions,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { save, saveImage } from '../../../actions/index'
import { Actions } from 'react-native-router-flux';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import { fromJS } from 'immutable';
import DrawerLayout from 'react-native-drawer-layout';


const mapStateToProps = (store) => {
    return{
        notifications: store.notifications,
        storeSettings: store.storeSettings
    }
};


export default class CustomerSms extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: this.props.notifications.data.result.notifications.customer_sms,
            active: this.props.notifications.data.result.notifications.store_values.customer_notification_sms,
            switchVariables: false,
            smsCount: 0,
            unicode: this.props.notifications.data.result.notifications.customer_sms.unicode,
            variables: [ ['< first_name >', '100%'],['< last_name >', '100%'], ['< email >', '100%'], ['< phone_number >', '100%'], ['< gender >', '100%']]
        }
    }

    handleSave(){

        let store_values = this.props.notifications.data.result.notifications.store_values;

        this.props.dispatch(saveImage('store/save-notifications', {...this.state.data, type: 'customer_sms',id: this.props.storeSettings.data.result.id, unicode: this.state.unicode, store_values: {...store_values, customer_notification_sms: this.state.active}}));

        Actions.Notifications();
    }

    render(){
        let menu  = <Menu/>;

        let variables = this.state.variables.map((variable, i) => {
            return(
                <TouchableOpacity key={i}  onPress={()=>this.setVariable(variable[0])}>
                    <View style={styles.variableStyle}>
                        <Text  style={{color: '#4CAF76'}}>{variable[0]}</Text>
                        <Text  style={{color: '#4CAF76'}}>{variable[1]}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
        let variablesView;
        let variablesSeparator;
        if(this.state.switchVariables){
            variablesView = variables;
            variablesSeparator = <View style={{marginBottom: 15}}/>
        }

        let optionalSender;
        if(this.state.data.sender_type == 'gText'){
            optionalSender = <View style={{marginBottom: 5, paddingLeft: 15, paddingRight: 15}}>
                <TextInput
                    disabled={true}
                    placeholder={_('Text sender value')}
                    onChangeText={(sender_value) => this.setState({data: {...this.state.data, sender_value} })}
                    value={this.state.data.sender_value}/>
                <View style={{justifyContent: 'flex-end', flexDirection: 'row', marginBottom: -5}}>
                    <Text style={styles.messageStats}>0/11</Text>
                </View>
            </View>
        }


        //TODO add verified number to picker
        if(this.state.data.sender_type == 'gOwn'){
            optionalSender = <View style={styles.switchSender}>
                <Text >{_('Verified numbers')}</Text>
                <Picker
                    disabled={true}
                    style={styles.picker}
                    selectedValue={this.state.data.sender_value}
                    onValueChange={(sender_value) => this.setState({data: {...this.state.data, sender_value}})}>
                    <Picker.Item label="Select number" value="system_number" />
                </Picker>
            </View>
        }

        let view;
        if(this.state.active){
            view = <View>
                <View>
                    <TextInput
                        style={{height: 100}}
                        placeholder={_('Sms text')}
                        ref="message"
                        multiline={true}
                        onChangeText={(message) => this.setState({data: {...this.state.data, message}})}
                        value={this.state.data.message}
                        onChange={()=>this.countMessage(this.state.unicode)}/>
                    <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                        <Text style={styles.fontSize10}>SMS:</Text>
                        <Text style={styles.messageStats}>{this.state.smsCount}</Text>
                        <Text style={styles.fontSize10}>{_('Length')}:</Text>
                        <Text style={styles.messageStats}>{this.state.data.message.length}</Text>
                    </View>
                </View>
                <View style={{marginTop: 40}}>
                    <View style={styles.separator}/>
                    <View style={styles.switchWrap}>
                        <Text >{_('Variables')}</Text>
                        <Switch
                            onValueChange={(value) => this.setState({switchVariables: value})}
                            value={this.state.switchVariables} />
                    </View>
                    <View>
                        {variablesView}
                        {variablesSeparator}
                    </View>
                </View>
                <View>
                    <View style={styles.separator}/>
                    <View style={styles.switchWrap}>
                        <Text >{_('Unicode')}</Text>
                        <Switch
                            onValueChange={(value) => this.setState({unicode: value})}
                            value={numberToBool(this.state.unicode)} />
                    </View>
                </View>
                <View>
                    <View style={styles.separator}/>
                    <View style={styles.switchWrap}>
                        <Text >{_('Sender id')}</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.data.sender_type}
                            onValueChange={(sender_type) => this.setState({data: {...this.state.data, sender_type}})}>
                            <Picker.Item label="System number" value="gSystem" />
                            <Picker.Item label="Short code" value="gShort" />
                            <Picker.Item label="Text sender" value="gText" />
                            <Picker.Item label="Own number" value="gOwn" />
                        </Picker>
                    </View>
                    {optionalSender}
                    <View style={styles.separator}/>
                </View>
            </View>
        }



        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Customer sms')}
                    elevation={2}
                    back={true}/>
                <ScrollView style={[styles.container, {padding: 15}]}>
                    <View style={{flex: 1, marginBottom: 15}}>
                        <View style={styles.switchWrap}>
                            <Text>{_('Activate')}</Text>
                            <Switch
                                onValueChange={(value) => this.setState({active: value})}
                                value={this.state.active} />
                        </View>
                        <View style={styles.separator}/>
                    </View>
                    {view}
                </ScrollView>
                <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', margin: 15}}>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={() => this.handleSave()}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('save').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </DrawerLayout>
        )
    }


    setVariable(variable){
        this.setState({ data: {...this.state.data, message: this.state.data.message + " " + variable}})
        this.countMessage(this.state.unicode)
    }

    countMessage(unicodeValue){

        let countMax;
        let count;
        let smsCount;
        let totalSmsCount;

        if(unicodeValue){
            countMax = 70;
            count = 67;
        }else{
            countMax = 160;
            count = 153;
        }

        if(this.state.data.message.length <= countMax){
            smsCount = 1;
        }else{
            smsCount = Math.floor(this.state.data.message.length / count + (this.state.data.message.length % count > 0))
        }

        totalSmsCount = this.state.recipients * smsCount;

        this.setState({
            smsCount: smsCount,
            totalSmsCount: totalSmsCount
        })

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    picker: {
        width: 170
    },
    line: {
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
        borderBottomColor: '#D0DFE8',
        borderBottomWidth: 1,
        marginBottom: 15
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    messageStats: {
        fontWeight: '500',
        color: '#423D3C',
        marginLeft: 3,
        marginRight: 10,
        fontSize: 12
    },
    fontSize10: {
        fontSize: 12
    },
    switchWrap: {
        height: 50,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    variableStyle: {
        paddingLeft: 15,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    switchSender: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonText: {
        color: Color.buttonText,
        fontWeight: '500'
    }
});

module.exports = connect(mapStateToProps)(CustomerSms);