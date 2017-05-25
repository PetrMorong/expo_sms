/**
 * Created by Petr on 21.2.2017.
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
import Menu from './/Menu';
import Toolbar from './Toolbar';
import Color from '../config/Variables';
import { connect } from 'react-redux';
import { save } from '../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}


export default class ChatDetail extends Component{

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbarContainer} elevation={2}>
                    <TouchableOpacity onPress={()=>Actions.pop()}>
                        <Icon style={{color: 'white'}} name="arrow-back" size={30}/>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                        <Text style={styles.toolbarNumber}>+420 258 489 655</Text>
                    </View>
                    <Icon style={{color: 'white'}} name="phone" size={22}/>
                </View>
                <View style={{padding: 15}}>
                    <Text style={styles.message}>I reall loved the guitar no kidding matea sdkj ska static d constructors async</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: 15}}>
                            <Text>{_('Operator')}</Text>
                            <Text>{_('Credit')}</Text>
                            <Text>{_('Country')}</Text>
                            <Text>{_('Sender id')}</Text>
                            <Text>{_('Username')}</Text>
                            <Text>{_('Status')}</Text>
                        </View>
                        <View>
                            <Text>T-mobile CZ</Text>
                            <Text>0.132 $</Text>
                            <Text>Guadelope</Text>
                            <Text>HOHIOHEN</Text>
                            <Text>ps546546546sda</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name='done' size={20} style={{marginRight: 5,color: 'green'}}/>
                                <Text>Sent</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomToolbar} elevation={2}>
                    <View style={styles.bottomToolbarItem}>
                        <Icon name="call-made" style={styles.bottomToolbarIcon}/>
                        <Text style={styles.bottomToolbarText}>{_('Redirect')}</Text>
                    </View>
                    <View style={styles.bottomToolbarItem}>
                        <Icon name="content-copy" style={styles.bottomToolbarIcon}/>
                        <Text style={styles.bottomToolbarText}>{_('Copy')}</Text>
                    </View>
                    <View style={styles.bottomToolbarItem}>
                        <Icon name="delete" style={styles.bottomToolbarIcon}/>
                        <Text style={styles.bottomToolbarText}>{_('Delete')}</Text>
                    </View>
                    <View style={styles.bottomToolbarItem}>
                        <Icon name="textsms" style={styles.bottomToolbarIcon}/>
                        <Text style={styles.bottomToolbarText}>{_('Answer')}</Text>
                    </View>
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
    toolbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.primaryColor,
        height: 60,
        padding: 15,
    },
    toolbarNumber: {
        color: 'white',
        marginLeft: 15,
        fontSize: 20
    },
    message: {
        color: 'black',
        fontSize: 16,
        marginBottom: 20
    },
    bottomToolbar: {
        elevation: 2,
        position: 'absolute',
        width: window.width,
        bottom: 0,
        height: 60,
        backgroundColor: Color.primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomToolbarItem: {
        width: window.width / 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomToolbarText: {
        color: 'white'
    },
    bottomToolbarIcon: {
        color: 'white',
        fontSize: 20
    }
});

module.exports = connect(mapStateToProps)(ChatDetail);