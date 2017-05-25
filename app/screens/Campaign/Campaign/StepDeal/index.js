/**
 * Created by Petr on 5.2.2017.
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
import DatePicker from 'react-native-datepicker';
import Menu from '../../../../components/Menu';
import Toolbar from '../../../../components/Toolbar';
import Color from '../../../../config/Variables';
import { connect } from 'react-redux';
import { save,fetch, saveImage } from '../../../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Step from '../../../../components/StepperSingleStep';
import ImagePicker from 'react-native-image-crop-picker';
import RadioButton from '../../../../components/RadioButton';
import YouTube from 'react-native-youtube';
import DrawerLayout from 'react-native-drawer-layout';

const mapStateToProps = (store) => {
    return{
        campaign: store.campaign,
        storeList: store.storeList,
        timezones: store.user.user.timezones,
        dateFormats: store.user.user.date_formats,
        stepDeal: store.stepDeal
    }
}

const window = Dimensions.get('window');

export default class CampaignDeal extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.campaign.data.result.deal,
            modalVisible: false,
            modalVideoVisible: false,
        }
    }

    getDealImage(){
        this.props.dispatch(fetch('campaign/get-deal-image', {reducer: 'stepDeal'}, {id: this.props.campaign.data.result.campaign.id}))
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    selectTemplate(number){
        this.setState({data: {...this.state.data, template_index: number}})
    }

    selectColorTemplate(color_scheme){
        this.setState({data: {...this.state.data, color_scheme}})
    }

    setVariable(variable){
        this.setState({data: {...this.state.data, description: this.state.data.description + " " + "<"+variable+">"}})
    }

    choosePhoto(){
        ImagePicker.openPicker({
            width: window.width-30,
            height: 220,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setState({modalVisible: false, processingImage: true}, ()=>{
                this.props.dispatch(save('campaign/save-image', {reducer: 'stepDeal'}, {id: this.props.campaign.data.result.deal.id, image: image.data}, ()=>setTimeout(()=>this.saveImageSuccess(),10)))
            });
        });

    }

    takePhoto(){
        ImagePicker.openCamera({
            width: window.width-30,
            height: 220,
            cropping: true,
            includeBase64: true,
            cropperTintColor: '#011D2B'

        }).then(image => {
            this.setState({modalVisible: false, processingImage: true}, ()=>{
                this.props.dispatch(save('campaign/save-image', {reducer: 'stepDeal'}, {id: this.props.campaign.data.result.deal.id, image: image.data}, ()=>setTimeout(()=>this.saveImageSuccess(),10)))
            });
        });
    }

    saveImageSuccess(){
        this.setState({data: {...this.state.data, image: true}, processingImage: false}, ()=>this.getDealImage())
    }

    removePhoto(){
        this.setState({data: {...this.state.data, image: false}, modalVisible: false}, ()=>{
            this.props.dispatch(saveImage('campaign/remove-image', {id: this.props.campaign.data.result.deal.id}, {reducer: 'stepDeal'}))
        });
    }

    goToPreview(){
        let data = {
            data: this.state.data
        };

        Actions.DealPreview(data);
    }

    renderVariables(){
        let variables = Object.keys(this.props.campaign.data.result.variables).map((variable, i) => {

            let text1 = '<';
            let text2 = '>';

            if(this.props.campaign.data.result.variables[variable]){
                return <TouchableOpacity key={i} onPress={()=>this.setVariable(variable)}>
                    <View style={styles.variableStyle}>
                        <Text style={{color: 'black', fontSize: 16,  marginLeft: 5}}>{text1}</Text>
                        <Text  style={{color: '#FF9800', fontSize: 16}}>{variable}</Text>
                        <Text style={{color: 'black', fontSize: 16, flex: 1 }}>{text2}</Text>
                        <Text  style={{color: 'black', fontWeight: '500', fontSize: 16, marginRight: 5,}}>{this.props.campaign.data.result.variables[variable]} %</Text>
                    </View>
                </TouchableOpacity>
            }

        });

        if(this.state.switchVariables){
            return <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    {variables}
                </View>
                <View style={{marginBottom: 15}}/>
            </View>
        }
    }

    renderMedia(){

        if(this.state.data.media_type == 'image'){

            let content;
            if(!this.state.data.image || this.props.stepDeal.fetching){

                let icon;
                if(this.state.processingImage){
                    icon = <ActivityIndicator size="large" style={{height: 30}}/>
                }else {
                    icon = <View style={{alignItems: 'center'}}>
                        <View style={styles.b}>
                            <Icon name="image" size={35} style={{color: Color.buttonText}}/>
                        </View>
                        <Text style={{color: '#011D2B'}}>{_('Click to add image')}</Text>
                    </View>
                }

                content = <View style={styles.a}>
                    {icon}
                </View>
            }else{
                //TODO figure out vimeo
                content = <View>
                    <Image style={{ height: 220, width: window.width-30, marginTop: 15}} resizeMode='contain' source={{uri: 'data:image/png;base64,' + this.props.stepDeal.data.result}}/>

                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                        <TouchableOpacity onPress={()=>this.setState({modalVisible: true})}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 25}}>
                                <Icon name="image" size={30} style={{color: '#1580FD'}}/>
                                <Text style={{marginLeft: 5, fontSize: 16, color: '#1580FD'}}>{_('Add new image')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.removePhoto()}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="close" size={30} style={{color: '#1580FD'}}/>
                                <Text style={{marginLeft: 5, fontSize: 16, color: '#1580FD'}}>{_('Remove image')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            return <TouchableOpacity  onPress={(event) => this.setModalVisible(true)}>
                {content}
            </TouchableOpacity>


        }else{

            if(this.state.data.video == ''){
                return <TouchableOpacity  onPress={(event) => this.setState({modalVideoVisible: true})}>
                    <View style={styles.a}>
                        <View style={styles.b}>
                            <Icon name="link" size={35} style={{color: Color.buttonText}}/>
                        </View>
                        <Text style={{color: '#011D2B'}}>{_('Click to paste youtube link')}</Text>
                    </View>
                </TouchableOpacity>
            }else{
                return <View>
                    <YouTube
                        ref="youtubePlayer"
                        videoId={this.state.data.video} // The YouTube video ID
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

                        style={{width: window.width-20, alignSelf: 'stretch', height: 220, backgroundColor: 'black', marginTop: 15}}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                        <TouchableOpacity onPress={()=>this.setState({modalVideoVisible: true})}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 25,marginTop: 3}}>
                                <Icon name="link" size={30} style={{color: '#1580FD'}}/>
                                <Text style={{marginLeft: 5, fontSize: 16, color: '#1580FD'}}>{_('Add new link')}</Text>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({data: {...this.state.data, video: ''}})}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="close" size={30} style={{color: '#1580FD'}}/>
                                <Text style={{marginLeft: 5, fontSize: 16, color: '#1580FD'}}>{_('Remove video')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        }

    }

    renderColorScheme(){
        return <View style={{flexDirection: 'row', marginBottom: 15, justifyContent: 'center', flexWrap: 'wrap'}}>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme1')}>
                <View style={(this.state.data.color_scheme == 'scheme1' ? styles.activeTemplateColor : styles.templateColor)}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#4985B8', flex: 1}}/>
                        <View style={{backgroundColor: '#54B551', flex: 1}}/>
                        <View style={{backgroundColor: '#3D853B', flex: 1}}/>
                        <View style={{backgroundColor: '#37648A', flex: 1}}/>
                        <View style={{backgroundColor: '#275C89', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme2')}>
                <View style={[(this.state.data.color_scheme == 'scheme2' ? styles.activeTemplateColor : styles.templateColor)]}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#55A747', flex: 1}}/>
                        <View style={{backgroundColor: '#667264', flex: 1}}/>
                        <View style={{backgroundColor: '#3D853B', flex: 1}}/>
                        <View style={{backgroundColor: '#3A4838', flex: 1}}/>
                        <View style={{backgroundColor: '#347D27', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme3')}>
                <View style={(this.state.data.color_scheme == 'scheme3' ? styles.activeTemplateColor : styles.templateColor)}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#4985B8', flex: 1}}/>
                        <View style={{backgroundColor: '#6C7D8C', flex: 1}}/>
                        <View style={{backgroundColor: '#2E6DA0', flex: 1}}/>
                        <View style={{backgroundColor: '#4C6173', flex: 1}}/>
                        <View style={{backgroundColor: '#12416A', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme4')}>
                <View style={(this.state.data.color_scheme == 'scheme4' ? styles.activeTemplateColor : styles.templateColor)}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#BE2166', flex: 1}}/>
                        <View style={{backgroundColor: '#37AB9C', flex: 1}}/>
                        <View style={{backgroundColor: '#326C9F', flex: 1}}/>
                        <View style={{backgroundColor: '#7B3956', flex: 1}}/>
                        <View style={{backgroundColor: '#640B32', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme5')}>
                <View style={(this.state.data.color_scheme == 'scheme5' ? styles.activeTemplateColor : styles.templateColor)}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#1EACC7', flex: 1}}/>
                        <View style={{backgroundColor: '#5A5A5A', flex: 1}}/>
                        <View style={{backgroundColor: '#212223', flex: 1}}/>
                        <View style={{backgroundColor: '#026F84', flex: 1}}/>
                        <View style={{backgroundColor: '#105A68', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme6')}>
                <View style={(this.state.data.color_scheme == 'scheme6' ? styles.activeTemplateColor : styles.templateColor)}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#000000', flex: 1}}/>
                        <View style={{backgroundColor: '#E7272D', flex: 1}}/>
                        <View style={{backgroundColor: '#000000', flex: 1}}/>
                        <View style={{backgroundColor: '#3AA30C', flex: 1}}/>
                        <View style={{backgroundColor: '#E7272D', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => this.selectColorTemplate('scheme7')}>
                <View style={(this.state.data.color_scheme == 'scheme7' ? styles.activeTemplateColor : styles.templateColor)}>
                    <View style={{flexDirection: 'row', width: 60, height : 40}}>
                        <View style={{backgroundColor: '#E55B4B', flex: 1}}/>
                        <View style={{backgroundColor: '#EDC600', flex: 1}}/>
                        <View style={{backgroundColor: '#030300', flex: 1}}/>
                        <View style={{backgroundColor: '#333333', flex: 1}}/>
                        <View style={{backgroundColor: '#A42213', flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    renderStorePicker(){

        let pickerItems = Object.keys(this.props.storeList.data.result.list).map((item)=>{
            return <Picker.Item label={this.props.storeList.data.result.list[item].name} value={item} />
        })

        return <Picker
            style={styles.picker}
            selectedValue={this.state.data.store_id}
            onValueChange={(store_id) => this.setState({data: {...this.state.data, store_id}})}>
            {pickerItems}
        </Picker>
    }

    renderPrice(){
        if(this.state.data.opt_price){
            return <View>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={{flex: 1, marginLeft: 5, marginRight: 5}}
                        placeholder={_('Old price')}
                        keyboardType='numeric'
                        ref="priceOld"
                        onChangeText={(price_old) => {this.setState({data: {...this.state.data, price_old}})}}
                        value={this.state.data.price_old}/>
                    <TextInput
                        style={{flex: 1, marginLeft: 5, marginRight: 5}}
                        placeholder={_('New price')}
                        keyboardType='numeric'
                        ref="priceNew"
                        onChangeText={(price_new) => {this.setState({data: {...this.state.data, price_new}})}}
                        value={this.state.data.price_new}/>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <TextInput
                        style={{flex: 1, marginLeft: 5, marginRight: 5}}
                        placeholder={_('Discount')}
                        keyboardType='numeric'
                        ref="discount"
                        onChangeText={(price_discount) => {this.setState({data: {...this.state.data, price_discount}})}}
                        value={this.state.data.price_discount}/>
                    <TextInput
                        style={{flex: 1, marginLeft: 5, marginRight: 5}}
                        placeholder={_('Currency')}
                        ref="currency"
                        onChangeText={(price_currency) => {this.setState({data: {...this.state.data, price_currency}})}}
                        value={this.state.data.price_currency}/>
                </View>
            </View>
        }
        return <View/>
    }

    renderQuantity(){
        if(this.state.data.opt_quantity){
            return <View style={{flexDirection: 'row'}}>
                <TextInput
                    style={{flex: 1, marginLeft: 5, marginRight: 5}}
                    placeholder={_('Quantity')}
                    keyboardType='numeric'
                    ref="quantity"
                    onChangeText={(quantity) => {this.setState({data: {...this.state.data, quantity}})}}
                    value={this.state.data.quantity}/>
                <TextInput
                    style={{flex: 1, marginLeft: 5, marginRight: 5}}
                    placeholder={_('Units')}
                    ref="units"
                    onChangeText={(quantity_units) => {this.setState({data: {...this.state.data, quantity_units}})}}
                    value={this.state.data.quantity_units}/>
            </View>
        }
        return <View/>
    }

    renderExpiration(){
        if(this.state.data.opt_expiration){

            let pickerItems = this.props.timezones.map((item)=>{
                return <Picker.Item label={item} value={item} key={item}/>
            });

            let formats;
            if(this.state.data.expiration_show == 2){

                let pickerItems = Object.keys(this.props.dateFormats).map((item)=>{
                   return <Picker.Item label={this.props.dateFormats[item]} value={item} key={item}/>
                })

                formats = <View  style={[styles.switchWrap, {paddingLeft: 15, paddingRight: 15}]}>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.state.data.expiration_date_format}
                        onValueChange={(expiration_date_format) => {this.setState({data: {...this.state.data, expiration_date_format}})}}>
                        {pickerItems}
                    </Picker>
                </View>
            }

            return <View>
                <View style={{alignItems: 'center', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15, flexDirection: 'row'}}>
                    <DatePicker
                        style={{width: 150}}
                        date={this.state.data.expiration_date}
                        mode="datetime"
                        placeholder={_('Select date')}
                        format="DD.MM.YYYY HH:MM"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(expiration_date) => {this.setState({data: {...this.state.data, expiration_date}})}}
                    />
                    <Picker
                        style={{width: 140}}
                        selectedValue={this.state.data.expiration_timezone}
                        onValueChange={(expiration_timezone) => {this.setState({data: {...this.state.data, expiration_timezone}})}}>
                        {pickerItems}
                    </Picker>
                </View>
                <View  style={[styles.switchWrap, {paddingLeft: 15, paddingRight: 15}]}>
                    <Text>{_('Show expiration')}</Text>
                    <Picker
                        style={{width: 140}}
                        selectedValue={this.state.data.expiration_show}
                        onValueChange={(expiration_show) => {this.setState({data: {...this.state.data, expiration_show}})}}>
                        <Picker.Item label={_('None')} value={0} />
                        <Picker.Item label={_('Counter')} value={1} />
                        <Picker.Item label={_('Date')} value={2} />
                    </Picker>
                </View>
                {formats}

            </View>;
        }
        return <View/>
    }

    getYoutubeId(){

        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        let match = this.state.data.video.match(regExp);
        if (match && match[2].length == 11) {
            // Do anything for being valid
            // if need to change the url to embed url then use below line
            this.setState({modalVideoVisible: false, data: {...this.state.data, video: match[2]}})
        }
        return false;


    }

    render(){

        let view;
        if(this.props.campaign.fetching || this.props.storeList.fetching){
            view = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }else{
            view =  <View >
                <ScrollView style={{padding: 15}}>
                    <View>
                        <TextInput
                            placeholder={_('Headline')}
                            ref="headline"
                            onChangeText={(headline) => {this.setState({data: {...this.state.data, headline}})}}
                            value={this.state.data.headline}/>
                        <TextInput
                            style={{height: 75}}
                            multiline={true}
                            placeholder={_('Description')}
                            ref="description"
                            onChangeText={(description) => {this.setState({data: {...this.state.data, description}})}}
                            value={this.state.data.description}/>
                        <View style={{marginTop: 15, marginBottom: 10}}>
                            <View style={styles.switchWrap}>
                                <Text>{_('Personalized message')}</Text>
                                <Switch
                                    onValueChange={(value) => this.setState({switchVariables: value})}
                                    value={this.state.switchVariables} />
                            </View>
                            {this.renderVariables()}
                        </View>
                        <View style={styles.separator}/>
                        <View style={{marginTop: 15, flexDirection: 'row', }}>
                            <TouchableWithoutFeedback onPress={()=>this.setState({data: {...this.state.data, media_type: 'image'}})}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                                    <RadioButton active={this.state.data.media_type == 'image' ? true : false} />
                                    <Text style={{marginLeft: 10, fontSize: 16}}>{_('Image')}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.setState({data: {...this.state.data, media_type: 'video'}})}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                                    <RadioButton active={this.state.data.media_type == 'video' ? true : false} />
                                    <Text style={{marginLeft: 10, fontSize: 16}}>{_('Video')}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {this.renderMedia()}
                        <Text style={{marginTop: 15, marginBottom: 10}}>{_('Template')}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <TouchableOpacity onPress={(event) => this.selectTemplate(1)}>
                                <View style={(this.state.data.template_index == 1 ? styles.activeTemplate : styles.template)}>
                                    <Image style={{width: 90, height: 70}} resizeMode="stretch" source={require('../../../../images/deal/template1.png')}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(event) => this.selectTemplate(2)}>
                                <View style={[(this.state.data.template_index == 2 ? styles.activeTemplate : styles.template), {marginLeft: 10, marginRight: 10}]}>
                                    <Image style={{width: 90, height: 70}} source={require('../../../../images/deal/template2.png')}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(event) => this.selectTemplate(3)}>
                                <View style={(this.state.data.template_index == 3 ? styles.activeTemplate : styles.template)}>
                                    <Image style={{width: 90, height: 70}} source={require('../../../../images/deal/template3.png')}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Text style={{marginTop: 15, marginBottom: 10}}>{_('Color scheme')}</Text>
                        {this.renderColorScheme()}
                        <View>
                            <View style={styles.separator}/>
                            <View  style={styles.switchWrap}>
                                <Text>{_('Store')}</Text>
                                {this.renderStorePicker()}
                            </View>
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Price')}</Text>
                                <Switch
                                    onValueChange={(opt_price) => {this.setState({data: {...this.state.data, opt_price}})}}

                                    value={this.state.data.opt_price} />
                            </View>
                            {this.renderPrice()}
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Quantity')}</Text>
                                <Switch
                                    onValueChange={(opt_quantity) => {this.setState({data: {...this.state.data, opt_quantity}})}}
                                    value={this.state.data.opt_quantity} />
                            </View>
                            {this.renderQuantity()}
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Expiration')}</Text>
                                <Switch
                                    onValueChange={(opt_expiration) => {this.setState({data: {...this.state.data, opt_expiration}})}}
                                    value={this.state.data.opt_expiration} />
                            </View>
                            {this.renderExpiration()}
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Order form')}</Text>
                                <Switch
                                    onValueChange={(opt_order_form) => {this.setState({data: {...this.state.data, opt_order_form}})}}
                                    value={this.state.data.opt_order_form} />
                            </View>
                        </View>
                        <View style={styles.separator}/>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 25}}>
                            <TouchableOpacity onPress={() => this.props.handleBack()}>
                                <View style={{ padding: 15, paddingLeft: 10}}>
                                    <Text style={{ color: 'black', fontSize: 15}}>{('back').toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.goToPreview()}>
                                    <View style={styles.secondaryButton}>
                                        <Icon style={{marginRight: 10, color: Color.secondaryButtonText}} size={16} name="search"/>
                                        <Text style={{color: Color.secondaryButtonText}}>{_('Preview').toUpperCase()}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.handleNext(this.state.data)}>
                                    <View style={styles.buttonWrap}>
                                        <Text style={styles.buttonText}>{_('next').toUpperCase()}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Modal
                        animationType={"none"}
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
                                <View style={styles.separator}/>

                                <TouchableOpacity onPress={() => this.choosePhoto()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="collections" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>{_('Choose from gallery')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.separator}/>
                                <TouchableOpacity onPress={()=>this.removePhoto()}>
                                    <View style={styles.modalRow}>
                                        <Icon name="delete" size={30} style={styles.modalIcon}/>
                                        <Text style={styles.modalText}>{_('Remove image')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType={"none"}
                        transparent={true}
                        visible={this.state.modalVideoVisible}
                        onRequestClose={() => this.setState({modalVideoVisible: false})}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback onPress={(event) => this.setState({modalVideoVisible: false})} >
                                <View style={styles.touchableClose} />
                            </TouchableWithoutFeedback>
                            <View style={[styles.modalSmallContainer, {width: 280, height: 150}]}>
                                <View style={{ width: 280}}>
                                    <View style={{height: 95, justifyContent: 'center', alignItems: 'center'}}>
                                        <TextInput
                                            style={{ width: 250}}
                                            placeholder={_('Youtube link')}
                                            ref="headline"
                                            onChangeText={(video) => {this.setState({data: {...this.state.data, video}})}}
                                            value={this.state.data.video}/>
                                    </View>
                                    <View style={{marginRight: 10, marginBottom: 10}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                            <TouchableOpacity onPress={(event) => this.setState({modalVideoVisible: false})}>
                                                <View style={{padding: 15}}>
                                                    <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                                        {_('Cancel').toUpperCase()}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={(event) => this.getYoutubeId()}>
                                                <View style={{padding: 15}}>
                                                    <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                                        {_('Save').toUpperCase()}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </View>

        }

        return (
            <View style={styles.container}>
                {view}
            </View>
            )
    }

}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    smallContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5
    },
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
    stepperContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
        elevation: 2
    },
    line: {
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
        borderBottomColor: '#D0DFE8',
        borderBottomWidth: 1,
        marginBottom: 15
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    switchWrap: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    variableStyle: {
        width: window.width/2 - 15,
        flexDirection: 'row',
        paddingTop: 10,
        height: 30
    },
    a: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D3D3D3',
        height: 220,
        marginTop: 15
    },
    b: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.button,
        borderRadius: 50,
        width: 70,
        height: 70,
        marginBottom: 10
    },
    activeTemplate: {
        borderWidth: 4,
        borderColor: '#1580FD',
        width: 102,
        height: 82,
        padding: 2,
        borderRadius: 2
    },
    template: {
        borderColor: 'grey',
        borderWidth: 4,
        width: 102,
        height: 82,
        padding: 2,
        borderRadius: 2
    },
    activeTemplateColor: {
        borderWidth: 4,
        borderColor: '#1580FD',
        width: 72,
        height: 52,
        padding: 2,
        borderRadius: 2,
        margin: 5
    },
    templateColor: {
        borderColor: 'grey',
        borderWidth: 4,
        width: 72,
        height: 52,
        padding: 2,
        borderRadius: 2,
        margin: 5
    },
    secondaryButton: {
        marginRight: 10,
        padding: 11,
        borderColor: Color.secondaryButton,
        borderWidth: 1,
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonText: {
        fontWeight: '500',
        color: Color.buttonText
    },
    picker: {
        width: 170
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
        width: 280,
        height: 190,
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

module.exports = connect(mapStateToProps)(CampaignDeal);
