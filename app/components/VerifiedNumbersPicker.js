/**
 * Created by Petr on 13.4.2017.
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
import { connect } from 'react-redux';
import { fetch } from '../actions/index'

const mapStateToProps = (store) => {
    return{
        contactVerification: store.contactVerification
    }
};



class VerifiedNumbersPicker extends Component {
    constructor(props){
        super(props)
    }

    render() {

        let items;
        try{
             items = Object.keys(this.props.contactVerification.data.data.data).map((item, key)=>{
                console.log(item, key)
            });
            console.dir('here',this)
            return (
                <View style={styles.switchWrap}>
                    <Text >{this.props.title}</Text>

                    <Picker
                        style={styles.picker}
                        selectedValue={this.props.selectedValue}
                        onValueChange={(contact) => this.props.onValueChange(contact)}
                    >
                        <Picker.Item label="Choose" value=""/>
                        {items}
                    </Picker>
                </View>
            )
        }catch(e){
            return null;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    switchWrap: {
        height: 50,
        paddingRight: 5,
        paddingLeft: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});

export default connect(mapStateToProps)(VerifiedNumbersPicker);
//module.exports =