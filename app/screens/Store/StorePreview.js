/**
 * Created by Petr on 22.3.2017.
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
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Menu from '../../components/Menu';
import Toolbar from '../../components/Toolbar';
import Color from '../../config/Variables';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        storeSettings: store.storeSettings
    }
};

export default class StorePreview extends Component {

    render() {
        let cover;
        if(this.props.storeSettings.data.result.cover_photo){
            cover = <Image style={{width:window.width, height: 220}} resizeMode='contain' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.storeSettings.data.result.id + '?store_id=' + this.props.storeSettings.data.result.id + '&name=cover_photo&timestamp=' + Date.now() + '&do=renderImageStore'}}/>
        }else{
            cover = <View style={{width: window.width, height: 220, backgroundColor: this.props.storeSettings.data.result.cover_color}}/>
        }

        let logo;
        if(this.props.storeSettings.data.result.profile_photo){
            logo = <Image style={styles.logo} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + this.props.storeSettings.data.result.id + '?store_id=' + this.props.storeSettings.data.result.id + '&name=profile_photo&timestamp=' + Date.now() + '&do=renderImageStore'}}/>
        }else{
            logo = <View style={[styles.logo ,{backgroundColor: '#43433F'}]}/>
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
                    title={_('Store preview')}
                    elevation={2}
                    back={true}/>
                <ScrollView style={styles.container}>
                    {cover}
                    <View style={styles.logoWrap}>
                        <View style={styles.logoSmallWrap}>
                            <Text style={{marginBottom: 10, color: 'white', fontSize: 25, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 }}>{this.props.storeSettings.data.result.name}</Text>
                            {logo}
                        </View>
                    </View>
                    <View style={{padding: 15}}>
                        <Text style={{fontSize: 25, fontWeight: '500', color: 'black', marginTop: 20}}>{this.props.storeSettings.data.result.company_name}</Text>
                        <View style={{marginTop: 25, flexDirection: 'row'}}>
                            <View style={styles.circle}>
                                <Icon name="location-on" size={30} style={{color: Color.circleIcon}}/>
                            </View>
                            <View >
                                <Text style={{fontSize: 16, marginBottom: 2}}>{this.props.storeSettings.data.result.street1}</Text>
                                <Text style={{fontSize: 16, marginBottom: 2}}>{this.props.storeSettings.data.result.city} {this.props.storeSettings.data.result.zip}</Text>
                                <Text style={{fontSize: 16, marginBottom: 2}}>{this.props.storeSettings.data.result.country}</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 25, flexDirection: 'row'}}>
                            <View style={styles.circle}>
                                <Icon name="language" size={30} style={{color: Color.circleIcon}}/>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize: 16, marginBottom: 2, color: '#1580FD'}}>{this.props.storeSettings.data.result.www}</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 25, flexDirection: 'row'}}>
                            <View style={styles.circle}>
                                <Icon name="phone" size={30} style={{color: Color.circleIcon}}/>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize: 16, marginBottom: 2, color: '#1580FD'}}>{this.props.storeSettings.data.result.email}</Text>
                                <Text style={{fontSize: 16, marginBottom: 2, color: '#1580FD'}}>{this.props.storeSettings.data.result.phone_number}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoWrap: {
        alignItems: 'center',
        marginTop: -100,
    },
    logo: {
        borderColor: '#D8D8D8',
        borderWidth: 2,
        padding: 2,
        width: 150,
        height: 150
    },
    logoSmallWrap: {
        position: 'relative',
        alignItems: 'center'
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: Color.circleColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    }
});

module.exports = connect(mapStateToProps)(StorePreview);