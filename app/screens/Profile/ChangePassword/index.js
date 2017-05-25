/**
 * Created by Petr on 27.2.2017.
 */
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
import Button from '../../../components/Button';
import { save } from '../../../actions/index';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        changePassword: store.changePassword
    }
};

export default class ChangePassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            isValidPassword: false,
            isSamePassword: false,
            newPassword: '',
            newPasswordAgain: '',
            buttonStatus: 'default'
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.changePassword.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.changePassword.saved){
            this.setState({buttonStatus: 'saved'})
        }

        if(nextProps.changePassword.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSave(){
        if(this.state.isValidPassword && this.state.isSamePassword){
            this.props.dispatch(save('profile/password', {reducer: 'changePassword'} ,{old_password: this.state.password, new_password: this.state.newPassword, new_password_retype: this.state.newPasswordAgain}))
        }

    }

    handleValidatePassword(password){
        let regular = /^(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
        if(regular.test(password)){
            this.setState({isValidPassword: true})
        }else{
            this.setState({isValidPassword: false})
        }
    }

    handleMatchPassword(password){
        if(this.state.newPassword === password){
            this.setState({isSamePassword: true})
        }else{
            this.setState({isSamePassword: false})
        }
    }

    render() {

        let newPasswordError;
        if(this.state.newPassword.length > 0){

            if(this.state.isValidPassword){
                newPasswordError = <Text style={{position: 'absolute', color: 'green', right: 15, top: 20}}>{_('Ok')}</Text>
            }else{
                newPasswordError = <Text style={{position: 'absolute', color: 'red', right: 15, top: 20}}>{_('Weak')}</Text>
            }

        }

        let newPasswordAgainError;
        if(this.state.newPasswordAgain.length > 0){
            if(this.state.isSamePassword){
                newPasswordAgainError = <Text style={{position: 'absolute', color: 'green', right: 15, top: 20}}>{_('Ok')}</Text>
            }else{
                newPasswordAgainError = <Text style={{position: 'absolute', color: 'red', right: 15, top: 20}}>{_('Does not match')}</Text>
            }
        }


        let menu  = <Menu/>;
        return (


                <View style={styles.container}>
                    <Toolbar
                        openMenu={() => this.drawer.openDrawer()}
                        background="container"
                        title={_('Change password')}
                        elevation={0}
                        back={true}/>
                    <View style={[{padding: 15}, styles.container]}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                onChangeText={(password) => this.setState({password, buttonStatus: 'changed'})}
                                value={this.state.password}
                                style={{flex: 1, marginLeft: 10, marginRight: 10, }}
                                placeholder={_('Password')}
                                secureTextEntry={true}
                                returnKeyLabel="nice"
                            />

                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                onChangeText={(newPassword) => {this.setState({newPassword, buttonStatus: 'changed'}); this.handleValidatePassword(newPassword)}}
                                value={this.state.newPassword}
                                style={{flex: 1, marginLeft: 10, marginRight: 10}}
                                placeholder={_('New password')}
                                secureTextEntry={true}
                            />
                            {newPasswordError}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                onChangeText={(newPasswordAgain) => {this.setState({newPasswordAgain, buttonStatus: 'changed'}); this.handleMatchPassword(newPasswordAgain)}}
                                value={this.state.newPasswordAgain}
                                style={{flex: 1, marginLeft: 10, marginRight: 10}}
                                placeholder={_('New password again')}
                                secureTextEntry={true}/>
                            {newPasswordAgainError}
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <Button
                                click={() => this.handleSave()}
                                text={_('Save').toUpperCase()}
                                buttonStatus={this.state.buttonStatus}
                            />
                        </View>
                    </View>
                </View>
        )
    }




    navigateToScreen(link) {
        this.props.navigator.push({
            ident: link
        })
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

module.exports = connect(mapStateToProps)(ChangePassword);