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
import { save, fetch } from '../../../actions/index';
import { Actions } from 'react-native-router-flux';
import Button from '../../../components/Button';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        storeCreate: store.storeCreate
    }
}

export default class StoreCreate extends Component{
    constructor(props){
        super(props)
        this.state = {
            text: '',
            buttonStatus: 'default'
        }
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.storeCreate.saving){
            this.setState({buttonStatus: 'saving'})
        }

        if(nextProps.storeCreate.saved){
            this.setState({buttonStatus: 'saved'})
            Actions.StoreSettings({id: nextProps.storeCreate.storeId})
        }

        if(nextProps.storeCreate.error){
            this.setState({buttonStatus: 'error'})
        }
    }

    handleSave(){
        this.props.dispatch(save('store/create-store', {reducer: 'storeCreate'},{name: this.state.text}))
    }


    render() {
        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <ScrollView >
                    <Toolbar
                        openMenu={() => this.drawer.openDrawer()}
                        background="containerNoBg"
                        title={_('Create store')}
                        elevation={0}/>
                    <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} resizeMode='stretch' source={require('../../../images/CreateStore.png')}/>
                        </View>
                        <View style={{padding: 15, marginTop: 30}}>
                            <TextInput
                                onChangeText={(text) => this.setState({text})}
                                value={this.state.text}
                                placeholder={_('Store name')}/>
                        </View>
                    </View>
                </ScrollView>
                <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', margin: 15}}>
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
        backgroundColor: 'white',
        height: window.height - 160
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    imageContainer: {
        height: window.height / 5 * 2,
        backgroundColor: Color.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 235,
        width: 300
    }
});

module.exports = connect(mapStateToProps)(StoreCreate);