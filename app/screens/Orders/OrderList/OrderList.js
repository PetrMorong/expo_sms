/**
 * Created by Petr on 20.2.2017.
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
import { save, fetch, deleteListItem } from '../../../actions/index';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import DrawerLayout from 'react-native-drawer-layout';

const mapStateToProps = (store) => {
    return{
        orderList: store.orderList
    }
}

export default class OrderList extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: [],
            refreshing: false,
            offset: 0,
            selectCount: 0,
            loadingNewPage: true,
        }
    }

    componentWillMount(){
        this.initialFetch()
    }

    initialFetch(){
        this.props.dispatch(fetch('order/get-orders', {reducer: 'orderList'}, {from: '2015-04-20', to: '2017-04-20', filter: 'false', username: null, limit: 20, offset: 0}))
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.orderList.data){

            let array = Object.keys(nextProps.orderList.data.result.data).map((x) => nextProps.orderList.data.result.data[x]);

            if(this.state.offset === 0){
                this.setState({data: array})
            }else{
                let newData = this.state.data.concat(array);
                this.setState({data: newData})
            }
        }

        if(!nextProps.orderList.fetching){
            this.setState({loadingNewPage: false})
        }
    }

    onEndReached(){
        if(this.props.orderList.data.result.total > this.state.offset && this.props.orderList.data.result.total > 20){
            this.setState({offset: this.state.offset+20, loadingNewPage: true}, () => {
                this.props.dispatch(fetch('order/get-orders', {reducer: 'orderList'}, {from: '2015-04-20', to: '2017-04-20', filter: 'false', username: null, limit: 20, offset: this.state.offset}))
            })
        }
    }

    onRefresh(){
        this.setState({offset: 0}, () => {
            this.props.dispatch(fetch('order/get-orders', {reducer: 'orderList'}, {from: '2015-04-20', to: '2017-04-20', filter: 'false', username: null, limit: 20, offset: this.state.offset}))
        })
    }

    renderFooter = () => {

        if(!this.state.loadingNewPage) return null;

        return <View style={{backgroundColor: 'white', height: 70, width: window.width, justifyContent: 'center'}}>
            <ActivityIndicator
                style={{height: 150}}
                size="large"
            />
        </View>
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
                    title={_('Orders')}
                    elevation={0}/>
                <View style={styles.container}>
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.data}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0.2}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({item}) => {

                            let image;
                            if(item.image){
                                image = <Image style={styles.itemImage} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal-order/detail/' + item.deal_id + '?name=image&do=renderImageStore'}}/>
                            }else{
                                image = <View style={{width: 45, height: 45, borderRadius: 100, marginRight: 15, backgroundColor: Color.button, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon name="image"  style={{color: 'black'}} size={25}/>
                                </View>
                            }
                            return <TouchableOpacity onPress={()=> Actions.Order()}>
                                    <View>
                                        <View style={styles.itemWrap}>
                                            <View>
                                                {image}
                                            </View>
                                            <View style={{flexDirection: 'row', flex: 1}}>
                                                <Text style={styles.itemText}>{item.headline}</Text>
                                                <Text style={styles.itemPrice}>1500 $</Text>
                                            </View>
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={styles.itemDate}>16.1.</Text>
                                                <Icon name='new-releases' size={20} style={styles.iconOrange}/>
                                            </View>
                                        </View>
                                        <View style={styles.separator}/>
                                    </View>
                                </TouchableOpacity>
                        }}
                    />
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
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    itemWrap: {
       flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        padding: 15
   },
    itemImage: {
       width: 45,
        height: 45,
        borderRadius: 350,
        marginRight: 15
   },
    itemText: {
       fontSize: 16,
        color: 'black',
        fontWeight: '500'
   },
    itemPrice: {
       fontSize: 16,
        color: '#BE2166',
        fontWeight: '500',
        marginLeft: 5
   },
    itemDate: {
       fontWeight: '500',
        color: '#0FACE0'
   },
    iconOrange: {
       color: 'orange',
       marginTop: 5
   },
    itemTextRead: {
        fontSize: 16,
    },
    itemPriceRead: {
        fontSize: 16,
        color: '#BE2166',
        marginLeft: 5
    },
    iconGreen: {
        color: 'green',
        marginTop: 5
    }

});

module.exports = connect(mapStateToProps)(OrderList);