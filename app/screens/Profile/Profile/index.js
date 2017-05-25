/**
 * Created by Petr on 24.2.2017.
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import Color from '../../../config/Variables';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { save } from '../../../actions/index';
import { fromJS } from 'immutable';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        user: store.user.user.user,
        countries: store.user.user.countries,
        profile: store.profile
    }
};

export default class Profile extends Component {

    constructor(props){
        super(props)
        this.state = {
            modalVisible: false
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.profile.saving){
            this.setState({savingImage: true})
        }else{
            this.setState({savingImage: false})
        }
    }

    render() {
        let image;
        if(this.state.imageSource){
            image = <Image
                style={styles.avatar}
                source={{ uri: this.state.imageSource }}/>
        }else{
            image = <Image
                style={styles.avatar}
                source={{ uri: 'data:image/png;base64,' + this.props.user.photo }}/>
        }

        let imageIcon;
        if(this.state.savingImage){
            imageIcon =<View style={{ width: 110, height: 110, borderRadius: 50, position: 'absolute', top: 0 , alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.3)'}} >
                <ActivityIndicator style={{height: 40}} size="large"/>
            </View>
        }else{
            imageIcon = <View style={{ width: 110, height: 110, borderRadius: 500, position: 'absolute', top: 0 , alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.3)'}} >
                <Icon name="photo-camera" size={35} style={{color: 'white'}}/>
            </View>
        }

        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="containerNoBg"
                    title={_('Profile')}
                    elevation={0}/>
                <ScrollView style={styles.container}>
                    <View>
                        <View style={styles.avatarWrap}>
                            <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: true})}>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{position: 'relative'}}>
                                        {image}
                                        {imageIcon}
                                    </View>
                                    <Text style={styles.email}>{this.props.user.email}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.infoWrap}>
                            <View style={{padding: 15}}>
                                <Text style={styles.textHighlight}>{_('Name')}</Text>
                                <Text style={styles.textHighlight}>{_('Phone number')}</Text>
                                <Text style={styles.textHighlight}>{_('Timezone')}</Text>
                                <Text style={styles.textHighlight}>{_('Country')}</Text>
                            </View>
                            <View style={{padding: 15}}>
                                <Text style={styles.marginTop}>{this.props.user.first_name} {this.props.user.last_name}</Text>
                                <Text style={styles.marginTop}>{this.props.user.phone_number}</Text>
                                <Text style={styles.marginTop}>{this.props.user.timezone}</Text>
                                <Text style={styles.marginTop}>{this.props.countries[this.props.user.country]}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>Actions.BaseInformations()}>
                            <View style={{paddingLeft: 15, paddingRight: 30, marginTop: -45, flexDirection: "row", alignItems: "flex-end", flex: 1, justifyContent: "flex-end"}}>
                                <View style={styles.actionStatus}>
                                    <Icon name="edit" size={25} style={{color: Color.buttonText}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.actionWrap}>
                            <TouchableOpacity onPress={()=>Actions.ChangePassword()}>
                                <View style={{alignItems: 'center', width: 100}}>
                                    <Icon name="lock-outline" size={30} style={styles.actionIcon}/>
                                    <Text style={styles.colorAndMargin}>{_('Change password')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>Actions.PaymentData()}>
                                <View style={{alignItems: 'center', width: 80}}>
                                    <Icon name="location-on" size={30} style={styles.actionIcon}/>
                                    <Text style={styles.colorAndMargin}>{_('Payment data')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>Actions.ContactVerification()}>
                                <View style={{alignItems: 'center', width: 80}}>
                                    <Icon name="phone-android" size={30} style={styles.actionIcon}/>
                                    <Text style={styles.colorAndMargin}>{_('Contact verification')}</Text>
                                </View>
                            </TouchableOpacity>
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
                                        <Text style={styles.modalText}>{_('Take a photo')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.choosePhoto()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="collections" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>{_('Choose from gallery')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </DrawerLayout>
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

            this.props.dispatch(save('profile/save-image', {reducer: 'profile'} ,{photo: image.data}));

            let map = fromJS(this.props.user).merge({photo: image.data}).toJS();

            this.props.dispatch({type: 'PROFILE_SAVE_SUCCESS', payload: map});

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

            this.props.dispatch(save('profile/save-image', {reducer: 'profile'} ,{photo: image.data}));

            let map = fromJS(this.props.user).merge({photo: image.data}).toJS();

            this.props.dispatch({type: 'PROFILE_SAVE_SUCCESS', payload: map});

            this.setState({
                imageSource: image.path
            });
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.background
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55
    },
    actionIcon:{
        color: Color.displayText
    },
    colorAndMargin: {
        color: Color.displayText,
        marginTop: 5,
        textAlign: 'center'
    },
    avatarWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 75,
        backgroundColor: Color.secondaryColor
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: Color.separator
    },
    buttonWrap: {
        width: 110,
        paddingTop: 12,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        marginRight: 15,
        marginTop: 5
    },
    email: {
        color: 'white',
        fontSize: 16,
        marginTop: 15
    },
    textHighlight: {
        fontWeight: '500',
        marginBottom: 7,
        color: Color.displayText2
    },
    infoWrap: {
        margin: 15,
        height: 130,
        backgroundColor: Color.cardBackground,
        borderRadius: 3,
        marginTop: -40,
        elevation: 1,
        flexDirection: 'row',
        position: 'relative'
    },
    marginTop: {
        marginBottom: 7,
        color: Color.displayText2
    },
    actionStatus: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Color.button,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 990,
        elevation: 3
    },
    actionWrap: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        margin: 15,
        backgroundColor: Color.cardBackground,
        borderRadius: 2,
        elevation: 1,
        marginTop: 20
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
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
});

module.exports = connect(mapStateToProps)(Profile);
