/**
 * Created by Petr on 3.2.2017.
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
    ActivityIndicator
} from 'react-native';
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import Color from '../../../config/Variables';
import { connect } from 'react-redux';
import { save, fetch } from '../../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import GetProduct from '../../../helperFunctions/GetProduct';
import DrawerLayout from 'react-native-drawer-layout';

const mapStateToProps = (store) => {
    return{
        campaignDashboard: store.campaignDashboard
    }
};

const window = Dimensions.get('window');

export default class CampaignDashboard extends Component{

    componentWillMount(){
        this.props.dispatch(fetch('campaign/load-campaign-info', {reducer: 'campaignDashboard'}, {campaign_id: this.props.campaign_id, year: this.props.year, month: this.props.month}))
    }

    render(){
        let menu  = <Menu/>;


        let view;
        if(!this.props.campaignDashboard.fetching){

            let data = this.props.campaignDashboard.data.result,
                currencyMap = {CZK: 'Kč', EUR: '€'};

            view = <ScrollView style={styles.container}>
                <View style={[styles.b, {margin: 0, paddingTop: 5, paddingBottom: 5}]}>
                    <View style={{padding: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <GetProduct product={data.product}/>
                        <Text style={{fontWeight: 'bold'}}>
                            [{data.username}]
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 12}}>
                                {_('Delivery rate')}:
                            </Text>
                            <Text style={{fontWeight: '500', color: 'black', marginLeft: 3}}>{data.progress}%</Text>
                        </View>
                    </View>

                </View>
                <View>
                    <View style={{width: window.width / 100 *data.progress,  borderBottomWidth: 2, borderBottomColor: '#43A047'}}/>
                </View>
                <View style={[styles.b, {marginTop: 10}]}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 15}}>
                        <View style={{alignItems: 'center', width: window.width/ 3 +25}}>
                            <Text style={{fontSize: 16, marginBottom: 5}}>{_('Cost')}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="account-balance-wallet" size={30} style={{color: '#48974C'}}/>
                                <Text style={[styles.colorText, {color: '#48974C'}]}>{data.price.toFixed(2)} {currencyMap[data.user.user_currency]}</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', width: window.width/ 3+25}}>
                            <Text style={{fontSize: 16, marginBottom: 5}}>{_('Total SMS')}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="donut-large" size={30} style={{color: '#1565C0'}}/>
                                <Text style={[styles.colorText, {color: '#1565C0'}]}>{data.total}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.y}>
                        <View style={{alignItems: 'center',width: window.width/ 3 +25}}>
                            <Text style={{fontSize: 16, marginBottom: 5}}>{_('Duration')}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="timer" size={30} style={{color: '#FF9800'}}/>
                                <Text style={[styles.colorText, {color: '#FF9800'}]}>{data.duration}</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center',width: window.width/ 3 +25}}>
                            <Text style={{fontSize: 16, marginBottom: 5}}>{_('Stop sms')}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="remove-circle" size={30} style={{color: '#E53935'}}/>
                                <Text style={[styles.colorText, {color: '#E53935'}]}>{data.stopSms}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.b}>
                    <View style={styles.z}>
                        <View style={styles.q}>
                            <Text style={{fontSize: 20}}>{data.data.waiting}</Text>
                            <View style={styles.x}>
                                <Icon name="timelapse" size={20} style={{color: '#FF9800'}}/>
                                <Text style={[styles.textStyle, {color: '#FF9800'}]}>{_('Outbox')}</Text>
                            </View>
                        </View>
                        <View style={styles.q}>
                            <Text style={{fontSize: 20}}>{data.data.sent}</Text>
                            <View style={styles.x}>
                                <Icon name="call-made" size={20} style={{color: '#6EBE71'}}/>
                                <Text style={[styles.textStyle, {color: '#6EBE71'}]}>{_('Sent')}</Text>
                            </View>
                        </View>
                        <View style={styles.q}>
                            <Text style={{fontSize: 20}}>{data.data.delivered}</Text>
                            <View style={styles.x}>
                                <Icon name="done" size={20} style={{color: '#6EBE71'}}/>
                                <Text style={[styles.textStyle, {color: '#6EBE71'}]}>{_('Delivered')}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.p}>
                        <View style={styles.q}>
                            <Text style={{fontSize: 20}}>{data.data.waiting}</Text>
                            <View style={styles.x}>
                                <Icon name="access-time" size={20} style={{color: '#4EAAF4'}}/>
                                <Text style={[styles.textStyle, {color: '#4EAAF4'}]}>{_('Scheduled')}</Text>
                            </View>
                        </View>
                        <View style={styles.q}>
                            <Text style={{fontSize: 20}}>{data.data.unaviable}</Text>
                            <View style={styles.x}>
                                <Icon name="call-missed" size={20} style={{color: '#FF9800'}}/>
                                <Text style={[styles.textStyle, {color: '#FF9800'}]}>{_('Unaviable')}</Text>
                            </View>
                        </View>
                        <View style={styles.q}>
                            <Text style={{fontSize: 20}}>{data.data.error}</Text>
                            <View style={styles.x}>
                                <Icon name="error" size={20} style={{color: '#E53935'}}/>
                                <Text style={[styles.textStyle, {color: '#E53935'}]}>{_('Error')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.b, {padding: 10}]}>
                    <View style={{alignItems: 'flex-end'}}>
                        <View style={styles.sentMessage}>
                            <Text style={{textAlign: 'justify', color: 'white', fontSize: 15}}>
                                {data.text}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        }else{
            view = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
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
                    title={_('Campaign dashboard')}
                    elevation={2}/>
                {view}
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E7F0F6',
        flex: 1,
    },
    sentMessage: {
        maxWidth: window.width / 10 * 8,
        padding: 10,
        backgroundColor: '#0084FF',
        borderRadius: 10
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    colorText: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 10
    },
    textStyle: {
        fontSize: 16,
        marginLeft: 5
    },
    x: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    y: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        marginBottom: 15
    },
    z: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        marginBottom: 10
    },
    p: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5,
        marginBottom: 15
    },
    b: {
        elevation: 1,
        margin: 10,
        marginBottom: 0,
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 5
    },
    q:{
        alignItems: 'center',
        width: window.width/4,
        marginLeft: 5,
        marginRight: 5
    }

});

module.exports = connect(mapStateToProps)(CampaignDashboard);
