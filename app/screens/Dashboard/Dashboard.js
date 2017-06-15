
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
    TouchableNativeFeedback,
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


import { TabViewAnimated, TabBar } from 'react-native-tab-view';

import Sms from './Sms'
import SmartSms from './SmartSms'

const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        _: store.translator.translations
    }
}


export default class Dashboard  extends Component {
    constructor(props){
        super(props)
        this.state = {
            index: 0,
            routes: [
                { key: '1', title: 'Sms' },
                { key: '2', title: 'Smart sms' },
            ],
        }
    }

    _handleChangeTab = (index) => {
        this.setState({ index });
    };

    _renderHeader = (props) => {
        return <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
        />;
    };

    _renderScene = ({ route }) => {
        switch (route.key) {
            case '1':
                return <Sms/>;
            case '2':
                return <SmartSms/>;
            default:
                return null;
        }
    };


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
                    title={_('Dashboard')}
                    elevation={2}/>
                <ScrollView style={styles.container}>
                    <ElevatedView style={styles.cover}>
                        <View style={styles.avatarContainer}>
                            <Image
                                style={styles.avatar}
                                source={{ uri, }}/>
                            <Text style={styles.name}>Petr Morong</Text>
                            <Text style={styles.email}>moriandr73@gmail.com</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15}}>
                            <View style={styles.coverNumbersWrap}>
                                <Text style={styles.highlightText}>254 896</Text>
                                <Text style={{color: '#bdd6d2' }}>{_('sms').toUpperCase()}</Text>
                            </View>
                            <View style={styles.coverNumbersWrap}>
                                <Text style={styles.highlightText}>78 546</Text>
                                <Text style={{color: '#bdd6d2' }}>{_('Credit').toUpperCase()}</Text>
                            </View>
                            <View style={styles.coverNumbersWrap}>
                                <Text style={styles.highlightText}>January</Text>
                                <Text style={{color: '#bdd6d2' }}>{_('Month').toUpperCase()}</Text>
                            </View>
                        </View>
                    </ElevatedView>
                </ScrollView>
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#011D2B',
        flexDirection: 'column'
    },
    cover: {
        height: window.height/3 + 30,
        backgroundColor: Color.dashboardBackground,
    },
    avatarContainer: {
        height: 140,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.dashboardBackground,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50
    },
    name: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5
    },
    email: {
        color: 'white',
        fontSize: 14,
        marginTop: 5
    },
    coverNumbersWrap: {
        alignItems: 'center'
    },
    highlightText: {
        fontWeight: '500',
        color: Color.dashboardStatsColor,
        fontSize: 18,
        lineHeight: 25
    }
});

module.exports = connect(mapStateToProps)(Dashboard);

