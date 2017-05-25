/**
 * Created by Petr on 1.2.2017.
 */
import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Color from '../config/Variables';

export default class Step extends Component{

    render(){
        let step;
        if(this.props.type == 'done'){
            step= <TouchableOpacity onPress={()=>this.props.handlePress()}>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.stepDone}>
                        <Icon style={styles.iconDone} name="done" size={25}/>
                    </View>
                    <Text style={styles.textDone}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>;
        }

        if(this.props.type == 'disabled'){
            step = <View style={{alignItems: 'center'}}>
                    <View style={styles.step}>
                        <Text style={styles.disabled}>{this.props.number}</Text>
                    </View>
                <Text style={styles.disabledText}>{this.props.title}</Text>
            </View>;
        }

        if(this.props.type == 'active'){
            step = <View style={{alignItems: 'center'}}>
                    <View style={styles.stepActive}>
                        <Text style={styles.activeNumber}>{this.props.number}</Text>
                    </View>
                <Text style={styles.activeText}>{this.props.title}</Text>
            </View>;
        }

        return (
            <View>
                {step}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    stepDone: {
        backgroundColor: Color.stepDone,
        width: 42,
        height: 42,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stepActive: {
        backgroundColor: Color.stepActive,
        width: 42,
        height: 42,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    step: {
        backgroundColor: Color.stepDisabled,
        width: 42,
        height: 42,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabled: {
        color: Color.stepDisabledIcon,
        fontWeight: '500'
    },
    disabledText: {
        color: Color.stepDisabledText,
        fontWeight: '500'
    },
    activeNumber: {
        color: Color.stepActiveIcon,
        fontWeight: '500'
    },
    activeText: {
        color: Color.stepActiveText,
        fontWeight: '500'
    },
    iconDone: {
        color: Color.stepDoneIcon
    },
    textDone: {
        color: Color.stepDoneText,
        fontWeight: '500',
    }
});