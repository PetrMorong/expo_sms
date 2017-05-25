/**
 * Created by Petr on 8.2.2017.
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
import Menu from '../../components/Menu';
import Toolbar from '../../components/Toolbar';
import Color from '../../config/Variables';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import { saveImage } from '../../actions/index'
import { fromJS } from 'immutable';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        storeSettings: store.storeSettings
    }
};

export default class CompanyData extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.storeSettings.data.result
        }
    }

    handleSave(){
        let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: this.state.data}}).toJS();

        this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'},payload: map});

        this.props.dispatch(saveImage('store/save-store', this.state.data));

        Actions.pop();
    }

    render() {
        let menu  = <Menu/>;

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Company data')}
                    elevation={2}
                    back={true}/>
                <ScrollView >
                   <View style={styles.container}>
                       <View>
                           <TextInput
                               onChangeText={(company_name) => this.setState({data: {...this.state.data, company_name}})}
                               value={this.state.data.company_name}
                               style={{marginLeft: 10, marginRight: 10}}
                               placeholder={_('Company name')}/>
                       </View>
                       <View style={{flexDirection: 'row'}}>
                           <TextInput
                               onChangeText={(email) => this.setState({data: {...this.state.data, email}})}
                               value={this.state.data.email}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('Email')}/>

                       </View>
                       <View style={{flexDirection: 'row'}}>
                           <TextInput
                               onChangeText={(phone_number) => this.setState({data: {...this.state.data, phone_number}})}
                               value={this.state.data.phone_number}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('Phone number')}
                               keyboardType='numeric'/>
                           <TextInput
                               onChangeText={(www) => this.setState({data: {...this.state.data, www}})}
                               value={this.state.data.www}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('www')}/>
                       </View>
                       <View style={{flexDirection: 'row'}}>
                           <TextInput
                               onChangeText={(street1) => this.setState({data: {...this.state.data, street1}})}
                               value={this.state.data.street1}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('Street')}/>
                           <TextInput
                               onChangeText={(city) => this.setState({data: {...this.state.data, city}})}
                               value={this.state.data.city}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('City')}/>
                       </View>
                       <View style={{flexDirection: 'row'}}>
                           <TextInput
                               onChangeText={(zip) => this.setState({data: {...this.state.data, zip}})}
                               value={this.state.data.zip}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('Zip')}
                               keyboardType='numeric'/>
                           <TextInput
                               onChangeText={(country) => this.setState({data: {...this.state.data, country}})}
                               value={this.state.data.country}
                               style={{flex: 1, marginLeft: 10, marginRight: 10}}
                               placeholder={_('Country')}/>
                       </View>
                   </View>
                </ScrollView>
                <View style={{margin: 15, marginTop: 0,  alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    <Button
                        click={() => this.handleSave()}
                        text={_('Save').toUpperCase()}
                        buttonStatus={this.state.buttonStatus}
                    />
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

module.exports = connect(mapStateToProps)(CompanyData);