/**
 * Created by Petr on 22.2.2017.
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
import { fetchUser } from '../../actions/index'

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}

export default class SignUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            passwordAgain: ''
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.loginWrap}>
                    <View style={styles.loginSmallWrap}>
                        <Image source={require('../../images/white-label/sunsms/logo/logo.png')} style={styles.logo} resizeMode='stretch'/>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="mail-outline" style={{color: 'white', marginTop: 20, marginRight: 15}} size={25}/>
                                <TextInput
                                    onChangeText={(email) => this.setState({email})}
                                    value={this.state.email}
                                    style={styles.input}
                                    placeholder={_('Email')}
                                    placeholderTextColor="white"
                                    keyboardType='email-address'
                                    underlineColorAndroid="white"/>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="lock-outline" style={{color: 'white', marginTop: 20, marginRight: 15}} size={25}/>
                                <TextInput
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}
                                    style={styles.input}
                                    placeholder={_('Password')}
                                    placeholderTextColor="white"
                                    underlineColorAndroid="white"
                                    secureTextEntry={true}/>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="lock-outline" style={{color: 'white', marginTop: 20, marginRight: 15}} size={25}/>
                                <TextInput
                                    onChangeText={(passwordAgain) => this.setState({passwordAgain})}
                                    value={this.state.passwordAgain}
                                    style={styles.input}
                                    placeholder={_('Password again')}
                                    placeholderTextColor="white"
                                    underlineColorAndroid="white"
                                    secureTextEntry={true}/>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>Actions.SignUpStepTwo()}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('continue').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                            <TouchableOpacity>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={()=>Actions.SignIn()}>
                                        <Text style={{color: 'white', fontSize: 18}}>{_('back').toUpperCase()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.7)'
    },
    loginWrap: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    loginSmallWrap: {
        width: window.width/4 * 3 +25,
        height: window.height,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50
    },
    logo: {
        width: 150,
        height: 110,
    },
    input: {
        width: window.width/ 10 * 7,
        color: 'white',
        borderBottomColor: 'white',
        marginTop: 10,
        marginRight: 5
    },
    buttonWrap: {
        width: window.width/ 10 * 8,
        marginTop: 35,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginBottom: 5
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
        color: Color.buttonText
    },
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        width: window.width,
        height: 50,
        backgroundColor: 'rgba(6,68,100,.8)',
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center'

    }
});

module.exports = connect(mapStateToProps)(SignUp);