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
import { fetchUser } from '../../actions/index';
import ImagePicker from 'react-native-image-crop-picker';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}

export default class SignUpStepTwo extends Component {
    constructor(props){
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            phoneNumber: '',
            phonePrefix: '',
            modalVisible: false,
            imageSource: false
        }
    }

    render() {
        let image;
        if(this.state.imageSource){
            image = <Image style={{ width: 140, height: 140, borderRadius: 100}} source={{uri: this.state.imageSource}}/>
        }else{
            image = <View style={styles.profile}>
                <Icon name="photo-camera" size={70} style={{color: Color.personIcon}}/>
            </View>;
        }


        return (
            <View style={styles.container}>
                <View style={styles.loginWrap}>
                    <View style={styles.loginSmallWrap}>
                        <View>
                            <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible: true})}>
                                {image}
                            </TouchableWithoutFeedback>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="person" style={{color: 'white', marginTop: 20, marginRight: 15}} size={25}/>
                                <TextInput
                                    onChangeText={(first_name) => this.setState({first_name})}
                                    value={this.state.first_name}
                                    style={styles.input}
                                    placeholder={_('First name')}
                                    placeholderTextColor="white"
                                    underlineColorAndroid="white"/>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="person" style={{color: 'white', marginTop: 20, marginRight: 15}} size={25}/>
                                <TextInput
                                    onChangeText={(last_name) => this.setState({last_name})}
                                    value={this.state.last_name}
                                    style={styles.input}
                                    placeholder={_('Last name')}
                                    placeholderTextColor="white"
                                    underlineColorAndroid="white"/>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="phone" style={{color: 'white', marginTop: 20, marginRight: 15}} size={25}/>
                                <TextInput
                                    onChangeText={(phone_number) => this.setState({phone_number})}
                                    value={this.state.phone_number}
                                    style={styles.inputShort}
                                    placeholder={_('Phone number')}
                                    placeholderTextColor="white"
                                    underlineColorAndroid="white"
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.props.dispatch(fetchUser())}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('register').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                            <TouchableOpacity>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={()=> Actions.pop()}>
                                        <Text style={{color: 'white', fontSize: 18}}>{_('back').toUpperCase()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => this.setModalVisible(false)} >
                            <View style={styles.touchableClose} />
                        </TouchableWithoutFeedback>
                        <View style={styles.modalSmallContainer}>
                            <TouchableOpacity onPress={() => this.takePhoto()}>
                                <View style={styles.modalRow}>
                                    <Icon name="photo-camera" size={30} style={styles.modalIcon}/>
                                    <Text style={styles.modalText}>Take a photo</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.choosePhoto()}>
                                <View style={styles.modalRow}>
                                    <Icon name="collections" size={30} style={styles.modalIcon}/>
                                    <Text style={styles.modalText}>Choose from gallery</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    };

    choosePhoto(){
        ImagePicker.openPicker({
            width: 110,
            height: 110,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setModalVisible(false);
            this.setState({
                imageSource: image.path
            });
        });

    }

    takePhoto(){
        ImagePicker.openCamera({
            width: 110,
            height: 110,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setModalVisible(false);
            this.setState({
                imageSource: image.path
            });
        });
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
        height: window.height/5*4+25,
        alignItems: 'center'
    },
    logo: {
        width: 250,
        height: 65,
        marginRight: 20
    },
    input: {
        width: window.width/ 10 * 7,
        color: 'white',
        borderBottomColor: 'white',
        marginTop: 10,
        marginRight: 5
    },
    inputShort: {
        width: window.width/ 10 * 4 ,
        marginTop: 10,
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
    },
    profile: {
        width: 140,
        height: 140,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.personBackground
    },
    modalContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: 0.9
    },
    modalSmallContainer: {
        backgroundColor: 'white',
        width: window.width/3 * 2 + 20,
        height: 130,
        elevation: 4,
        padding: 5
    },
    modalRow: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        padding: 15
    },
    modalIcon: {
        marginRight: 10,
        color: '#444444'
    },
    modalText: {
        fontSize: 20,
        color: '#444444'
    },
});

module.exports = connect(mapStateToProps)(SignUpStepTwo);