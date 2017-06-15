/**
 * Created by Petr on 1.2.2017.
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
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Menu from '../../../../../components/Menu';
import Toolbar from '../../../../../components/Toolbar';
import Button from '../../../../../components/Button';

import Color from '../../../../../config/Variables';
import { connect } from 'react-redux';
import { insertRecipient, fetch } from '../../../../../actions/index';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import Step from '../../../../../components/StepperSingleStep';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        campaign: store.campaign,
        keypadRecipients: store.keypadRecipients
    }
}

export default class KeypadRecipients extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            recipientButtonDisabled: true,
            numbers: [],
            buttonStatus: 'default',
            error: '',
            deleting: false
        }
    }

    handleAdd(){
        let number = {
            phone_mobile: this.state.phoneNumber,
            last_name: this.state.lastName,
            first_name: this.state.firstName
        }

        this.setState({buttonStatus: 'saving'}, ()=>{
            this.props.dispatch(
                insertRecipient(
                    'campaign/insert-recipient',
                    {reducer: 'keypadRecipients'},
                    {campaign_id: this.props.campaign.data.result.campaign.id , data: number, source: 'manual'},
                    ()=>setTimeout(()=>{ this.onSuccess() }, 10),
                    ()=>this.onError()
                )
            )
        })
    }

    onSuccess(){
        this.setState({buttonStatus: 'saved', firstName: '', lastName: '', phoneNumber: ''}, ()=>{
            this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.campaign.data.result.campaign.id}))
        })
    }

    onError(){
        this.setState({buttonStatus: 'error', error: _('Wrong number')})
    }

    onSuccessDelete(){
        this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.campaign.data.result.campaign.id}, ()=>this.setState({deleting: false})))
    }

    deleteContact(item){
        this.setState({deleting: item}, ()=>{
            this.props.dispatch(
                insertRecipient(
                    'campaign/delete-manual-recipient',
                    {reducer: 'keypadRecipients'},
                    {campaign_id: this.props.campaign.data.result.campaign.id , order: item},
                    ()=>setTimeout(()=>{ this.onSuccessDelete() }, 10)
                )
            )
        })
    }

    renderChips(){
        return this.props.campaign.data.result.recipientsManual.map((item, index)=>{

            let name;
            if(item.first_name === null && item.last_name === null){
                name = <Text style={{color: Color.chipsText}}>{item.phone_mobile}</Text>
            }else{
                name = <Text style={{color: Color.chipsText}}>{item.first_name} {item.last_name}</Text>
            }

            let icon;
            if(this.state.deleting == item.order){
                icon = <View style={{width: 30, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator
                            style={{height: 30}}
                            size="small"
                        />
                    </View>
            }else {
                icon = <TouchableWithoutFeedback onPress={()=> this.deleteContact(item.order)}>
                    <View style={{width: 30, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name="cancel" size={25} style={{color: 'lightgrey', marginLeft: 5}}/>
                    </View>
                </TouchableWithoutFeedback>
            }

            return <View key={index} style={{paddingLeft: 15, paddingRight: 10, marginRight: 10, height: 40, backgroundColor: Color.chipsBackground,  borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                {name}
                {icon}
            </View>
        })
    }

    render(){
        let menu  = <Menu/>;

        let error;
        if(this.state.error !== ''){
            error = <Text style={{color: 'red', fontSize: 15, marginRight: 10, marginBottom: 3}}>{this.state.error}</Text>
        }else{
            error = <Text style={{color: 'white', fontSize: 15, marginRight: 10, marginBottom: 3}}>invisible</Text>
        }

        let button;
        if(this.props.campaign.data.result.recipientsManual.length > 0){
            button = <TouchableOpacity onPress={()=>Actions.pop()}>
                <View style={{elevation: 2, height: 50, backgroundColor: Color.button, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, left: 0, width: window.width}}>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{_('Save').toUpperCase()}</Text>
                </View>
            </TouchableOpacity>
        }

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="containerNoBg"
                    title={_('Enter number')}
                    elevation={0}
                    back={true}/>
                <ScrollView>

                    <View style={{height: window.height - 85, backgroundColor: 'white'}}>
                        <View style={{backgroundColor: Color.secondaryColor, height: window.height/3-30, alignItems: 'center' }}>
                            <Icon name="person" size={180} style={{color: 'white'}}/>
                        </View>
                        <View style={{height: 60, alignItems: 'center', flexDirection: 'row', paddingLeft: 15}}>
                            <ScrollView
                                ref="scrollView"
                                onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({x:width})}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ height: 40, elevation: 1, flexDirection: 'row'}}
                            >
                            {this.renderChips()}
                            </ScrollView>
                        </View>
                        <View style={{flex: 1, padding: 5, paddingTop: 0,marginTop: 0}}>
                            <TextInput
                                style={styles.phoneNumber}
                                keyboardType='numeric'
                                placeholder={_('Phone number')}
                                ref="phoneNumber"
                                onChangeText={(phoneNumber) => this.setState({phoneNumber, buttonStatus: 'default', error: ''})}
                                value={this.state.phoneNumber}/>
                            <View style={styles.recipientSmallWrap}>
                                <TextInput
                                    style={styles.firstName}
                                    placeholder={_('First name')}
                                    ref="firstName"
                                    onChangeText={(firstName) => this.setState({firstName, buttonStatus: 'default', error: ''})}
                                    value={this.state.firstName}/>
                                <TextInput
                                    style={styles.lastName}
                                    placeholder={_('Last name')}
                                    ref="lastName"
                                    onChangeText={(lastName) => this.setState({lastName, buttonStatus: 'default', error: ''})}
                                    value={this.state.lastName}/>
                            </View>

                            <View style={{marginTop: -2, alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 10, marginBottom: 5}}>
                                {error}
                                <Button
                                    click={() => this.handleAdd()}
                                    text={_('Add').toUpperCase()}
                                    buttonStatus={this.state.buttonStatus}
                                />
                            </View>
                        </View>
                    </View>
                    {button}
                </ScrollView>
            </DrawerLayout>
        );

    }

}

const styles = StyleSheet.create({
    recipientSmallWrap: {
        flexDirection: 'row',
    },
    firstName: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
    lastName: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
    phoneNumber: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginBottom: 15
    },
    buttonText: {
        fontWeight: '500',
        color: Color.buttonText
    }

});

module.exports = connect(mapStateToProps)(KeypadRecipients);
