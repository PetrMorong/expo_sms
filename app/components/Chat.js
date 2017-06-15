/**
 * Created by Petr on 20.2.2017.
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
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}

export default class Chat extends Component{

    constructor(props){
        super(props);
        this.state = {
            message: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbarContainer} elevation={2}>
                    <TouchableOpacity onPress={()=> Actions.pop()}>
                        <Icon style={{color: 'white'}} name="arrow-back" size={30}/>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                        <Text style={styles.toolbarNumber}>+420 258 489 655</Text>
                    </View>
                    <Icon style={{color: 'white'}} name="phone" size={22}/>
                </View>

                <View style={{flex: 1, justifyContent: 'flex-end'}}>

                    <TouchableOpacity onPress={()=>Actions.ChatDetail()}>
                        <View>
                            <Text style={{textAlign: 'center', marginBottom: 5}}>2.8.2016</Text>
                            <View style={styles.receivedMessage}>
                                <Text style={{textAlign: 'justify', color: 'black', fontSize: 15}}>
                                    I reall loved the guitar no kidding matea sdkj ska static d constructors async
                                </Text>
                                <Text style={{fontSize: 12, marginTop: 3}}>16:04</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Actions.ChatDetail()}>
                        <View style={{alignItems: 'flex-end'}}>
                            <View style={{width: window.width}}>
                                <Text style={{textAlign: 'center', marginBottom: 5}}>2.8.2016</Text>
                            </View>
                            <View style={styles.sentMessage}>
                                <Text style={{textAlign: 'justify', color: 'white', fontSize: 15}}>
                                    I really loved the guitar no kidding matea sdkj ska static d constructors async
                                </Text>
                                <View style={{alignItems: 'flex-end'}}>
                                    <Text style={{fontSize: 12, marginTop: 3, color: 'white'}}>16:04</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.messageWrap}>
                        <View style={styles.separator}/>
                        <View style={styles.messageSmallWrap}>
                            <TextInput
                                style={{flex: 1, borderWidth: 0}}
                                placeholder={_('Write a message...')}
                                ref="message"
                                underlineColorAndroid="transparent"
                                onChangeText={(message) => {this.setState({message})}}
                                value={this.state.message}/>
                            <Icon name="send" size={25} style={{color: Color.sendButton}}/>
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
       backgroundColor: 'white'
   },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    toolbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.toolbar,
        height: 60,
        padding: 15,
    },
    toolbarNumber: {
       color: 'white',
        marginLeft: 15,
        fontSize: 20
   },
    messageWrap: {
        width: window.width,
        marginTop: 15
   },
    messageSmallWrap: {
       flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
   },
    receivedMessage: {
       marginBottom: 10,
        maxWidth: window.width / 10 * 7,
        padding: 10,
        marginLeft: 15,
        backgroundColor: '#F1F0F0',
        borderRadius: 10
   },
    sentMessage: {
        marginBottom: 10,
        maxWidth: window.width / 10 * 7,
        padding: 10,
        marginRight: 15,
        backgroundColor: '#0084FF',
        borderRadius: 10
    }
});

module.exports = connect(mapStateToProps)(Chat);