/**
 * Created by Petr on 23.4.2017.
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
    ScrollView
} from 'react-native';
import Button from './Button';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const window = Dimensions.get('window');

export default class FilterModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            time: '',
            fom: '',
            from: moment(moment().subtract(30, 'days').calendar()).format('YYYY[-]MM[-]DD'),
            to: moment().format('YYYY[-]MM[-]DD'),
            filter_value: '',
            buttonStatus: 'default',
            itemsToFilter: this.props.itemsToFilter
        }
    }


    handleChangeTime(time){

        if(time == 30){
            this.setState({time: 30, from: moment(moment().subtract(30, 'days').calendar()).format('YYYY[-]MM[-]DD'), to: moment().format('YYYY[-]MM[-]DD')})
        }else if( time == 7){
            this.setState({time: 7, from: moment(moment().subtract(7, 'days').calendar()).format('YYYY[-]MM[-]DD'), to: moment().format('YYYY[-]MM[-]DD')})
        }else if(time == 1){
            this.setState({time: 1, from: moment(moment().subtract(1, 'days')).format('YYYY[-]MM[-]DD'), to: moment().format('YYYY[-]MM[-]DD')})

        }else{
            this.setState({time: 'interval'})
        }
    }

    render() {

        let filterValue;
        if(this.props.identifier == 'history'){
            if(this.state.filter == 'recipient'){
                filterValue = <TextInput
                    placeholder={_('Phone number')}
                    onChangeText={(filter_value) => this.setState({filter_value})}
                    value={this.state.filter_value}
                    keyboardType='numeric'/>
            }else if(this.state.filter == 'status'){
                filterValue = <Picker
                    style={{color: 'black', paddingRight: 5}}
                    selectedValue={this.state.filter_value}
                    onValueChange={(filter_value) => this.setState({filter_value})}>
                    <Picker.Item label={_('Select value')} value="" />
                    <Picker.Item label={_('Sent')} value={1} />
                    <Picker.Item label={_('Error')} value={2} />
                    <Picker.Item label={_('Delivered')} value={11} />
                    <Picker.Item label={_('Recipient unavailable')} value={12}/>
                    <Picker.Item label={_('Dnd')} value={16}/>
                </Picker>
            }else if(this.state.filter == 'type'){
                filterValue = <Picker
                    style={{color: 'black',  paddingRight: 5, marginRight: 5}}
                    selectedValue={this.state.filter_value}
                    onValueChange={(filter_value) => this.setState({filter_value})}>
                    <Picker.Item label={_('Select value')} value="" />
                    <Picker.Item label={_('Unknown')} value={0} />
                    <Picker.Item label={_('Transactional')} value={1} />
                    <Picker.Item label={_('Promotional')} value={2} />
                </Picker>
            }
        }

        if(this.props.identifier == 'transactions'){
            if(this.state.filter == 'type'){
                filterValue = <Picker
                    style={{color: 'black',  paddingRight: 5}}
                    selectedValue={this.state.filter_value}
                    onValueChange={(filter_value) => this.setState({filter_value})}>
                    <Picker.Item label={_('Select value')} value="" />
                    <Picker.Item label={_('SMS')} value={1} />
                    <Picker.Item label={_('Flash sms')} value={2} />
                    <Picker.Item label={_('Long sms')} value={10} />
                    <Picker.Item label={_('Unicode sms')} value={12} />
                    <Picker.Item label={_('Service')} value={55} />
                    <Picker.Item label={_('Activation')} value={58} />
                    <Picker.Item label={_('Transfer')} value={60} />
                    <Picker.Item label={_('Reclamation minus')} value={70} />
                    <Picker.Item label={_('Charge')} value={110} />
                    <Picker.Item label={_('Bonus')} value={120} />
                    <Picker.Item label={_('Reclamation plus')} value={150} />
                </Picker>
            }else if(this.state.filter == 'amount_change'){
                filterValue = <Picker
                    style={{color: 'black',  paddingRight: 5}}
                    selectedValue={this.state.filter_value}
                    onValueChange={(filter_value) => this.setState({filter_value})}>
                    <Picker.Item label={_('Select value')} value="" />
                    <Picker.Item label={_('Plus')} value={1} />
                    <Picker.Item label={_('Minus')} value={-1} />
                </Picker>
            }
        }

        if(this.props.identifier == 'blacklist'){
            if(this.state.filter == 'number'){
                filterValue = <TextInput
                    placeholder={_('Phone number')}
                    onChangeText={(filter_value) => this.setState({filter_value})}
                    value={this.state.filter_value}
                    keyboardType='numeric'/>
            }
        }

        if(this.props.identifier == 'inbox'){
            if(this.state.filter == 'from'){
                filterValue = <TextInput
                    placeholder={_('Phone number')}
                    onChangeText={(filter_value) => this.setState({filter_value})}
                    value={this.state.filter_value}
                    keyboardType='numeric'/>
            }
            if(this.state.filter == 'text'){
                filterValue = <TextInput
                    placeholder={_('Message')}
                    onChangeText={(filter_value) => this.setState({filter_value})}
                    value={this.state.filter_value}/>
            }
        }



        let dateRange;
        if(this.state.time == 'interval'){
            dateRange = <View>
                <View style={{height: 50, flexDirection: 'row', paddingLeft: 5, paddingRight: 5, alignItems: 'center'}}>
                    <Text style={[styles.text, {flex: 1}]}>{_('From')}</Text>
                    <DatePicker
                        style={{width: 160, flex: 1}}
                        date={this.state.from}
                        mode="date"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(from) => {this.setState({from})}}
                    />
                </View>
                <View style={{height: 50, flexDirection: 'row', paddingLeft: 5, paddingRight: 5, alignItems: 'center'}}>
                    <Text style={[styles.text, {flex: 1}]}>{_('To')}</Text>
                    <DatePicker
                        style={{width: 160, flex: 1}}
                        date={this.state.to}
                        mode="date"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(to) => {this.setState({to})}}
                    />
                </View>
            </View>

        }

        let pickerItems = this.state.itemsToFilter.map((item, i)=>{
            return <Picker.Item label={_(item)} value={item} key={i} />
        });

        let dateSelect;
        if(this.props.time){
            dateSelect = <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 5}}>
                <Text style={[styles.text, {flex: 1}]}>{_('Time interval')}</Text>
                <Picker
                    style={{color: 'black', width: 160, flex: 1}}
                    selectedValue={this.state.time}
                    onValueChange={(time) => this.handleChangeTime(time)}>
                    <Picker.Item label={_('Last 30 days')} value={30} />
                    <Picker.Item label={_('Last 7 days')} value={7} />
                    <Picker.Item label={_('Last day')} value={1} />
                    <Picker.Item label={_('Interval')} value='interval'/>
                </Picker>
            </View>
        }

        let view;
        if(this.props.visible){

            view =  <View style={{width: window.width / 5 * 4 - 50, flex: 1}}>
                {dateSelect}
                {dateRange}


                <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 5}}>
                    <Text style={[styles.text, {flex: 1}]}>{_('Select filter')}</Text>
                    <Picker
                        style={{color: 'black', width: 160, flex: 1}}
                        selectedValue={this.state.filter}
                        onValueChange={(filter) => this.setState({filter})}>
                        {pickerItems}
                </Picker>

                </View>
                {filterValue}
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
                        <View style={{alignItems: 'flex-start', width: window.width / 5 * 4 - 50}}>
                            <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginBottom: 20}}>{_('Chose filter')}</Text>
                        </View>
                        {view}
                        <View style={{marginTop: 25, width: window.width / 5 * 4 - 50, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <TouchableWithoutFeedback onPress={()=>this.props.handleClose()}>
                                    <View style={{paddingRight: 25}}>
                                        <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>{_('Cancel').toUpperCase()}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.handleSaveFilter({from: this.state.from, to: this.state.to, filter: this.state.filter, filter_value: this.state.filter_value})}>
                                    <View >
                                        <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>{_('Filter').toUpperCase()}</Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            </View>
                        </View>
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
        height: window.height/5 *4 -80,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20

    },
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
    text: {
        color: 'black',
        fontSize: 16
    }

});