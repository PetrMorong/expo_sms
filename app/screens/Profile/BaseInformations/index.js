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
} from 'react-native';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { save } from '../../../actions/index';
import Button from '../../../components/Button';
import { fromJS } from 'immutable';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        user: store.user.user.user,
        timezones: store.user.user.timezones,
        countries: store.user.user.countries,
        baseInformations: store.baseInformations
    }
};


export default class BaseInformations extends Component {

    constructor(props){
        super(props);

        let first_name = this.props.user.first_name,
            last_name = this.props.user.last_name,
            phone_number = this.props.user.phone_number,
            timezone = this.props.user.timezone,
            country = this.props.user.country;

        this.state = {
            first_name, last_name, phone_number, timezone, country,
            buttonStatus: 'default',
        };
    }

    createData()
    {
        return {
            first_name : this.state.first_name,
            last_name : this.state.last_name,
            phone_number : this.state.phone_number,
            timezone : this.state.timezone,
            country : this.state.country
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.baseInformations.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.baseInformations.saved){
            this.setState({buttonStatus: 'saved'})
        }

        if(nextProps.baseInformations.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSave() {
        let data = this.createData();

        this.props.dispatch(save('profile/save', {reducer: 'baseInformations'} ,data));

        let map = fromJS(this.props.user).merge(data).toJS();

        this.props.dispatch({type: 'PROFILE_SAVE_SUCCESS', payload: map})
    }

    render() {

        let itemsTimezone = this.props.timezones.map((timezone, i)=>{
            return <Picker.Item label={timezone} value={timezone} key={i}/>
        });

        let timezones = <Picker
            style={{width: window.width /10 * 9 -5, marginTop: 5, marginLeft: 5, height: 40, color: Color.displayText}}
            selectedValue={this.state.timezone}
            onValueChange={(timezone) => this.setState({timezone: timezone, buttonStatus: 'changed'})}>
            {itemsTimezone}
        </Picker>


        let itemsCountry = Object.keys(this.props.countries).map((key,i)=>{
            return <Picker.Item label={this.props.countries[key]} value={key} key={i}/>

        });

        let countries = <Picker
            style={{width: window.width /10 * 9 -5, marginTop: 5, marginLeft: 5, color: Color.displayText}}
            selectedValue={this.state.country}
            onValueChange={(country) => this.setState({country: country, buttonStatus: 'changed'})}>
            {itemsCountry}
        </Picker>

        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Base informations')}
                    elevation={0}
                    back={true}/>
                <View style={[{padding: 15}, styles.container]}>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            onChangeText={(first_name) => this.setState({first_name, buttonStatus: 'changed'})}
                            value={this.state.first_name}
                            style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                            placeholder={_('First name')}
                            placeholderTextColor={Color.displayText}
                            underlineColorAndroid={Color.displayText}/>
                        <TextInput
                            onChangeText={(last_name) => this.setState({last_name, buttonStatus: 'changed'})}
                            value={this.state.last_name}
                            style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                            placeholder={_('Last name')}
                            placeholderTextColor={Color.displayText}
                            underlineColorAndroid={Color.displayText}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            onChangeText={(phone_number) => this.setState({phone_number, buttonStatus: 'changed'})}
                            value={this.state.phone_number}
                            style={{flex: 1, marginLeft: 10, marginRight: 10}}
                            placeholder={_('Phone number')}
                            placeholderTextColor={Color.displayText}
                            underlineColorAndroid={Color.displayText}/>
                    </View>
                    <View>
                        {countries}
                    </View>
                    <View>
                        {timezones}
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
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
        backgroundColor: 'white'
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

module.exports = connect(mapStateToProps)(BaseInformations);