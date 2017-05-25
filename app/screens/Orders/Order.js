/**
 * Created by Petr on 15.2.2017.
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
import Menu from '../../components/Menu';
import Toolbar from '../../components/Toolbar';
import Color from '../../config/Variables';
import { connect } from 'react-redux';
import { save } from '../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}

export default class Order extends Component{

    render() {
        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <ScrollView style={styles.container}>
                    <View style={styles.toolbarContainer}>
                        <TouchableOpacity onPress={() => Actions.pop()}>
                            <Icon style={{color: 'white'}} name="arrow-back" size={25}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}>
                            <Text style={styles.orderIdText}>{_('Order id')}: 99</Text>
                        </View>
                        <Icon style={styles.actionIcon} name="mail-outline" size={25} />
                        <Icon style={styles.actionIcon} name="textsms" size={25} />
                        <Icon style={styles.actionIcon} name="phone" size={25} />
                    </View>
                    <Image style={styles.coverImage} source={require('../../images/guitarCover.jpg')}/>
                    <View style={styles.orderMiddle}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                            <Text style={{color: Color.orderName, fontSize: 23}}>Old school guitar</Text>
                            <Text style={{color: Color.orderName, fontSize: 14, paddingLeft: 10}}>2ks</Text>
                        </View>
                        <Text style={{color: 'white', fontSize: 20}}>1500 $</Text>
                    </View>
                    <View style={styles.actionStatus} elavation={2}>
                        <Icon name="done" size={35} style={{color: Color.buttonText}}/>
                    </View>
                    <View style={{padding: 15}}>
                        <Text style={{color: '#011D2B', fontWeight: '500'}}>{_('Customer')}</Text>
                        <View style={styles.row}>
                            <Icon name="person" size={20} style={styles.customerIcon}/>
                            <Text style={styles.textHighlight}>Petr Morong</Text>
                        </View>
                        <View style={styles.row}>
                            <Icon name="phone" size={20} style={styles.customerIcon}/>
                            <Text style={styles.textHighlight}>+420 654 489 135</Text>
                        </View>
                        <View style={styles.row}>
                            <Icon name="mail" size={20} style={styles.customerIcon}/>
                            <Text style={styles.textHighlight}>moriandr73@gmail.com</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                    <View style={{padding: 15}}>
                        <Text style={{color: '#011D2B', fontWeight: '500'}}>{_('Location')}</Text>
                        <View style={styles.row}>
                            <Text style={styles.textHighlight}>Revoluční 34</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.textHighlight}>Šumperk, 787 01</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.textHighlight}>Czech republic</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                    <View style={{padding: 15}}>
                        <Text style={{color: '#011D2B', fontWeight: '500'}}>{_('Company')}</Text>
                        <View style={styles.row}>
                            <Text style={styles.textHighlight}>TOP efekt</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.textHighlight}>ID: 1212546546</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.textHighlight}>VAT: 546546546</Text>
                        </View>
                    </View>
                    <View style={styles.gradient}>
                        <Image style={styles.gradient} source={require('../../images/gradientBackground.png')} resizeMode='stretch' />
                    </View>
                </ScrollView>
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    toolbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        padding: 15,
        position: 'absolute',
        top: 0,
        zIndex: 20,
        width: window.width
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        position: 'relative'
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    coverImage: {
        width: window.width,
        height: window.height/3 + 60
    },
    orderMiddle: {
        backgroundColor: Color.secondaryColor,
        height: 100,
        padding: 15,
        zIndex: 12,
        justifyContent: 'center'
    },
    actionIcon: {
        color: 'white',
        paddingLeft: 10,
        paddingRight: 10
    },
    orderIdText: {
        color: 'white',
        marginLeft: 15,
        fontSize: 18
    },
    actionStatus: {
        position: 'absolute',
        width: 55,
        height: 55,
        borderRadius: 50,
        top: window.height / 3 + 130,
        right: 20,
        backgroundColor: Color.button,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        elevation: 2
    },
    customerIcon: {
        marginRight: 10,
    },
    textHighlight: {
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        marginTop: 10
    },
    gradient: {
        position: 'absolute',
        top: 0,
        height: window.height/3 + 60,
        width: window.width
    }
});

module.exports = connect(mapStateToProps)(Order);