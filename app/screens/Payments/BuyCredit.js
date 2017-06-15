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
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}

export default class BuyCredit extends Component{

    render() {
        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="containerNoBg"
                    title={_('Buy credit')}
                    elevation={0}/>
                <View style={styles.container}>
                    <View style={{alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
                        <Image resizeMode='stretch' source={require('../../images/white-label/sunsms/BuyCredit.png')} style={{marginTop: 15, width: 220, height: 180}}/>
                    </View>
                    <View style={styles.backgroundCardImage}/>
                    <View style={styles.choosePayment}>
                        <View style={styles.row}>
                            <Image resizeMode='stretch' style={{width: 55, height: 50, marginRight: 20}} source={require('../../images/visa.png')}/>
                            <Text style={styles.text}>{_('Credit cards')}</Text>
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.row}>
                            <Image resizeMode='stretch' style={{width: 55, height: 40, marginRight: 20}} source={require('../../images/bank.jpg')}/>
                            <Text style={styles.text}>{_('Bank transfer')}</Text>
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.row}>
                            <Image resizeMode='stretch' style={{width: 55, height: 50, marginRight: 20}} source={require('../../images/paypal.jpg')}/>
                            <Text style={styles.text}>PayPal</Text>
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.row}>
                            <Image resizeMode='stretch' style={{width: 55, height: 50, marginRight: 20}} source={require('../../images/skrill.jpg')}/>
                            <Text style={styles.text}>Skrill</Text>
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
       backgroundColor: 'white'
   },
    backgroundCardImage: {
       backgroundColor: Color.secondaryColor,
        position: 'absolute',
        top: 0,
        height: window.height/3 + 20,
        width: window.width
   },
   choosePayment: {
       position: 'absolute',
       top: window.height/3 + 20,
       padding: 15
   },
    text: {
       fontSize: 18,
        color: '#6A6861'
    },
    row: {
       flexDirection: 'row',
        alignItems: 'center',
        width: window.width,
        height: 65
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },




});

module.exports = connect(mapStateToProps)(BuyCredit);