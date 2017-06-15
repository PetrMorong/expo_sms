/**
 * Created by Petr on 27.3.2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Color from '../config/Variables';
import { connect } from 'react-redux';

const window = Dimensions.get('window');

export default class SuccessError extends Component {
    render() {

        let view;
        if(this.props.display == 'error' ){
            view = <View style={[styles.container, {backgroundColor: Color.error}]}>
                <Icon name="error-outline" style={{color: 'white', opacity: 1, marginRight: 30}} size={35}/>
                <Text style={{color: 'white', flex: 1, fontSize: 20}}>{this.props.errorMessage}</Text>
                <TouchableOpacity >
                    <Icon name="close" style={{color: 'white', opacity: 1}} size={35}/>
                </TouchableOpacity>
            </View>;
        }else if(this.props.display == 'success' ){
            view = <View style={[styles.container, {backgroundColor: Color.success}]}>
                <Icon name="done" style={{color: 'white', opacity: 1, marginRight: 30}} size={35}/>
                <Text style={{color: 'white', flex: 1, fontSize: 20}}>{this.props.successMessage}</Text>
                <TouchableOpacity >
                    <Icon name="close" style={{color: 'white', opacity: 1}} size={35}/>
                </TouchableOpacity>
            </View>;
        }

        return (
            <View>
                {view}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: window.width,
        height: 70,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 999,
        opacity: .8,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10

    }
});

module.exports = connect()(SuccessError);