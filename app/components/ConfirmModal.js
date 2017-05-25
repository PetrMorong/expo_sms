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
    ActivityIndicator
} from 'react-native';

const window = Dimensions.get('window');

export default class ConfirmModal extends Component {

    handleOk(){
        this.props.handleOk()
    }

    render() {

        let view;
        if(this.props.deleting){
            view = <ActivityIndicator
                style={{height: 150}}
                size="large"
            />
        }else{
            view = <View style={{ width: window.width/5 * 4 - 25}}>
                <View style={styles.textWrap}>
                    <Text style={styles.text}>{_('Delete')} {this.props.numberOfItemsToDelete} {_('items')} ?</Text>
                </View>
                <View >
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={()=>this.props.handleClose()}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                    {_('Cancel').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.handleOk()}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                    {_('Delete').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }

        return (
            <Modal
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.handleClose()}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={()=>this.props.handleClose()} >
                        <View style={styles.touchableClose} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalSmallContainer}>
                        {view}
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: 0.9
    },
    modalSmallContainer: {
        backgroundColor: 'white',
        width: window.width/5 * 4,
        height: 130,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
    text: {
        color: 'black',
        fontSize: 19,

    },
    textWrap: {
        height: 70,
        padding: 15
    }
});