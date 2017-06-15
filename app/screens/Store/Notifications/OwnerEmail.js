/**
 * Created by Petr on 9.2.2017.
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
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { saveImage } from '../../../actions/index'
import { Actions } from 'react-native-router-flux';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import Button from '../../../components/Button';
import DrawerLayout from 'react-native-drawer-layout';


const mapStateToProps = (store) => {
    return{
        notifications: store.notifications,
        storeSettings: store.storeSettings
    }
};

export default class OwnerEmail extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: this.props.notifications.data.result.notifications.admin_email.message,
            active: this.props.notifications.data.result.notifications.store_values.store_notification_email,
            contact: this.props.notifications.data.result.notifications.admin_email.contact,
            error: false
        }
    }

    handleSave(){

        if(this.state.message !== undefined && this.state.contact !== undefined){
            let store_values = this.props.notifications.data.result.notifications.store_values;

            this.props.dispatch(saveImage('store/save-notifications', {contact: this.state.contact, message: this.state.message ,type: 'admin_email', id: this.props.storeSettings.data.result.id, store_values: {...store_values, store_notification_email: this.state.active}}));

            Actions.Notifications();
        }else{
            this.setState({error: true})
        }


    }

    render(){
        let menu  = <Menu/>;

        let view;
        if(this.state.active){
            view = <View>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <TextInput
                        style={{marginTop: 10}}
                        placeholder={_('Email address')}
                        multiline={true}
                        onChangeText={(contact) => this.setState({contact})}
                        value={this.state.contact}/>
                    <TextInput
                        style={{height: 100}}
                        placeholder={_('Email text')}
                        ref="message"
                        multiline={true}
                        onChangeText={(message) => this.setState({message})}
                        value={this.state.message}/>
                </View>
            </View>
        }

        let error;
        if(this.state.error){
            error = <Text style={{color: 'red', marginBottom: 10}}>{_('Fill the address and text')}</Text>
        }


        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Owner email')}
                    elevation={2}
                    back={true}/>
                <View style={[styles.container, {padding: 15}]}>
                    <View>
                        <View style={styles.switchWrap}>
                            <Text>{_('Activate')}</Text>
                            <Switch
                                onValueChange={(value) => this.setState({active: value})}
                                value={this.state.active} />
                        </View>
                        <View style={styles.separator}/>
                    </View>
                    {view}
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        {error}
                        <View style={{alignItems: 'flex-end'}}>
                            <Button
                                click={() => this.handleSave()}
                                text={_('Save').toUpperCase()}
                                buttonStatus={this.state.buttonStatus}
                            />
                        </View>
                    </View>
                </View>
            </DrawerLayout>
        )
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

module.exports = connect(mapStateToProps)(OwnerEmail);