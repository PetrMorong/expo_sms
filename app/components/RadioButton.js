/**
 * Created by Petr on 4.5.2017.
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
    ScrollView
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Color from '../config/Variables';

const window = Dimensions.get('window');

export default class RadioButton extends Component {
    render() {

        let view;
        if(this.props.active){
            view = <View style={{width: 24, height: 24, backgroundColor: 'white', borderRadius: 50,  borderColor: Color.secondaryColor, borderWidth: 3, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: 13, height: 13, borderRadius: 50,  backgroundColor: Color.secondaryColor, }}/>
            </View>
        }else{
            view = <View style={{width: 24, height: 24,  borderRadius: 50, borderColor: '#717171', borderWidth: 3, alignItems: 'center', justifyContent: 'center'}}>
            </View>
        }

        return (
            <View>
                {view}
            </View>
        )
    }
}

