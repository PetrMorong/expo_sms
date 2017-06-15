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
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import Button from '../../../components/Button';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        campaignCreate: store.campaignCreate
    }
}


export default class CampaignCreate  extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: '',
            campaignType: 'classic',
            buttonStatus: 'default'
        }
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.campaignCreate.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.campaignCreate.saved){
            this.setState({buttonStatus: 'saved'})
            Actions.Campaign({id: nextProps.campaignCreate.id, status: 'concept-contacts'})
        }

        if(nextProps.campaignCreate.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSave(){
        if(this.state.text.length > 2){
            this.props.dispatch(save('campaign/create-campaign', {reducer: 'campaignCreate'},{name: this.state.text, type: this.state.campaignType}))
        }
    }



    render(){

        let error;
        if(this.state.text.length < 3 && this.state.text.length > 0){
            error = <Text style={{color: 'red', fontSize: 16, marginBottom: 10}}>{_('Atleast 3 characters')}</Text>
        }else{
            error = <Text style={{color: 'white', fontSize: 16, marginBottom: 10}}>{_('Atleast 3 characters')}</Text>
        }

        let sms;
        if(this.state.campaignType == 'classic'){
            sms = <View style={styles.choiceWrapActive}>
                <Icon style={styles.iconActive} name="textsms" size={35}/>
                <Text style={styles.textActive}>SMS</Text>
            </View>;
        } else{
            sms= <View style={styles.choiceWrap}>
                <Icon style={styles.icon} name="textsms" size={35}/>
                <Text style={styles.icon}>SMS</Text>
            </View>;
        }

        let smartSms;
        if(this.state.campaignType == 'smart'){
            smartSms =  <View style={styles.choiceWrapTwoActive}>
                <View style={styles.flexRow}>
                    <Icon style={styles.iconActive} name="textsms" size={35}/>
                    <Text style={styles.marginActive}>+</Text>
                    <Icon style={styles.iconActive} name="shopping-cart" size={35}/>
                </View>
                <Text style={styles.textActive}>Smart SMS</Text>
            </View>;
        }else{
            smartSms =  <View style={styles.choiceWrapTwo}>
                <View style={styles.flexRow}>
                    <Icon style={styles.icon} name="textsms" size={35}/>
                    <Text style={styles.margin}>+</Text>
                    <Icon style={styles.icon} name="shopping-cart" size={35}/>
                </View>
                <Text style={styles.icon}>Smart SMS</Text>
            </View>;
        }

        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="containerNoBg"
                    title={_('Create campaign')}
                    elevation={0}/>
                <View style={styles.container}>
                    <ScrollView style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <View style={styles.image}>
                                <Image style={{width: 145, height: 175}} resizeMode="stretch" source={require('../../../images/campaignCreateNoLogo.png')}/>
                            </View>
                            <View style={styles.padding}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => this.setState({text})}
                                    value={this.state.text}
                                    placeholder={_('Campaign name')}
                                />
                                <View style={styles.wrap}>
                                    <TouchableOpacity onPress={(event) => this.chooseType('classic')} >
                                        {sms}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={(event) => this.chooseType('smart')} >
                                        {smartSms}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', height: 100, paddingRight: 15, paddingBottom: 5, flex: 1}}>
                                {error}
                                <Button
                                    click={() => this.handleSave()}
                                    text={_('Save').toUpperCase()}
                                    buttonStatus={this.state.buttonStatus}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>

            </DrawerLayout>
        )

    }

    chooseType(type){
        this.setState({campaignType: type})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    padding: {
        padding: 15,
        flex: 1
    },
    image: {
        backgroundColor: Color.secondaryColor,
        height: window.height/3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        color: '#808080'
    },
    iconActive: {
        color: '#BE2166'
    },
    textActive: {
        color: 'black'
    },
    wrap: {
       marginTop: 10,
       justifyContent: 'center',
       flexDirection: 'row'
    },
    choiceWrap: {
        width: 100,
        height: 90,
        borderColor: '#999999',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        marginBottom: 0,
        borderRadius: 2,
    },
    choiceWrapActive: {
        width: 100,
        height: 90,
        borderColor: '#26A69A',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        margin: 15,
        marginBottom: 0,
        borderRadius: 2
    },
    choiceWrapTwo: {
        width: 150,
        height: 90,
        borderColor: '#999999',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        margin: 15,
        marginBottom: 0,
        borderRadius: 2
    },
    choiceWrapTwoActive: {
        width: 150,
        height: 90,
        borderColor: '#26A69A',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        margin: 15,
        marginBottom: 0,
        borderRadius: 2
    },
    flexRow: {
        flexDirection: 'row'
    },
    margin: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        color: '#999999'
    },
    marginActive: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        color: '#26A69A'
    },
    buttonWrap: {
        width: 110,
        borderRadius: 2,
        backgroundColor: Color.button,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginRight: 15,
    },
    buttonText: {
        fontWeight: '500',
        color: Color.buttonText
    },
    input: {
        color: 'black',
        borderBottomColor: 'green',
        flex: 1,
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
        height: 50
    },

});

module.exports = connect(mapStateToProps)(CampaignCreate);

