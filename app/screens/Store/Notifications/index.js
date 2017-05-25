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
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { save, fetch } from '../../../actions/index';
import { Actions } from 'react-native-router-flux';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        notifications: store.notifications,
        storeSettings: store.storeSettings
    }
};

export default class Notifications extends Component{
    constructor(props){
        super(props)
        this.state = {
            reRender: 1
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.notifications.data){
            this.setState({reRender: this.state.reRender + 1})
        }
    }

    componentWillMount(){
        this.props.dispatch(fetch('store/get-notifications', {reducer: 'notifications'} ,{store_id: this.props.storeSettings.data.result.id}))
    }

    renderIcon(bool){
        if(bool){
            return <Icon name="check-circle" size={25} style={styles.b}/>
        }else{
            return <Icon name="cancel" size={25} style={{color: '#a3bdcb'}}/>
        }
    }


    render() {
        let menu  = <Menu/>;

        let loader;
        if(this.props.notifications.fetching){
            loader = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }

        let view;
        try{
            view = <View style={styles.container}>
                <Text style={{color: Color.primaryColor, fontWeight: '500', fontSize: 18}}>{_('Customer')}</Text>
                <TouchableOpacity onPress={() => Actions.CustomerSms()}>
                    <View style={styles.row}>
                        <Icon name="textsms" size={25} style={{color: '#BE2166'}}/>
                        <View style={[styles.a, styles.border]}>
                            <Text style={{color: 'black', fontSize: 16}}>SMS</Text>
                            {this.renderIcon(this.props.notifications.data.result.notifications.store_values.customer_notification_sms)}
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.CustomerEmail()}>
                    <View style={styles.row}>
                        <Icon name="mail-outline" size={25} style={{color: '#BE2166'}}/>
                        <View style={styles.a}>
                            <Text style={{color: 'black', fontSize: 16}}>Email</Text>
                            {this.renderIcon(this.props.notifications.data.result.notifications.store_values.customer_notification_email)}
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={{color: Color.primaryColor, fontWeight: '500', fontSize: 18, marginTop: 25}}>{_('Shop owner')}</Text>
                <TouchableOpacity onPress={() => Actions.OwnerSms()}>
                    <View style={styles.row}>
                        <Icon name="textsms" size={25} style={{color: '#BE2166'}}/>
                        <View style={[styles.a, styles.border]}>
                            <Text style={{color: 'black', fontSize: 16}}>SMS</Text>
                            {this.renderIcon(this.props.notifications.data.result.notifications.store_values.store_notification_sms)}
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.OwnerEmail()}>
                    <View style={styles.row}>
                        <Icon name="mail-outline" size={25} style={{color: '#BE2166'}}/>
                        <View style={styles.a}>
                            <Text style={{color: 'black', fontSize: 16}}>Email</Text>
                            {this.renderIcon(this.props.notifications.data.result.notifications.store_values.store_notification_email)}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        }catch(e){}


        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Notifications')}
                    elevation={2}
                    back={true}/>
                {loader}
                {view}
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
        height: 70
    },
    a: {
        height: 70,
        flexDirection: 'row',
        marginLeft: 25,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    b: {
        color: '#4CAF50'
    }
});

module.exports = connect(mapStateToProps)(Notifications);