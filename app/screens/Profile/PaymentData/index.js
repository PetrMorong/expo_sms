/**
 * Created by Petr on 27.2.2017.
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
import { save, fetch } from '../../../actions/index';
import Button from '../../../components/Button';
import { fromJS } from 'immutable';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        countries: store.user.user.countries,
        paymentData: store.paymentData
    }
};

export default class PaymentData extends Component {

    constructor(props){
        super(props);

        this.state = {
            switchCompany: false,
            buttonStatus: 'default',
            data: {}
        }
    }

    componentWillMount(){
        this.props.dispatch(fetch('profile/payment-data-load', {reducer: 'paymentData'}));
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.paymentData.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.paymentData.saved){
            this.setState({buttonStatus: 'saved'})
        }

        if(nextProps.paymentData.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSave(){
        let map = fromJS(this.props.paymentData).mergeDeep({data: {result: {detail: this.state.data}}}).toJS();

        this.props.dispatch({type: 'SAVE_PAYMENT', payload: map});

        this.props.dispatch(save('profile/payment-data-save', {reducer: 'paymentData'} ,this.state.data ));

    }



    render() {
        let loader;
        if(this.props.paymentData.fetching){
            loader = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }

        let items = Object.keys(this.props.countries).map((key,i)=>{
            return <Picker.Item label={this.props.countries[key]} value={key} key={i}/>

        });

        let country = <Picker
            style={{width: window.width /10 * 9 -5, marginTop: 5, marginLeft: 5, color: 'grey'}}
            selectedValue={this.state.data.country}
            onValueChange={(country) => this.setState({data: {...this.state.data, country}, buttonStatus: 'default'})}>
            {items}
        </Picker>;

        let menu  = <Menu/>;

        let company;
        if(this.state.switchCompany){
            company = <View>
                <TextInput
                    onChangeText={(company_name) => this.setState({data: {...this.state.data, company_name}, buttonStatus: 'default'})}
                    value={this.state.company_name}
                    style={{marginLeft: 10, marginRight: 10}}
                    placeholder={_('Company name')}/>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        onChangeText={(company_number) => this.setState({data: {...this.state.data, company_number}, buttonStatus: 'default'})}
                        value={this.state.company_number}
                        style={{flex: 1, marginLeft: 10, marginRight: 10}}
                        placeholder={_('Company id')}/>
                    <TextInput
                        onChangeText={(company_vat) => this.setState({data: {...this.state.data, company_vat}, buttonStatus: 'default'})}
                        value={this.state.company_vat}
                        style={{flex: 1, marginLeft: 10, marginRight: 10}}
                        placeholder={_('Company vat')}/>
                </View>
            </View>
        }


        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Payment data')}
                    elevation={0}
                    back={true}/>
                <View style={styles.container}>
                    {loader}
                    <ScrollView>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                onChangeText={(first_name) => this.setState({data: {...this.state.data, first_name}, buttonStatus: 'default'})}
                                value={this.state.data.first_name}
                                style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                                placeholder={_('First name')}/>
                            <TextInput
                                onChangeText={(last_name) => this.setState({data: {...this.state.data, last_name}, buttonStatus: 'default'})}
                                value={this.state.data.last_name}
                                style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                                placeholder={_('Last name')}/>
                        </View>
                        <View>
                            <TextInput
                                onChangeText={(street1) => this.setState({data: {...this.state.data, street1}, buttonStatus: 'default'})}
                                value={this.state.data.street1}
                                style={{marginLeft: 10, marginRight: 10, }}
                                placeholder={_('Street')}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                onChangeText={(city) => this.setState({data: {...this.state.data, city}})}
                                value={this.state.data.city}
                                style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                                placeholder={_('City')}/>
                            <TextInput
                                onChangeText={(zip) => this.setState({data: {...this.state.data, zip}})}
                                value={this.state.data.zip}
                                style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                                placeholder={_('Zip')}/>
                        </View>
                        <View>
                            {country}
                        </View>
                        <View style={[styles.separator, {marginLeft: 10, marginRight: 10}]}/>
                        <View style={styles.switchWrap}>
                            <Text style={{fontSize: 16}}>{_('Company')}</Text>
                            <Switch
                                onValueChange={(value) => this.setState({switchCompany: value})}
                                value={this.state.switchCompany} />
                        </View>
                        {company}
                    </ScrollView>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', height: 80}}>
                        <Button
                            click={() => this.handleSave()}
                            text={_('Save').toUpperCase()}
                            buttonStatus={this.state.buttonStatus}
                        />
                    </View>
                </View>
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15
    },
    switchWrap: {
        height: 50,
        paddingRight: 10,
        paddingLeft: 15,
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
    buttonText: {
        fontWeight: '500',
        color: Color.buttonText
    }
});

module.exports = connect(mapStateToProps)(PaymentData);