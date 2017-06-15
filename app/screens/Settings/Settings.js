/**
 * Created by Petr on 22.2.2017.
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
import Menu from '../../components/Menu';
import Toolbar from '../../components/Toolbar';
import Color from '../../config/Variables';
import { connect } from 'react-redux';
import { save } from '../../actions/index';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}

export default class Settings extends Component {

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
                    title={_('Settings')}
                    elevation={0}/>
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>Actions.SignIn()}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={styles.circle}>
                                <Icon name="power-settings-new" size={25} style={{color: 'white'}}/>
                            </View>
                            <Text style={{fontSize: 18}}>{_('Logout')}</Text>
                        </View>
                    </TouchableOpacity>
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
    circle: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: 'grey',
        marginRight: 10
    }
});

module.exports = connect(mapStateToProps)(Settings);