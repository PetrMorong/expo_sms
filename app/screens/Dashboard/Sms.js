/**
 * Created by Petr on 17.2.2017.
 */
import React, { Component } from 'react';
import { StyleSheet, Modal,  Button,  Text, Picker, View, Image, Switch,  Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';

export default class Sms extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Image source={require('../../images/campaignCreate.png')}/>
                <Image source={require('../../images/campaignCreate.png')}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
   container:{
       flex: 1,
       backgroundColor: '#F6F6F8'
   }
});