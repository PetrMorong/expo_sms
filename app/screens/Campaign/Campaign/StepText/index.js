/**
 * Created by Petr on 1.2.2017.
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
import Button from '../../../../components/Button';
import DatePicker from 'react-native-datepicker';
import Color from '../../../../config/Variables';
import { connect } from 'react-redux';
import { save } from '../../../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const mapStateToProps = (store) => {
    return{
        campaign: store.campaign,
        timezones: store.user.user.timezones,
        templateList: store.templateList
    }
};

const window = Dimensions.get('window');

export default class CampaignText extends Component {

    smsCount = 0;
    totalSmsCount = 0;

    constructor(props){
        super(props);
        this.state = {
            data: this.props.campaign.data.result.campaign,
            smsCount: 0,
            totalSmsCount: 0,
            modalVisible: false,
            error: false,
            buttonStatus: 'default'
        };
        this.countMessage(this.state.data.opt_unicode)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.templateList.newTemplate !==''){
            this.setState({data: {...this.state.data, template: nextProps.templateList.newTemplate}}, ()=>this.countMessage(this.state.data.opt_unicode))
        }

        if(nextProps.campaign.error){
            this.setState({error: nextProps.campaign.error, buttonStatus: 'default'})
        }

    }

    setVariable(variable){
        this.setState({data: {...this.state.data, template: this.state.data.template + " " + "<"+variable+">"}}, ()=>this.countMessage())
    }

    countMessage(unicodeValue){

        let countMax;
        let count;

        if(unicodeValue){
            countMax = 70;
            count = 67;
        }else{
            countMax = 160;
            count = 153;
        }

        if(this.state.data.template.length <= countMax){
            this.smsCount = 1;
        }else{
            this.smsCount = Math.floor(this.state.data.template.length / count + (this.state.data.template.length % count > 0))
        }

        this.totalSmsCount = this.props.campaign.data.result.recipientsCount.total * this.smsCount;


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

        if(this.state.data.opt_variables){
            return <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    {variables}
                </View>
                <View style={{marginBottom: 15}}/>
            </View>
        }
    }

    saveTemplate(){
        this.setState({saving: true}, ()=>{
            this.props.dispatch(save('campaign/save-template', {reducer: 'templateList'}, {name: this.state.templateName, template: this.state.data.template}, ()=>setTimeout(()=>this.onSaveTemplateSuccess(),10)))
        })
    }

    onSaveTemplateSuccess(){
        this.setState({saving: false, modalVisible: false, templateName: ''})
    }

    renderModal(){
        let view;
        if(this.state.saving){
            view = <ActivityIndicator
                style={{height: 150}}
                size="large"
            />
        }else{
            view = <View style={{ width: window.width/5 * 4 - 25}}>
                <View style={styles.textWrap}>
                    <TextInput
                        ref="templateName"
                        placeholder="Template name"
                        style={{flex: 1}}
                        onChangeText={(templateName) => this.setState({templateName})}
                        value={this.state.templateName}/>
                </View>
                <View >
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={()=>this.setState({modalVisible: false})}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                    {_('Cancel').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.saveTemplate()}>
                            <View style={{padding: 10, marginRight: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                    {_('Save').toUpperCase()}
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
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({modalVisible: false})}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible: false})} >
                        <View style={styles.touchableClose} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalSmallContainer}>
                        {view}
                    </View>
                </View>
            </Modal>
        )
    }

    renderError(){
        if(this.state.error){
            return <Text style={{color: 'red',  marginTop: 5, marginBottom: 5}}>{_(this.state.error)}</Text>
        }else{
            return <Text style={{color: 'white', marginTop: 5, marginBottom: 5}}>placeholder</Text>
        }
    }

    handleNext(){
        this.setState({buttonStatus: 'saving'}, ()=>{
            this.props.handleNext(this.state.data)
        });
    }

    render(){

        let optionalSender;
        if(this.state.data.profile_id == 'gText'){
            optionalSender = <View style={{marginBottom: 5, paddingLeft: 15, paddingRight: 15}}>
                <TextInput

                    placeholder={_('Text sender value')}
                    maxLength={11}
                    onChangeText={(profile_sender) => this.setState({data: {...this.state.data, profile_sender} })}
                    value={this.state.data.profile_sender}/>
                <View style={{justifyContent: 'flex-end', flexDirection: 'row', marginBottom: -5}}>
                    <Text style={styles.messageStats}>{this.state.data.profile_sender.length}/11</Text>
                </View>
            </View>
        }

        //TODO add verified number to picker
        if(this.state.data.profile_id == 'gOwn'){
            optionalSender = <View style={styles.switchSender}>
                <Text >{_('Verified numbers')}</Text>
                <Picker
                    disabled={true}
                    style={styles.picker}
                    selectedValue={this.state.data.profile_sender}
                    onValueChange={(profile_sender) => this.setState({data: {...this.state.data, profile_sender}})}>
                    <Picker.Item label="1354" value="system_number" />
                    <Picker.Item label="15464685468 " value="system_number" />

                </Picker>
            </View>
        }

        let date;
        if(this.state.data.opt_scheduled){

            let pickerItems = this.props.timezones.map((item)=>{
                return <Picker.Item label={item} value={item} key={item}/>
            });

            console.log(this.state.data.scheduled_date)
            date = <View style={{alignItems: 'center', justifyContent: 'space-between', padding: 15, flexDirection: 'row'}}>
                <DatePicker
                    style={{width: 150}}
                    date={this.state.data.scheduled_date}
                    mode="datetime"
                    placeholder={_('Select date')}
                    format="DD.MM.YYYY HH:MM"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(scheduled_date) => {this.setState({data: {...this.state.data, scheduled_date}})}}
                />
                <Picker
                    style={{width: 140}}
                    selectedValue={this.state.data.scheduled_timezone}
                    onValueChange={(scheduled_timezone) => {this.setState({data: {...this.state.data, scheduled_timezone}})}}>
                    {pickerItems}
                </Picker>
            </View>
        }

        let restriction;
        if(this.state.data.opt_restriction){

            let time;
            if(this.state.data.restriction_sms_count_per_day > 0){
                time = <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                    <Text>{_('Start sending from')}</Text>
                    <DatePicker
                        style={{width: 150}}
                        date={this.state.data.restriction_time_from}
                        mode="time"
                        placeholder={_('Select time')}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(restriction_time_from) => {this.setState({data: {...this.state.data, restriction_time_from}})}}
                    />
                </View>
            }

            restriction = <View style={{paddingLeft: 15, paddingRight: 15, marginBottom: 10, marginTop: -10}}>
                <TextInput
                    placeholder={_('Sms per day')}
                    ref="smsPerDay"
                    onChangeText={(restriction_sms_count_per_day) => this.setState({data: {...this.state.data, restriction_sms_count_per_day}})}
                    value={this.state.data.restriction_sms_count_per_day.toString()}
                    keyboardType='numeric'/>
                {time}
            </View>
        }

        return (
                <View style={styles.container}>
                    <ScrollView style={{padding: 15, paddingTop: 5}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableOpacity onPress={()=>Actions.TemplateList({campaign_id: this.state.data.id})}>
                                <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
                                    <Text style={{marginRight: 5}}>{_('Load template')}</Text>
                                    <Icon name="file-download" size={30} style={{color: '#404040'}}/>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>this.setState({modalVisible: true})}>
                                <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
                                    <Text style={{marginRight: 5}}>{_('Save template')}</Text>
                                    <Icon name="save" style={{marginLeft: 5, color: '#404040'}} size={30}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingLeft: 10, paddingRight: 10}}>
                            <TextInput
                                style={{height: 100}}
                                placeholder={_('Sms text')}
                                ref="message"
                                multiline={true}
                                onChangeText={(template) => this.setState({data: {...this.state.data, template}})}
                                value={this.state.data.template}
                                onChange={()=>this.countMessage(this.state.data.opt_unicode)}/>
                            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                                <Text style={styles.fontSize10}>{_('Length')}:</Text>
                                <Text style={styles.messageStats}>{this.state.data.template.length}</Text>
                                <Text style={styles.fontSize10}>SMS:</Text>
                                <Text style={styles.messageStats}>{this.smsCount}</Text>
                                <Text style={styles.fontSize10}>{_('Recipients')}:</Text>
                                <Text style={styles.messageStats}>{this.props.campaign.data.result.recipientsCount.total}</Text>
                                <Text style={styles.fontSize10}>{_('Total sms')}:</Text>
                                <Text style={styles.messageStats}>{this.totalSmsCount}</Text>
                            </View>

                        </View>
                        <View style={{marginTop: 40}}>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Personalized message')}</Text>
                                <Switch
                                    onValueChange={(opt_variables) => { this.setState({data: {...this.state.data, opt_variables} }) }}
                                    value={this.state.data.opt_variables} />
                            </View>
                            {this.renderVariables()}

                        </View>
                        <View >
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Sender id')}</Text>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={this.state.data.profile_id}
                                    onValueChange={(profile_id) => this.setState({data: {...this.state.data, profile_id}})}>
                                    <Picker.Item label="System number" value="gSystem" />
                                    <Picker.Item label="Short code" value="gShort" />
                                    <Picker.Item label="Text sender" value="gText" />
                                    <Picker.Item label="Own number" value="gOwn" />
                                </Picker>

                            </View>
                            {optionalSender}
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Unicode')}</Text>
                                <Switch
                                    onValueChange={(opt_unicode) => { this.setState({data: {...this.state.data, opt_unicode} }); this.countMessage(opt_unicode) }}
                                    value={this.state.data.opt_unicode} />
                            </View>
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Flash sms')}</Text>
                                <Switch
                                    onValueChange={(opt_flash) => { this.setState({data: {...this.state.data, opt_flash} }) }}
                                    value={this.state.data.opt_flash} />
                            </View>
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Sending time')}</Text>
                                <Switch
                                    onValueChange={(opt_scheduled) => { this.setState({data: {...this.state.data, opt_scheduled} }) }}
                                    value={this.state.data.opt_scheduled} />
                            </View>
                            {date}
                        </View>
                        <View>
                            <View style={styles.separator}/>
                            <View style={styles.switchWrap}>
                                <Text>{_('Restriction')}</Text>
                                <Switch
                                    onValueChange={(opt_restriction) => { this.setState({data: {...this.state.data, opt_restriction} })}}
                                    value={this.state.data.opt_restriction} />
                            </View>
                            {restriction}
                        </View>
                        <View style={styles.separator}/>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15}}>
                            <TouchableOpacity onPress={ ()=>this.props.handleBack()}>
                                <View style={{ padding: 15, paddingTop: 35}}>
                                    <Text style={{ color: 'black', fontSize: 16}}>{('back').toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{alignItems: 'flex-end'}}>
                                {this.renderError()}
                                <Button
                                    click={() => this.handleNext()}
                                    text={_('Next').toUpperCase()}
                                    buttonStatus={this.state.buttonStatus}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    {this.renderModal()}
                </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    variableStyle: {
        width: window.width/2 - 15,
        flexDirection: 'row',
        paddingTop: 10,
        height: 30
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
    picker: {
        width: 170
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
    messageStats: {
       fontWeight: '500',
       color: '#423D3C',
       marginLeft: 3,
       marginRight: 10,
       fontSize: 12
    },
    fontSize10: {
        fontSize: 12
    },
    switchWrap: {
        height: 50,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    switchSender: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginTop: 15
    },
    buttonText: {
        fontWeight: '500',
        color: Color.buttonText
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

module.exports = connect(mapStateToProps)(CampaignText);
