/**
 * Created by Petr on 30.1.2017.
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
import Menu from '../../../../components/Menu';
import Toolbar from '../../../../components/Toolbar';
import Color from '../../../../config/Variables';
import { connect } from 'react-redux';
import { save } from '../../../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Step from '../../../../components/StepperSingleStep';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        campaign: store.campaign
    }
}


export default class CampaignRecipients extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    goToPhone(){
        if(this.props.campaign.data.result.recipientsCount.phone > 0){
            Actions.PhoneRecipientsIndex()
        }else{
            Actions.PhoneRecipientsAdd()
        }
    }

    render() {

        let bottom;
        if(this.props.campaign.data.result.recipientsCount.total > 0){
            bottom = <View>
                    <View style={{alignItems: 'flex-end', padding: 15}}>
                        <TouchableOpacity onPress={() => this.props.handleNext()}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('next').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
        }

        let phoneCount;
        if(this.props.campaign.data.result.recipientsCount.phone > 0){
            phoneCount = <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.phone}</Text>
        }

        let addressBookCount;
        if(this.props.campaign.data.result.recipientsCount.address_book > 0){
            addressBookCount = <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.address_book}</Text>
        }

        let manualCount;
        if(this.props.campaign.data.result.recipientsCount.manual > 0){
            manualCount = <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.manual}</Text>
        }

        let csvExcelCount;
        if(this.props.campaign.data.result.recipientsCount.csv_excel > 0){
            csvExcelCount = <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.csv_excel}</Text>
        }

        let vcardCount;
        if(this.props.campaign.data.result.recipientsCount.vcard > 0){
            vcardCount = <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.vcard}</Text>
        }

        let total;
        if(this.props.campaign.data.result.recipientsCount.total > 0){
            total = <View>
                <View style={styles.separator}/>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10}}>
                    <Text>{_('total').toUpperCase()}</Text>
                    <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.total}</Text>
                </View>
            </View>
        }

        let excel;
        if(this.props.campaign.data.result.recipientsCount.csv_excel > 0){
            excel = <View>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={() => Actions.CsvExcel()}>
                    <View style={styles.linkWrap}>
                        <Icon style={styles.blueIcon} name="grid-on" size={35}/>
                        <Text style={styles.blueText}>{_('Csv/Excel')}</Text>
                        {csvExcelCount}
                    </View>
                </TouchableOpacity>
            </View>
        }

        let vcard;
        if(this.props.campaign.data.result.recipientsCount.vcard > 0){
            vcard = <View>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={() => Actions.Vcard()}>
                    <View style={styles.linkWrap}>
                        <Icon style={styles.blueIcon} name="contact-phone" size={35}/>
                        <Text style={styles.blueText}>{_('Vcard')}</Text>
                        {vcardCount}
                    </View>
                </TouchableOpacity>
            </View>
        }

        return (
                <View style={styles.container}>
                    <View  scrollsToTop={false} style={styles.smallContainer}>
                        <TouchableOpacity onPress={()=> this.goToPhone()}>
                            <View style={styles.linkWrap}>
                                <Icon style={styles.blueIcon} name="phone" size={35}/>
                                <Text style={styles.blueText}>{_('Phone contacts')}</Text>
                                {phoneCount}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.separator}/>
                        <TouchableOpacity onPress={() => Actions.BulkgateRecipients()}>
                            <View style={styles.linkWrap}>
                                <Icon style={styles.blueIcon} name="assignment-ind" size={35}/>
                                <Text style={styles.blueText}>{_('Address book')}</Text>
                                {addressBookCount}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.separator}/>
                        <TouchableOpacity onPress={() => Actions.KeypadRecipients()}>
                            <View style={styles.linkWrap}>
                                <Icon style={styles.blueIcon} name="dialpad" size={35}/>
                                <Text style={styles.blueText}>{_('Enter number')}</Text>
                                {manualCount}
                            </View>
                        </TouchableOpacity>
                        {excel}
                        {vcard}
                        {total}
                    </View>
                    <View style={{flex: 1}}/>
                    {bottom}
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
    blueIcon: {
        color: '#1580FD',
        marginRight: 15,
        marginLeft: 5
    },
    blueIcon2: {
        marginRight: 15,
        marginLeft: 5
    },
    blueText: {
        color: '#1580FD',
        flex: 1
    },
    linkWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 57
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
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
    count: {
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#4CAF50',
        padding: 7,
        paddingLeft: 10,
        paddingRight: 10,
        color: 'white',
        borderRadius: 2
    }

});

module.exports = connect(mapStateToProps)(CampaignRecipients);

