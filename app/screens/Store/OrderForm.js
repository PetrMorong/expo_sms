/**
 * Created by Petr on 7.2.2017.
 */
import React, { Component } from 'react';
import { StyleSheet, Button,  Text, Picker, View, Image, Switch,  Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import Checkbox from '../../components/CheckBox'
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Color from '../../config/Variables';
import { connect } from 'react-redux';
import { saveImage } from '../../actions/index'
import { Actions } from 'react-native-router-flux';
import Menu from '../../components/Menu';
import Toolbar from '../../components/Toolbar';
import { fromJS } from 'immutable';
import DrawerLayout from 'react-native-drawer-layout';


const mapStateToProps = (store) => {
    return{
        storeSettings: store.storeSettings
    }
};


const window = Dimensions.get('window');

export default class OrderFormComponent extends Component{
    constructor(props){
        super(props)
        this.state = {
            data: this.props.storeSettings.data.result
        }
    }

    handleSave(){
        let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: {...this.state.data}}}).toJS();

        this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

        this.props.dispatch(saveImage('store/save-store', {...this.state.data}));

        Actions.pop();
    }

    render(){
        let menu  = <Menu/>;

        let first_name;
        if(this.state.data.form_first_name){
            first_name = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('First name')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let last_name;
        if(this.state.data.form_last_name){
            last_name = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Last name')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let phone;
        if(this.state.data.form_phone){
            phone = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Phone number')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let email;
        if(this.state.data.form_email){
            email = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Email')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let country;
        if(this.state.data.form_country){
            country = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Country')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let city;
        if(this.state.data.form_city){
            city = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('City')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let state;
        if(this.state.data.form_state){
            state = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('State')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let street;
        if(this.state.data.form_street){
            street = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Street')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let zip;
        if(this.state.data.form_zip){
            zip = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Zip')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let company;
        if(this.state.data.form_company){
            company = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Company')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let company_id;
        if(this.state.data.form_company_id){
            company_id = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Company id')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let company_vat;
        if(this.state.data.form_company_vat){
            company_vat = <View style={{width: window.width/3, height: 60, alignSelf: 'flex-end'}}>
                <Text>{_('Company vat')}</Text>
                <View style={styles.formInput}>
                </View>
            </View>
        }

        let view;
        if(this.state.data.hide_form){
            view = <View style={{marginBottom: 20}}>
                <View style={[styles.separator, {marginBottom: 20}]}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_first_name: !this.state.data.form_first_name }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_first_name} onCheck={() => this.setState({data: {...this.state.data, form_first_name: !this.state.data.form_first_name }})} />
                            <Text style={styles.b}>{_('First name')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_last_name: !this.state.data.form_last_name }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_last_name} onCheck={() => this.setState({data: {...this.state.data, form_last_name: !this.state.data.form_last_name }})} />
                            <Text style={styles.b}>{_('Last name')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_phone: !this.state.data.form_phone }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_phone} onCheck={() => this.setState({data: {...this.state.data, form_phone: !this.state.data.form_phone }})}/>
                            <Text style={styles.b}>{_('Phone number')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                     <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_email: !this.state.data.form_email }})}>
                         <View style={styles.a}>
                             <Checkbox checked={this.state.data.form_email} onCheck={() => this.setState({data: {...this.state.data, form_email: !this.state.data.form_email }})} />
                             <Text style={styles.b}>{_('Email')}</Text>
                         </View>
                     </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_country: !this.state.data.form_country }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_country} onCheck={() => this.setState({data: {...this.state.data, form_country: !this.state.data.form_country }})}/>
                            <Text style={styles.b}>{_('Country')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_city: !this.state.data.form_city }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_city} onCheck={() => this.setState({data: {...this.state.data, form_city: !this.state.data.form_city }})}/>
                            <Text style={styles.b}>{_('City')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_state: !this.state.data.form_state }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_state} onCheck={() => this.setState({data: {...this.state.data, form_state: !this.state.data.form_state }})}/>
                            <Text style={styles.b}>{_('State')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_street: !this.state.data.form_street }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_street} onCheck={() => this.setState({data: {...this.state.data, form_street: !this.state.data.form_street }})}/>
                            <Text style={styles.b}>{_('Street')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_zip: !this.state.data.form_zip }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_zip} onCheck={() => this.setState({data: {...this.state.data, form_zip: !this.state.data.form_zip }})}/>
                            <Text style={styles.b}>{_('Zip')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_company: !this.state.data.form_company }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_company} onCheck={() => this.setState({data: {...this.state.data, form_company: !this.state.data.form_company }})}/>
                            <Text style={styles.b}>{_('Company')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_company_id: !this.state.data.form_company_id }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_company_id} onCheck={() => this.setState({data: {...this.state.data, form_company_id: !this.state.data.form_company_id }})}/>
                            <Text style={styles.b}>{_('Company id')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({data: {...this.state.data, form_company_vat: !this.state.data.form_company_vat }})}>
                        <View style={styles.a}>
                            <Checkbox checked={this.state.data.form_company_vat} onCheck={() => this.setState({data: {...this.state.data, form_company_vat: !this.state.data.form_company_vat }})}/>
                            <Text style={styles.b}>{_('Company vat')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.separator}/>
                <View style={{flexDirection: 'row', marginBottom: 15}}>
                    <TextInput
                        onChangeText={(value) => this.setState({data: {...this.state.data, text_form_title: value}})}
                        value={this.state.data.text_form_title}
                        style={{flex: 1, marginLeft: 10, marginRight: 10}}
                        placeholder={_('Form headline')}/>
                    <TextInput
                        onChangeText={(value) => this.setState({data: {...this.state.data, text_button: value}})}
                        value={this.state.data.text_button}
                        style={{flex: 1, marginLeft: 10, marginRight: 10}}
                        placeholder={_('Send button')}/>
                </View>
                <View style={{backgroundColor: '#C3CAD4', padding: 15}}>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Text style={{fontSize: 18}}>{this.state.data.text_form_title}</Text>
                    </View>
                    <View style={{marginTop: 15, flexWrap: 'wrap', flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                            {first_name}
                            {last_name}
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
                        <Text style={styles.fakeButton}>{this.state.data.text_button}</Text>
                    </View>
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
                    title={_('Order form')}
                    elevation={0}
                    back={true}/>
                <ScrollView style={styles.container}>
                    <View style={{marginBottom: 10}}>
                        <View style={styles.switchWrap}>
                            <Text>{_('Activate')}</Text>
                            <Switch
                                onValueChange={(value) => this.setState({data: {...this.state.data, hide_form: value}})}
                                value={this.state.data.hide_form} />
                        </View>
                    </View>
                    {view}
                    <View style={styles.separator}/>
                    <View style={{margin: 15, alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={() => this.handleSave()}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('save').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        marginBottom: 8
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
        justifyContent: 'space-between'
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
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
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginBottom: 15
    },
    buttonText: {
        color: Color.buttonText,
        fontWeight: '500'
    }
});

module.exports = connect(mapStateToProps)(OrderFormComponent);