4/**
 * Created by Petr on 2.2.2017.
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
import Color from '../../../../config/Variables';
import { connect } from 'react-redux';
import { save, fetch } from '../../../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import GetSender from '../../../../helperFunctions/GetSender';
import Button from '../../../../components/Button';
import moment from 'moment';
import YouTube from 'react-native-youtube';

const mapStateToProps = (store) => {
    return{
       campaign: store.campaign,
       stepDeal: store.stepDeal
    }
};

const window = Dimensions.get('window');


export default class CampaignSummary extends Component{
    constructor(props){
        super(props)
        this.state = {
            buttonStatus: 'default',
            showSame: true,
            showDifferent: true
        }
    }

    handleSend(){

        let campaign = this.props.campaign.data.result.campaign;

        this.setState({buttonStatus: 'saving'}, ()=>{
            this.props.dispatch(save('campaign/send-campaign', {reducer: 'campaign'}, {campaign_id: campaign.id},
                ()=>setTimeout(()=>Actions.CampaignDashboard({campaign_id: campaign.campaign_id, year: moment().format('YYYY'), month: moment().format('MM')}),10)
            ))
        })
    }

    handleClick(type, value){

        if(type=='same'){
            this.setState({showSame: false, opt_delete_duplicates_same_text: value}, ()=>this.clickCallback())
        }
        if(type=='different'){
            this.setState({showDifferent: false, opt_delete_duplicates: value}, ()=>this.clickCallback())
        }
    }

    clickCallback(){

        let data = {
            campaign: {
                status: 'summary',
                opt_delete_duplicates_same_text: this.state.opt_delete_duplicates_same_text,
                opt_delete_duplicates: this.state.opt_delete_duplicates
            }
        }

        let id = this.props.campaign.data.result.campaign.id

        if(!this.state.showSame && !this.state.showDifferent){

            this.setState({saving: true},()=>{
                this.props.dispatch(save('campaign/set-value', {reducer: 'campaign'}, {id: id, data: data}, ()=>setTimeout(()=>{
                    this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: id}, ()=>this.saveFinished()))
                },10)))
            })
        }
    }

    saveFinished(){
        this.setState({saving: false})
    }

    renderView(){
        let calc = this.props.campaign.data.result.campaign.calc,
            campaign = this.props.campaign.data.result.campaign,
            deal = this.props.campaign.data.result.deal,
            lackOfFundsWholeCampaign,
            usage = (100 * (calc.__price * calc.__user.const) / calc.__user.credit),
            lackOfFunds,
            creditUsage = usage.toFixed(2) + ' %',
            price = (calc.__price * calc.__user.const);


        if(calc.__user.credit <= 0){

            lackOfFunds = <View style={{backgroundColor: '#FCCBC7', margin: 10, elevation: 1, flexDirection: 'row', padding: 15, alignItems: 'center'}}>
                <Icon name="error" size={35} style={{color: '#A21309'}}/>
                <Text style={{color: '#A21309', marginLeft: 10, flex: 1}}>{_('Lack of funds on your account')}</Text>
                <TouchableOpacity onPress={()=>Actions.BuyCredit()}>
                    <View style={{padding: 10, backgroundColor: '#A21309', elevation: 2, borderRadius: 2}}>
                        <Text style={{color: 'white', fontSize: 16}}>{_('Top up').toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            creditUsage = _('-')

        }

        if(price > 0){
            price = price.toFixed(2)
        }else{
            price = price.toFixed(4)
        }

        if(usage > 100 && calc.__user.credit > 0){
            lackOfFundsWholeCampaign = <View style={{backgroundColor: '#F8F6D2', margin: 10, elevation: 1, flexDirection: 'row', padding: 15, marginTop: 0, alignItems: 'center'}}>
                <Icon name="error" size={35} style={{color: '#9C7538'}}/>
                <Text style={{color: '#9C7538', marginLeft: 10, flex: 1}}>{_('Lack of funds to send whole campaign')}</Text>
                <TouchableOpacity onPress={()=>Actions.BuyCredit()}>
                    <View style={{padding: 10, backgroundColor: '#9C7538', elevation: 2, borderRadius: 2}}>
                        <Text style={{color: 'white', fontSize: 16}}>{_('Top up').toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        }

        let summaryCountryRow = Object.keys(calc).map((item)=>{
            if(item.substr(0, 2) !== '__'){
                return <View style={styles.b}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 10}}>
                        <Image style={{width: 45, height: 45}} source={{uri: 'http://bulkgate.com/images/flags/32/'+ calc[item].iso_code +'.png'}} />

                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[styles.colorTextSmall, {color: '#1565C0'}]}>{calc[item].__parts}</Text>
                            <Text style={{fontSize: 16}}>{_('Sms count')}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[styles.colorTextSmall, {color: '#FF9800'}]}>{calc[item].__recipients}</Text>
                            <Text style={{fontSize: 16}}>{_('Recipients')}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[styles.colorTextSmall, {color: '#E53935'}]}>{calc[item].__price}</Text>
                            <Text style={{fontSize: 16}}>{_('Credit')}</Text>
                        </View>
                    </View>
                </View>
            }
        })

        let dealInfo;
        if(this.props.campaign.data.result.campaign.type == 'smart'){

            let media;
            if(deal.media_type == 'video'){
                media = <YouTube
                    ref="youtubePlayer"
                    videoId={deal.video} // The YouTube video ID
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

                    style={{width: window.width-20, alignSelf: 'stretch', height: 200, backgroundColor: 'black', margin: 10,marginBottom: 0}}
                />
            }else{
                media = <Image style={{width: window.width-20, height: 200, margin: 10,marginBottom: 0}} resizeMode='stretch' source={{uri: 'data:image/png;base64,' + this.props.stepDeal.data.result}}/>

            }

            dealInfo = <View>
                {media}
                <View>
                    <TouchableOpacity onPress={()=>Actions.DealPreview({data: this.props.campaign.data.result.deal})}>
                        <View style={{opacity: 0.7, width: window.width-20, height: 35,backgroundColor: 'black', marginTop: -35, flexDirection: 'row', alignItems: 'center', marginLeft: 10, justifyContent: 'flex-end'}}>
                            <Text style={{color: 'white'}}>{_('Deal preview')}</Text>
                            <Icon name='visibility' size={25} style={{color: 'white', marginLeft: 10, marginRight: 10}}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.b}>
                    <View>
                        <View style={styles.c}>
                            <Text style={{fontSize: 14}}>{_('Headline')}</Text>
                            <Text>{deal.headline}</Text>
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.c}>
                            <Text style={{fontSize: 14}}>{_('Deal url')}</Text>
                            <Text>{deal.store_url_shortener}</Text>
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.c}>
                            <Text style={{fontSize: 14}}>{_('Price')}</Text>
                            {deal.opt_price ? <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: 'green', fontWeight: '500'}}>{deal.price_new} </Text>
                                    <Text>{deal.price_currency} / </Text>
                                    <Text style={{textDecorationLine: 'line-through'}}> {deal.price_old}</Text>
                                    <Text style={{textDecorationLine: 'line-through'}}> {deal.price_currency}</Text>
                                    <Text style={{color: 'green', fontWeight: '500'}}> / {deal.price_discount} </Text>
                                    <Text>%</Text>
                                </View> : <Icon name="cancel" size={25} />}
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.c}>
                            <Text style={{fontSize: 14}}>{_('Quantity')}</Text>
                            {deal.opt_quantity ? <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: 'green', fontWeight: '500'}}>{deal.quantity} </Text>
                                    <Text>{deal.quantity_units}</Text>
                                </View> : <Icon name="cancel" size={25} />}
                        </View>
                        <View style={styles.separator}/>
                        <View style={styles.c}>
                            <Text style={{fontSize: 14}}>{_('Expiration')}</Text>
                            {deal.opt_expiration ? <View style={{alignItems: 'flex-end'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: 'green', fontWeight: '500'}}>{deal.expiration_date} </Text>
                                        <Text>({deal.expiration_timezone})</Text>
                                    </View>
                                </View> : <Icon name="cancel" size={25} />}
                        </View>
                    </View>
                </View>
            </View>
        }

        if(this.props.campaign.data.result.campaign.status == 'summary'){
            return <View style={styles.container}>
                <ScrollView>
                    {lackOfFunds}
                    {lackOfFundsWholeCampaign}
                    <View style={[styles.b, {marginTop: 5}]}>
                        <View style={styles.a}>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 16, marginBottom: 5}}>{_('Total SMS')}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name="donut-large" size={35} style={{color: '#1565C0'}}/>
                                    <Text style={[styles.colorText, {color: '#1565C0'}]}>{calc.__parts}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 16, marginBottom: 5}}>{_('Valid recipients')}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name="person" size={35} style={{color: '#FF9800'}}/>
                                    <Text style={[styles.colorText, {color: '#FF9800'}]}>{calc.__recipients}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 20}}>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 16, marginBottom: 5}}>{_('Credit usage')}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name="data-usage" size={35} style={{color: '#48974C'}}/>
                                    <Text style={[styles.colorText, {color: '#48974C'}]}>{creditUsage}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 16, marginBottom: 5}}>{_('Cost')}</Text>

                                <View style={{flexDirection: 'row'}}>
                                    <Icon name="account-balance-wallet" size={35} style={{color: '#E53935'}}/>
                                    <Text style={[styles.colorText, {color: '#E53935'}]}>{price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {summaryCountryRow}

                    <View style={[styles.b, {padding: 10, paddingBottom: 0}]}>
                        <View style={{alignItems: 'flex-end'}}>
                            <View style={styles.sentMessage}>
                                <Text style={{textAlign: 'justify', color: 'white', fontSize: 15}}>
                                    {campaign.template}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={()=>Actions.TestSMS({template: campaign.template, campaign_id: campaign.id})}>
                                <View style={{borderRadius: 2, opacity: 0.8, width: window.width-20, marginLeft: -10, marginTop: 0, paddingRight: 10,height: 35,backgroundColor: 'black', flexDirection: 'row', alignItems: 'center',  justifyContent: 'flex-end'}}>
                                    <Text style={{color: 'white', marginRight: 0}}>{_('Send test SMS')}</Text>
                                    <Icon name='send' size={25} style={{color: 'white', marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.b}>
                        <View>
                            <View style={styles.c}>
                                <Text style={{fontSize: 14}}>{_('Sender')}</Text>
                                <GetSender sender={campaign.profile_id}/>
                            </View>
                            <View style={styles.separator}/>
                            <View style={styles.c}>
                                <Text style={{fontSize: 14}}>{_('Unicode')}</Text>
                                {campaign.opt_unicode ? <Icon name="check-circle" size={25} style={{color: '#4caf50'}}/> : <Icon name="cancel" size={25} />}
                            </View>
                            <View style={styles.separator}/>
                            <View style={styles.c}>
                                <Text style={{fontSize: 14}}>{_('Flash sms')}</Text>
                                {campaign.opt_flash ? <Icon name="check-circle" size={25} style={{color: '#4caf50'}}/> : <Icon name="cancel" size={25} />}
                            </View>
                            <View style={styles.separator}/>
                            <View style={styles.c}>
                                <Text style={{fontSize: 14}}>{_('Sending time')}</Text>
                                {campaign.opt_scheduled ? <Text>{campaign.scheduled_date}</Text> : <Icon name="cancel" size={25} />}
                            </View>
                            <View style={styles.separator}/>
                            <View style={styles.c}>
                                <Text style={{fontSize: 14}}>{_('Restriction')}</Text>
                                {campaign.opt_restriction ? <View style={{alignItems: 'flex-end'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{color: 'green', fontWeight: '500'}}>{campaign.restriction_sms_count_per_day} </Text>
                                            <Text>{_('Sms per day')}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text>{_('From')} </Text>
                                            <Text style={{color: 'green', fontWeight: '500'}}>{campaign.restriction_time_from} </Text>
                                        </View>
                                    </View> : <Icon name="cancel" size={25} />}
                            </View>
                        </View>
                    </View>

                    {dealInfo}

                    <View style={{padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={() => this.props.handleBack()}>
                            <Text style={{ marginLeft: 10, color: 'black', fontSize: 15}}>{_('back').toUpperCase()}</Text>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Button
                                click={() => this.handleSend()}
                                text={_('Send').toUpperCase()}
                                buttonStatus={this.state.buttonStatus}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        }else{
            let different;
            if(campaign.delete_duplicates_count > 0 && this.state.showDifferent){
                different = <View style={[styles.b, {padding: 10}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="warning" size={30} style={{color: 'red', marginRight: 5}}/>
                        <Text style={{ fontSize: 15, flex: 1}}>{_('Same phone numbers and different message')} </Text>
                        <Text style={{color: 'red',  fontSize: 20 }}> {campaign.delete_duplicates_count}x</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15}}>
                        <TouchableOpacity onPress={()=>this.handleClick('different', 0)}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                    {_('Ignore').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.handleClick('different', 1)}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                    {_('Remove').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            let same;
            if(campaign.delete_duplicates_same_text_count > 0 && this.state.showSame){
                same = <View style={[styles.b, {padding: 10}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="warning" size={30} style={{color: 'red', marginRight: 5}}/>
                        <Text style={{ fontSize: 15, flex: 1}}>{_('Same phone numbers and same message')} </Text>
                        <Text style={{color: 'red',  fontSize: 20}}> {campaign.delete_duplicates_same_text_count}x</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15}}>
                        <TouchableOpacity onPress={()=>this.handleClick('same', 0)}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                    {_('Ignore').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.handleClick('same', 1)}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                    {_('Remove').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            return  <View>
                {different}
                {same}
            </View>
        }

    }

    render(){

        let view;
        if(this.state.saving || this.props.campaign.fetching){
            view = <View style={{backgroundColor: 'white', height: window.height-120, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 30}}
                    size="large"
                />
            </View>
        }else{
            view = this.renderView()
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
        backgroundColor: '#E7F0F6',
        flex: 1,
    },
    sentMessage: {
        marginBottom: 10,
        maxWidth: window.width / 10 * 8,
        padding: 10,
        marginRight: 15,
        backgroundColor: '#0084FF',
        borderRadius: 10
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
    secondaryButton: {
        marginRight: 15,
        padding: 10,
        borderColor: Color.secondaryButton,
        borderWidth: 1,
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 1

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
    colorText: {
        fontSize: 25,
        fontWeight: '500',
        marginLeft: 10
    },
    colorTextSmall: {
        fontSize: 18,
        fontWeight: '500',
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginTop: 1
    },
    buttonText: {
       fontWeight: '500',
        color: Color.buttonText
    },
    a: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    b: {
        elevation: 1,
        margin: 10,
        marginBottom: 0,
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 5
    },
    c: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
});

module.exports = connect(mapStateToProps)(CampaignSummary);
