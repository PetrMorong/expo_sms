/**
 * Created by Petr on 9.2.2017.
 */
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    ActivityIndicator
} from 'react-native';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { save, fetch } from '../../../actions/index';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return {
        contactVerification: store.contactVerification,
        user: store.user.user.user
    }
};


export default class ContactVerification extends Component{
    constructor(props){
        super(props);
        this.state = {
            showSend: false,
            data: {},
            typeCodePhone: false,
            buttonStatus: 'default'
        }
    }

    componentWillMount(){
        this.props.dispatch(fetch('profile/get-verified-numbers', {reducer: 'contactVerification'}))
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.contactVerification.data){
            this.setState({data: nextProps.contactVerification.data.data.data})
        }

        if(nextProps.contactVerification.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.contactVerification.saved){
            this.setState({buttonStatus: 'saved'})
        }

        if(nextProps.contactVerification.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSendCode(){
        this.props.dispatch(save('profile/verify-number', {number: this.props.user.phone_number, iso: this.props.user.country}));
        this.setState({typeCodePhone: true})
    }

    handleVerifyCode(){
        this.props.dispatch(save('profile/check-code'), {number: this.props.user.phone_number, code: this.state.code})
    }

    render() {
        let menu  = <Menu/>;
        let loader;
        if(this.props.contactVerification.fetching){
            loader = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }

        let verifyPhoneButton;
        if(!this.state.showSend){
            if(!this.state.data){
                verifyPhoneButton = <TouchableOpacity onPress={() => this.setState({showSend: true})}>
                    <View style={styles.buttonWrap}>
                        <Text style={styles.buttonText}>{_('verify').toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            }else{
                try{
                    let verified = Object.keys(this.state.data).map((item) => {
                        return this.state.data[item].active
                    });

                    if(verified[0]){
                        verifyPhoneButton = <Icon name="check-circle" size={25} style={styles.b}/>;
                    }else{
                        verifyPhoneButton = <TouchableOpacity onPress={() => this.setState({showSend: true})}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('verify').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                }catch(e){}
            }
        }

        let sendCodePhone;
        if(this.state.showSend && !this.state.typeCodePhone){
            sendCodePhone = <View style={{marginLeft: 50, flexDirection: 'row', marginTop: 10, marginBottom: 15}}>
                <View style={{flex: 1}}>
                    <Text>{_('Verification code will be')}</Text>
                    <Text>{_('sent to your number')}</Text>
                </View>
                <TouchableOpacity onPress={() => this.handleSendCode()}>
                    <View style={styles.buttonWrap}>
                        <Text style={styles.buttonText}>{_('send').toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        }

        let typeCodePhone;
        if(this.state.typeCodePhone){
            typeCodePhone = <View style={{marginLeft: 50, flexDirection: 'row', marginTop: 10, marginBottom: 15}}>
                <View style={{flex: 1}}>
                    <TextInput
                        onChangeText={(code) => this.setState({code})}
                        value={this.state.code}
                        keyboardType='numeric'
                        style={{flex: 1, marginRight: 10, }}
                        placeholder={_('code')}
                    />
                </View>
                <View style={{width: 80}}>
                    <TouchableOpacity onPress={() => this.handleVerifyCode()}>
                        <View style={styles.buttonWrap}>
                            <Text style={styles.buttonText}>{_('save').toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
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
                    title={_('Contact verification')}
                    elevation={0}
                    back={true}/>
                {loader}
                <View style={styles.container}>

                    <View style={[styles.border]}>
                        <View style={styles.row}>
                            <Icon name="phone-android" size={30} style={{color: '#BE2166'}}/>
                            <View style={{flex: 1}}>
                                <View style={styles.a}>
                                    <View>
                                        <Text>{_('Phone number')}</Text>
                                        <Text style={{color: '#064769',fontWeight: '500', fontSize: 16}}>{this.props.user.phone_number}</Text>
                                    </View>
                                    <View style={{width: 80, alignItems: 'flex-end'}}>
                                        {verifyPhoneButton}
                                    </View>
                                </View>
                            </View>
                        </View>
                        {sendCodePhone}
                        {typeCodePhone}
                    </View>
                    <View style={styles.row}>
                        <Icon name="mail-outline" size={30} style={{color: '#BE2166'}}/>
                        <View style={styles.a}>
                            <View>
                                <Text>{_('email')}</Text>
                                <Text style={{color: '#064769',fontWeight: '500', fontSize: 16}}>{this.props.user.email}</Text>
                            </View>
                            <Icon name="check-circle" size={25} style={styles.b}/>
                        </View>
                    </View>
                </View>
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80
    },
    a: {
        flexDirection: 'row',
        marginLeft: 25,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    b: {
        color: '#4CAF50'
    },
    buttonWrap: {
        width: 80,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
    buttonText: {
        fontWeight: '500',
        color: Color.buttonText
    }

}) ;

module.exports = connect(mapStateToProps)(ContactVerification);