/**
 * Created by Petr on 10.2.2017.
 */
import { MaterialIcons as Icon }from '@expo/vector-icons';
import React, { Component } from 'react';
import { StyleSheet, Button,  Text, Picker, View, Image, Switch,  Dimensions, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Color from '../config/Variables'

export default class Checkbox extends Component{
    render(){
        let CheckBox;
        if(this.props.checked){
            CheckBox = <TouchableOpacity onPress={() => this.props.onCheck()}>
                <View style={styles.checkWrap}>
                    <Icon name="done" size={20} style={{color: Color.checkBoxColor}}/>
                </View>
            </TouchableOpacity>
        }else{
            CheckBox = <TouchableOpacity onPress={() => this.props.onCheck()}>
                <View style={styles.unChecked}/>
            </TouchableOpacity>
        }

        return(
            <View>
                {CheckBox}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    checkWrap: {
        width: 22,
        height: 22,
        backgroundColor: Color.checkBoxBackground,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    unChecked: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: '#5A5A5A',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    }
});