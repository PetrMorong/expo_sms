/**
 * Created by Petr on 6.2.2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Modal,
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
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { save, fetch, saveImage} from '../../../actions/index'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-crop-picker';
import { fromJS } from 'immutable';
import Button from '../../../components/Button';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        storeSettings: store.storeSettings
    }
};

export default class StoreSettings extends Component{

    constructor(props){
        super(props)

        let data;
        try{
            data = this.props.storeSettings.data.result;
        }catch(e){
            data = {
                name: '',
            }
        }

        this.state = {
            coverSource: false,
            logoSource: false,
            modalCoverVisible: false,
            modalLogoVisible: false,
            data: data,
            editingStoreName: false,
            buttonStatus: 'default'
        }
    }

    componentWillMount(){
        this.props.dispatch(fetch('store/store-data', {reducer: 'storeSettings'}, {id: this.props.id}))
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.storeSettings.data){
            this.setState({data: nextProps.storeSettings.data.result})
        }

        if(nextProps.storeSettings.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.storeSettings.saved){
            this.setState({buttonStatus: 'saved'})
        }

        if(nextProps.storeSettings.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSave(){

        let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: this.state.data}}).toJS();

        this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

        this.props.dispatch(save('store/save-store', {reducer: 'storeSettings'}, map.data.result));

    }

    removeLogo(){
        this.setState({logoSource: false, modalLogoVisible: false});
    }

    removeCover(){
        this.setState({coverSource: false, modalCoverVisible: false});
    }

    handleCoverColorPress(){
        this.setModalCoverVisible(false);
        Actions.ColorPicker();
    }

    setModalCoverVisible(visible) {
        this.setState({modalCoverVisible: visible});
    }

    setModalLogoVisible(visible) {
        this.setState({modalLogoVisible: visible});
    }

    choosePhotoCover(){
        ImagePicker.openPicker({
            width: 1000,
            height: 500,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setModalCoverVisible(false);

            let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: {cover_photo: image.data, cover_color: ''}}}).toJS();

            this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

            this.props.dispatch(saveImage('store/change-photo', {id: this.state.data.id, photo: image.data, image_type: 'cover_photo'}));

        });

    }

    choosePhotoLogo(){
        ImagePicker.openPicker({
            width: 150,
            height: 150,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setModalLogoVisible(false);

            let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: {profile_photo: image.data}}}).toJS();

            this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

            this.props.dispatch(saveImage('store/change-photo', {id: this.state.data.id, photo: image.data, image_type: 'profile_photo'}));
        });

    }

    takePhotoCover(){
        ImagePicker.openCamera({
            width: 1000,
            height: 500,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setModalCoverVisible(false);

            let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: {cover_photo: image.data, cover_color: ''}}}).toJS();

            this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

            this.props.dispatch(saveImage('store/change-photo', {id: this.state.data.id, photo: image.data, image_type: 'cover_photo'}));

        });

    }

    takePhotoLogo(){
        ImagePicker.openCamera({
            width: 150,
            height: 150,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setModalLogoVisible(false);

            let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: {profile_photo: image.data}}}).toJS();

            this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

            this.props.dispatch(saveImage('store/change-photo', {id: this.state.data.id, photo: image.data, image_type: 'profile_photo'}));
        });
    }

    render() {
        let menu  = <Menu/>;

        let loader;
        if(this.props.storeSettings.fetching){
            loader = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }

        let cover;
        try{
            if(this.state.data.cover_photo === true){
                cover = <Image style={{width:window.width, height: 220}} resizeMode='cover' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.id + '?store_id=' + this.props.id + '&name=cover_photo&timestamp=' + Date.now() + '&do=renderImageStore'}}/>
            }else if (this.state.data.cover_photo === false){
                cover = <View style={{width: window.width, height: 220, backgroundColor: this.state.data.cover_color}}/>
            }else{
                cover = <Image style={{width:window.width, height: 220}} resizeMode='cover' source={{ uri: 'data:image/png;base64,' + this.state.data.cover_photo}}/>

            }
        }catch(e){
            cover = <View style={{width: window.width, height: 220, backgroundColor: this.state.data.cover_color}}/>
        }

        let logo;
        try{
            if(this.state.data.profile_photo === true){
                logo = <Image style={styles.logo} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.id + '?store_id=' + this.props.id + '&name=profile_photo&timestamp=' + Date.now() + '&do=renderImageStore'}}/>
            }else if(this.state.data.profile_photo === false){
                logo = <View style={[styles.logo ,{backgroundColor: '#43433F'}]}/>
            }else{
                logo = <Image style={styles.logo} resizeMode='stretch' source={{ uri: 'data:image/png;base64,' + this.state.data.profile_photo}}/>
            }
        }catch(e){
            logo = <View style={[styles.logo ,{backgroundColor: '#43433F'}]}/>
        }

        let storeName;
        try{
            if(this.state.editingStoreName){
                storeName = <View style={styles.storeWrap}>
                    <TextInput
                        onChangeText={(name) => this.setState({data: {...this.state.data, name}})}
                        value={this.state.data.name}
                        style={{width: window.width / 2}}
                        placeholder={_('Store name')}/>
                    <TouchableOpacity onPress={() => this.setState({editingStoreName: false})}>
                        <Icon name="done" size={30} style={{padding: 15, color: '#6CC2BA'}}/>
                    </TouchableOpacity>
                </View>
            }else{
                storeName = <View style={styles.storeWrap}>
                    <Text style={{fontSize: 20, color: 'black', marginLeft: 20}}>{this.state.data.name}</Text>
                    <TouchableOpacity onPress={() => this.setState({editingStoreName: true})}>
                        <Icon name="edit" size={30} style={{padding: 15, color: '#444444'}}/>
                    </TouchableOpacity>
                </View>
            }
        }catch(e){}

        let companyName;
        try{
            companyName = <View style={styles.infoLine}>
                <Icon name="work" size={20} style={{marginRight: 15}}/>
                <Text>{this.state.data.company_name}</Text>
            </View>
        }catch(e){}

        let companyAddress;
        try{
            companyAddress = <View style={styles.infoLine}>
                <Icon name="location-on" size={20} style={{marginRight: 15}}/>
                <Text>{this.state.data.street1} {this.state.data.city} {this.state.data.zip} {this.state.data.country}</Text>
            </View>
        }catch(e){}

        let companyPhone;
        try{
            companyPhone = <View style={styles.infoLine}>
                <Icon name="phone" size={20} style={{marginRight: 15}}/>
                <Text>{this.state.data.phone_number}</Text>
            </View>
        }catch(e){}

        let companyMail;
        try{
            companyMail = <View style={styles.infoLine}>
                <Icon name="mail" size={20} style={{marginRight: 15}}/>
                <Text>{this.state.data.email}</Text>
            </View>
        }catch(e){}

        let companyWww;
        try{
            companyWww = <View style={styles.infoLine}>
                <Icon name="language" size={20} style={{marginRight: 15}}/>
                <Text>{this.state.data.www}</Text>
            </View>
        }catch(e){}

        let language;
        if(this.state.data.language === 'en'){
            language = <Image source={require('../../../images/flags/24/gb.png')} resizeMode='stretch' style={{width: 30, height: 28, marginBottom: 1}}/>;
        }

        if(this.state.data.language === 'cz'){
            language = <Image source={require('../../../images/flags/24/cz.png')} resizeMode='stretch' style={{width: 30, height: 28, marginBottom: 1}}/>
        }

        if(this.state.data.language === 'sk'){
            language = <Image source={require('../../../images/flags/24/sk.png')} resizeMode='stretch' style={{width: 30, height: 28, marginBottom: 1}}/>
        }

        if(this.state.data.language === 'fr'){
            language = <Image source={require('../../../images/flags/24/fr.png')} resizeMode='stretch' style={{width: 30, height: 28, marginBottom: 1}}/>
        }

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Store')}
                    elevation={0}/>
                {loader}
                <ScrollView style={styles.container}>
                    <View>
                        {cover}
                        <TouchableOpacity onPress={(event) => this.setModalCoverVisible(true)}>
                            <View style={styles.changeCoverButton}>
                                <Icon name="photo-camera" size={20} style={{color: 'black', marginRight: 5}}/>
                                <Text style={{color: 'black', fontSize: 14}}>{_('change').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoWrap}>
                        <View style={styles.logoSmallWrap}>
                            {logo}
                            <TouchableOpacity onPress={(event) => this.setModalLogoVisible(true)}>
                                <View style={styles.changeLogoButton}>
                                    <Icon name="photo-camera" size={20} style={{color: 'black', marginRight: 5}}/>
                                    <Text style={{color: 'black', fontSize: 14}}>{_('change').toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {storeName}
                    <View style={styles.separator}/>
                    <View style={styles.infoWrap}>
                        {companyName}
                        {companyAddress}
                        {companyPhone}
                        {companyMail}
                        {companyWww}
                        <TouchableOpacity onPress={() => Actions.CompanyData()}>
                            <Text style={{marginLeft: 35, color: '#1580FD', marginTop: 5}} >{_('edit company data').toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator}/>
                    <View style={styles.actionWrap}>
                        <TouchableOpacity onPress={() => Actions.Language()}>
                            <View style={styles.actionSmallWrap}>
                                {language}
                                <Text style={{color: '#444444'}}>{_('Language')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Actions.ShortUrl()}>
                            <View style={styles.actionSmallWrap}>
                                <Icon name="language" size={25} style={{marginBottom: 5, color: '#444444'}}/>
                                <Text style={{color: '#444444'}}>{_('Short url')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Actions.Notifications()}>
                            <View style={styles.actionSmallWrap}>
                                <Icon name="add-alert" size={25} style={{marginBottom: 5, color: '#444444'}}/>
                                <Text style={{color: '#444444'}}>{_('Notifications')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Actions.OrderForm()}>
                            <View style={styles.actionSmallWrap}>
                                <Icon name="shopping-cart" size={25} style={{marginBottom: 5, color: '#444444'}}/>
                                <Text style={{color: '#444444'}}>{_('Order form')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator}/>

                    <View style={{margin: 15, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => Actions.StorePreview({cover: this.state.coverSource, logo: this.state.logoSource})}>
                            <View style={styles.secondaryButton}>
                                <Icon style={{marginRight: 10, color: Color.secondaryButtonText}} size={16} name="search"/>
                                <Text style={{color: Color.secondaryButtonText}}>{_('Preview').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                        <Button
                            click={() => this.handleSave()}
                            text={_('Save').toUpperCase()}
                            buttonStatus={this.state.buttonStatus}
                        />
                    </View>


                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalCoverVisible}
                        onRequestClose={() => this.setModalCoverVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback onPress={() => this.setModalCoverVisible(false)} >
                                <View style={styles.touchableClose} />
                            </TouchableWithoutFeedback>
                            <View style={styles.modalSmallContainer}>
                                <TouchableOpacity onPress={() => this.takePhotoCover()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="photo-camera" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Take a photo</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.choosePhotoCover()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="collections" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Choose from gallery</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.separator}/>
                                <TouchableOpacity onPress={() => this.handleCoverColorPress()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="color-lens" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Choose color</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.separator}/>
                                <TouchableOpacity onPress={() => this.removeCover()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="delete" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Remove photo</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalLogoVisible}
                        onRequestClose={() => this.setModalLogoVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback onPress={() => this.setModalLogoVisible(false)} >
                                <View style={styles.touchableClose} />
                            </TouchableWithoutFeedback>
                            <View style={styles.modalSmallContainerLogo}>
                                <TouchableOpacity onPress={() => this.takePhotoLogo()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="photo-camera" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Take a photo</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.choosePhotoLogo()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="collections" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Choose from gallery</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.separator}/>
                                <TouchableOpacity onPress={() => this.removeLogo()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="delete" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>Remove photo</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    coverWrap: {
        position: 'relative'
    },
    changeCoverButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 90,
        height: 25,
        backgroundColor: 'grey',
        opacity: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    logoWrap: {
        alignItems: 'center',
        marginTop: -60,
    },
    logo: {
        borderColor: '#D8D8D8',
        borderWidth: 2,
        padding: 2,
        width: 150,
        height: 150
    },
    logoSmallWrap: {
        borderColor: '#D8D8D8',
        borderWidth: 2,
        position: 'relative'
    },
    changeLogoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 90,
        height: 25,
        backgroundColor: 'grey',
        opacity: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    storeWrap: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    infoWrap: {
        padding: 15
    },
    infoLine: {
        flexDirection: 'row',
        marginBottom: 15
    },
    actionWrap: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    actionSmallWrap: {
        alignItems: 'center'
    },
    modalContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: 0.9
    },
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
    modalSmallContainer: {
        backgroundColor: 'white',
        width: window.width/3 * 2 + 20,
        height: 250,
        elevation: 4,
        padding: 5
    },
    modalSmallContainerLogo: {
        backgroundColor: 'white',
        width: window.width/3 * 2 + 20,
        height: 200,
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
    secondaryButton: {
        marginRight: 10,
        padding: 11,
        borderColor: Color.secondaryButton,
        borderWidth: 1,
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        height: 40
    },
    checkWrap: {
        width: 20,
        height: 20,
        backgroundColor: '#BE2166',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    a: {
        alignItems: 'center',
        width: window.width / 4 - 30,
    },
    b: {
        marginTop: 5,
        textAlign: 'center'
    },
    switchWrap: {
        height: 50,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    formInput: {
        backgroundColor: 'white',
        width: window.width/3,
        height: 30,
        borderRadius: 4,
        marginTop: 5
    },
    fakeButton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#D9E1E8'
    },

});

module.exports = connect(mapStateToProps)(StoreSettings);