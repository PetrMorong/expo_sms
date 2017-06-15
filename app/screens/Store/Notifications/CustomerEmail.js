/**
 * Created by Petr on 10.2.2017.
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
import { save, saveImage } from '../../../actions/index'
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


export default class CustomerEmail extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: this.props.notifications.data.result.notifications.customer_email.message,
            active: this.props.notifications.data.result.notifications.store_values.customer_notification_email
        }
    }

    handleSave(){

        let store_values = this.props.notifications.data.result.notifications.store_values;

        this.props.dispatch(saveImage('store/save-notifications', {message: this.state.message ,type: 'customer_email', id: this.props.storeSettings.data.result.id, store_values: {...store_values, customer_notification_email: this.state.active}}));

        Actions.Notifications();
    }

    render(){
        let menu  = <Menu/>;

        let view;
        if(this.state.active){
            view = <View>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
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

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Customer email')}
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
        fontSize: 17,
        fontWeight: '500'
    }
});

module.exports = connect(mapStateToProps)(CustomerEmail);