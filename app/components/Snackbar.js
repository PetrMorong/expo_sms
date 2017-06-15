/**
 * Created by Petr on 20.4.2017.
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
    Animated,
    Easing
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';

const window = Dimensions.get('window');

export default class Snackbar extends Component {
    constructor(props){
        super(props)
        this.snackbarPosition = new Animated.Value(-55)
    }

    animate(){
        console.log('called')
        Animated.timing(
            this.snackbarPosition,
            {
                toValue: 0,
                duration: 2000,
                easing: Easing.linear()
            }
        ).start()
    }

    render() {

        let view;
        if(this.props.show){
            this.animate()
            view = <Animated.View style={{
                height: 55,
                backgroundColor: '#323232',
                paddingLeft: 20,
                justifyContent: 'center',
                position: 'absolute',
                bottom: this.snackbarPosition,
                width: window.width
            }}>
                <Text style={{color: 'white', fontSize: 16}}>{this.props.text}</Text>
            </Animated.View>
        }

        return (
            <View>
                {view}
            </View>
        )
    }

}
