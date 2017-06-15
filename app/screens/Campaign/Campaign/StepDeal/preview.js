/**
 * Created by Petr on 22.3.2017.
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
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Menu from '../../../../components/Menu';
import Toolbar from '../../../../components/Toolbar';
import Color from '../../../../config/Variables';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { save,fetch } from '../../../../actions/index';
import YouTube from 'react-native-youtube';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');


const mapStateToProps = (store) => {
    return{
        storeSettings: store.storeSettings,
        stepDeal: store.stepDeal
    }
}

export default class DealPreview extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentWillMount(){
        this.props.dispatch(fetch('store/store-data', {reducer: 'storeSettings'}, {id: this.props.data.store_id}))
    }


    render() {

        let colorTemplate = this.props.data.color_scheme

        let firstName;
        let lastName;
        let phone;
        let email;
        let country;
        let city;
        let state;
        let street;
        let zip;
        let company;
        let company_id;
        let company_vat;

        if(!this.props.storeSettings.fetching){
            if(this.props.storeSettings.data.result.form_first_name){
                firstName = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('First name')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_last_name){
                lastName = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Last name')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_phone){
                phone = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Phone number')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_email){
                email = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Email')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_country){
                country = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Country')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_city){
                city = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('City')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_state){
                state = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('State')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_street){
                street = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Street')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_zip){
                zip = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Zip')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_company){
                company = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Company')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_company_id){
                company_id = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Company id')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }

            if(this.props.storeSettings.data.result.form_company_vat){
                company_vat = <View style={{width: window.width/2, alignItems: 'center', height: 60, alignSelf: 'flex-end'}}>
                    <Text style={{color: 'white'}}>{_('Company vat')}</Text>
                    <View style={styles.formInput}>
                    </View>
                </View>
            }
        }

        let cover;
        let logo;
        //TODO CHANGE URL
        if(!this.props.storeSettings.fetching){
            if(this.props.storeSettings.data.result.cover_photo){
                cover =  <View style={{width: window.width, height: 220, backgroundColor: '#064769',borderColor: 'white', borderBottomWidth: 3}}>
                    <Image style={{width:window.width, height: 220, borderColor: 'white', borderBottomWidth: 3}} resizeMode='contain' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.data.store_id + '?store_id=' + this.props.data.store_id + '&name=cover_photo&do=renderImageStore'}}/>
                </View>
            }else{
                cover = <View style={{width: window.width, height: 220, backgroundColor: '#064769',borderColor: 'white', borderBottomWidth: 3}}/>
            }

            if(this.props.storeSettings.data.result.profile_photo){
                //TODO CHANGE URl
                logo = <View style={[styles.logo ,{backgroundColor: '#43433F'}]}>
                    <Image style={{width: 146,height: 146}} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.data.store_id + '?store_id=' + this.props.data.store_id + '&name=profile_photo&do=renderImageStore'}}/>
                </View>
            }else{
                logo = <View style={[styles.logo ,{backgroundColor: '#43433F'}]}>
                    <Image style={{width: 146,height: 146}} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.data.store_id + '?store_id=' + this.props.data.store_id + '&name=profile_photo&do=renderImageStore'}}/>
                </View>
            }
        }else{
            logo = <View style={[styles.logo ,{backgroundColor: '#43433F'}]}>
                <Image style={{width: 146,height: 146}} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.data.store_id + '?store_id=' + this.props.data.store_id + '&name=profile_photo&do=renderImageStore'}}/>
            </View>
            cover = <View style={{width: window.width, height: 220, backgroundColor: '#064769',borderColor: 'white', borderBottomWidth: 3}}/>
        }


        let clock;
        if(this.props.data.expiration_date_exceeded){
            //TODO preklad
            //TODo vypocit zda nabidka vyprsela
            clock = <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 25, color: 'black'}}>Platnost nabídky vypršela</Text>
            </View>
        }else{
            if(this.props.data.expiration_show == '1'){
                clock = <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 280, height: 90}} resizeMode='stretch' source={require('../../../../images/dealClock.jpg')} />
                </View>
            }else if(this.props.data.expiration_show == '2'){
                clock = <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 25, color: 'black'}}>{this.props.data.expiration_date}</Text>
                </View>
            }
        }

        let image;
        if(this.props.data.media_type == 'image'){
            if(this.props.data.image){
                image = <Image style={{width: window.width-40, height: 200, marginTop: 20}} resizeMode='stretch' source={{uri: 'data:image/png;base64,' + this.props.stepDeal.data.result}}/>
            }
        }else {
            image = <YouTube
                ref="youtubePlayer2"
                videoId={this.props.data.video} // The YouTube video ID
                play={false}           // control playback of video with true/false
                hidden={false}        // control visiblity of the entire view
                fullscreen={false}    // control whether the video should play inline
                loop={false}          // control whether the video should loop when ended
                apiKey='AIzaSyB4xpEevyIW99vznTQIxDfHXsVjmv3415M'

                onReady={(e)=>{this.setState({isReady: true})}}
                onChangeState={(e)=>{this.setState({status: e.state})}}
                onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
                onError={(e)=>{this.setState({error: e.error})}}
                onProgress={(e)=>{this.setState({currentTime: e.currentTime, duration: e.duration})}}

                style={{width: window.width-40, alignSelf: 'stretch', height: 220, backgroundColor: 'black', marginTop: 15}}
            />
        }

        let discount;
        if(this.props.data.opt_price){
            let style;
            if(this.props.data.template_index === 1 || this.props.data.template_index === 3){
                style = [styles.circle, {backgroundColor: Color[colorTemplate].discount}]
            } else if(this.props.data.template_index === 2){
                style = [styles.circleTemplateTwo, {backgroundColor: Color[colorTemplate].discount}]
            }

            discount = <View style={style}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}>- {this.props.data.price_discount} %</Text>
            </View>
        }

        let quantity;
        if(this.props.data.opt_quantity){
            let style;
            if(this.props.data.template_index === 1 || this.props.data.template_index === 3){
                style = [styles.circleQuantity, {backgroundColor: Color[colorTemplate].quantity}]
            } else if(this.props.data.template_index === 2){
                style = [styles.circleQuantityTemplateTwo, {backgroundColor: Color[colorTemplate].quantity }]
            }

            quantity = <View style={style}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}> {this.props.data.quantity} </Text>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}> {this.props.data.quantity_units} </Text>
            </View>
        }


        let middle;
        if(this.props.data.template_index === 1){

            let price;
            if(this.props.data.opt_price){
                price = <View style={{flexDirection: 'row', marginTop: 15, alignItems: 'center'}}>
                    <Text style={{marginRight: 15, fontSize: 30, fontWeight: '500', color: Color[colorTemplate].newPrice}}>{this.props.data.price_new} {this.props.data.price_currency}</Text>
                    <Text style={[styles.oldPrice, {color: [colorTemplate].oldPrice}]}>{this.props.data.price_old} {this.props.data.price_currency}</Text>
                </View>
            }

            middle = <View style={{padding: 20}}>
                {clock}
                <View>
                    {image}
                    {discount}
                    {quantity}
                </View>
                <View style={{alignItems: 'center', marginTop: 15}}>
                    <Text style={{fontSize: 30, color: 'black', fontWeight: '500'}}>{this.props.data.headline.toUpperCase()}</Text>
                    <Text style={{marginTop: 10}}>{this.props.data.description}</Text>
                    {price}
                </View>
            </View>
        }else if(this.props.data.template_index === 2){
            let image;
            if(this.props.data.media_type == 'image'){
                if(this.props.data.image){
                    image = <Image style={{flex: 1}} resizeMode='stretch' source={{uri: 'data:image/png;base64,' + this.props.stepDeal.data.result}}/>
                }
            }else {
                image = <YouTube
                    ref="youtubePlayer3"
                    videoId={this.props.data.video} // The YouTube video ID
                    play={false}           // control playback of video with true/false
                    hidden={false}        // control visiblity of the entire view
                    fullscreen={false}    // control whether the video should play inline
                    loop={false}          // control whether the video should loop when ended
                    apiKey='AIzaSyB4xpEevyIW99vznTQIxDfHXsVjmv3415M'

                    onReady={(e)=>{this.setState({isReady: true})}}
                    onChangeState={(e)=>{this.setState({status: e.state})}}
                    onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
                    onError={(e)=>{this.setState({error: e.error})}}
                    onProgress={(e)=>{this.setState({currentTime: e.currentTime, duration: e.duration})}}

                    style={{alignSelf: 'stretch', flex: 1, backgroundColor: 'black', marginTop: 15}}
                />
            }

            let price;
            if(this.props.data.opt_price){
                price = <View style={{flexDirection: 'column', marginTop: 15, alignItems: 'center', marginBottom: 20}}>
                    <Text style={{marginBottom: 10,fontSize: 30, fontWeight: '500', color: Color[colorTemplate].newPrice}}>{this.props.data.price_new} {this.props.data.price_currency}</Text>
                    <Text style={[styles.priceOldTemplateTwo, {color: Color[colorTemplate].oldPrice}]}>{this.props.data.price_old} {this.props.data.price_currency}</Text>
                </View>
            }

            middle = <View style={{marginTop: -70,height: 500}}>
                {image}
                <View style={styles.middleWrapTemplateTwo}>
                    <View style={{flexDirection: 'row', marginTop: -10, marginBottom: 20}}>
                        {discount}
                        {quantity}
                    </View>
                    <Text style={styles.headlineTemplateTwo}>{this.props.data.headline.toUpperCase()}</Text>
                    <Text style={styles.descriptionTemplateTwo}>{this.props.data.description}</Text>
                    {price}
                    {clock}
                </View>

            </View>
        }else if(this.props.data.template_index === 3){

            let price;
            if(this.props.data.opt_price){
                price = <View style={{alignItems: 'center'}}>
                    <View style={{ alignItems: 'center', flexDirection: 'column'}}>
                        <Text style={{fontSize: 50, fontWeight: '500', color: Color[colorTemplate].newPrice}}>{this.props.data.price_new} {this.props.data.price_currency}</Text>
                        <Text style={[styles.oldPrice, {color: [colorTemplate].oldPrice}]}>{this.props.data.price_old} {this.props.data.price_currency}</Text>
                    </View>
                </View>
            }
            middle = <View style={{padding: 20}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 30, color: 'black', fontWeight: '500'}}>{this.props.data.headline.toUpperCase()}</Text>
                    <Text style={{marginTop: 10}}>{this.props.data.description}</Text>
                </View>
                <View>
                    {image}
                    {discount}
                    {quantity}
                </View>
                {price}
                {clock}
            </View>
        }

        let formHeadline;
        let fakeButton;
        let name;
        let form;
        if(!this.props.storeSettings.fetching){
            formHeadline = <Text style={{fontSize: 25, marginTop: 15, color: 'white'}}>{this.props.storeSettings.data.result.text_form_title}</Text>
            fakeButton = <Text style={[styles.fakeButton, {backgroundColor: Color[colorTemplate].submitButton}]}>{this.props.storeSettings.data.result.text_button.toUpperCase()}</Text>
            name = <Text style={styles.storeName}>{this.props.storeSettings.data.result.name}</Text>

            if(this.props.storeSettings.data.result.hide_form){
                form = <View style={{backgroundColor: Color[colorTemplate].form, paddingBottom: 20}}>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        {formHeadline}
                    </View>
                    <View style={{marginTop: 15, flexWrap: 'wrap', flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        {firstName}
                        {lastName}
                        {phone}
                        {email}
                        {country}
                        {city}
                        {state}
                        {street}
                        {zip}
                        {company}
                        {company_id}
                        {company_vat}
                    </View>
                    <View style={{alignItems: 'center', marginTop: 15}}>
                        {fakeButton}
                    </View>
                </View>
            }

        }



        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Deal preview')}
                    elevation={2}
                    back={true}/>
                <ScrollView style={styles.container}>
                    {cover}
                    <View style={styles.logoWrap}>
                        <View style={styles.logoSmallWrap}>
                            {name}
                            {logo}
                        </View>
                    </View>
                    {middle}
                    {form}
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
    logoWrap: {
        alignItems: 'center',
        marginTop: -100,
    },
    logo: {
        borderColor: '#D8D8D8',
        borderWidth: 2,
        width: 150,
        height: 150
    },
    logoSmallWrap: {
        position: 'relative',
        alignItems: 'center'
    },
    storeName: {
        marginBottom: 10,
        color: 'white',
        fontSize: 25,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3
    },
    circle: {
        height: 70,
        width: 70,
        borderRadius: 50,
        position: 'absolute',
        top: 0,
        left: -20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleQuantity: {
        height: 70,
        width: 70,
        borderRadius: 50,
        position: 'absolute',
        top: 60,
        left: -20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleTemplateTwo: {
        height: 70,
        width: 70,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleQuantityTemplateTwo: {
        height: 70,
        width: 70,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -7
    },
    formInput: {
        backgroundColor: 'white',
        width: window.width/2- 30,
        height: 30,
        borderRadius: 4,
        marginTop: 5
    },
    fakeButton: {
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 120,
        paddingRight: 120,
        borderRadius: 3,
        fontSize: 16,
        fontWeight: '500',
        color: 'white'
    },
    middleWrapTemplateTwo: {
        alignItems: 'center',
        marginTop: 15,
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 500,
        width: window.width,
        padding: 20,
        top: 0,
        right: 0
    },
    descriptionTemplateTwo: {
        marginTop: 10,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
        color: 'white'
    },
    headlineTemplateTwo: {
        fontSize: 30,
        color: 'white',
        fontWeight: '500',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
    priceOldTemplateTwo: {
        textDecorationLine: 'line-through',
        fontSize: 20,
        fontWeight: '500'
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        fontSize: 20,
        fontWeight: '500',

    }

});

module.exports = connect(mapStateToProps)(DealPreview);

