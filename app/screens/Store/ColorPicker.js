/**
 * Created by Petr on 8.2.2017.
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
import { saveImage } from '../../actions/index'
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { fromJS } from 'immutable';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        storeSettings: store.storeSettings
    }
};


export default class ColorPickerComponent extends Component{

    constructor(props){
        super(props);
        this.state = {

        }
    }

    handleSave(){
        let color = fromHsv(this.state.color);

        let map = fromJS(this.props.storeSettings).mergeDeep({data: {result: {cover_color: color, cover_photo: false}}}).toJS();

        this.props.dispatch({type: 'CHANGE_STORE', meta: {reducer: 'storeSettings'}, payload: map});

        Actions.pop()
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
                    title={_('Choose color')}
                    elevation={2}
                    back={true}/>
                <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
                    <ColorPicker
                        onColorChange={(color) => {this.setState({color: color})}}
                        style={{flex: 1, padding: 15}}
                    />
                    <View style={{width: 110, justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: 30}}>
                        <TouchableOpacity onPress={() => this.handleSave()}>
                            <View style={styles.buttonWrap}>
                                <Text style={styles.buttonText}>{_('Save').toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
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

module.exports = connect(mapStateToProps)(ColorPickerComponent);