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
import { connect } from 'react-redux';
import { save, fetch } from '../../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import GetProduct from '../../../helperFunctions/GetProduct';
import GetMethod from '../../../helperFunctions/GetMethod';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        invoices: store.invoices
    }
}

export default class Invoices extends Component{
    constructor(props){
        super(props)
        this.state = {
            refreshing: false,
            offset: 0,
            loadingNewPage: true,
            emptyData: false
        }
    }



    componentWillMount(){
        AsyncStorage.getItem('filterInvoices', (err, filter) => {
            if(filter){
                this.setState({ loadingFiltered: false, filter: JSON.parse(filter) }, ()=>{
                    this.fetchData(true)
                })
            }

            if(err || filter === null){
                this.setState({ loadingFiltered: false}, ()=>{
                    this.fetchData(true)
                })
            }

        });

    }

    fetchData(newData){
        this.props.dispatch(fetch('payments/get-invoices', {reducer: 'invoices', newData}, { limit: 15, offset: this.state.offset}))

        if(newData){
            this.flatlist.scrollToOffset({x: 0, y: 0})
        }
    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.invoices.fetching){
            this.setState({loadingNewPage: false, loadingFiltered: false})
        }
    }

    onEndReached(){
        if(this.props.invoices.data.result.list.total > this.state.offset && this.props.invoices.data.result.list.total > 15){
            this.setState({offset: this.state.offset+15, loadingNewPage: true}, () => {
                this.fetchData(false)
            })
        }
    }

    onRefresh(){
        this.setState({offset: 0}, () => {
            this.fetchData(true)
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

        let loader;
        if(this.state.loadingFiltered){
            loader = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }

        let emptyData;
        if(this.props.invoices.emptyData){
            emptyData = <View style={{height: window.height-150, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="filter-list" size={80} style={{marginBottom: 30}}/>
                <Text style={{fontSize: 25, textAlign: 'center'}}>{_('Selection did not match any records')}</Text>
            </View>
        }


        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Invoices')}
                    handleFilterIconClick={()=> this.setState({showFilter: true})}
                    elevation={2}/>
                <View style={styles.container}>
                    {loader}
                    {emptyData}
                    <FlatList
                        ref={(flatlist) => {this.flatlist = flatlist}}
                        style={{flex: 1}}
                        data={this.props.invoices.list}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0.2}
                        keyExtractor={(item, index) => index}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({item}) => {
                            return <TouchableOpacity onPress={()=> Actions.InvoiceDetail(item)}>
                                    <View>
                                        <View style={styles.itemWrap}>
                                            <GetProduct product={item.product}/>
                                            <View style={{flex: 1, marginLeft: 20}}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                                    <GetMethod method={item.method}/>
                                                </View>
                                            </View>
                                            <View style={{alignItems: 'flex-end'}}>
                                                 <Text>{item.date.slice(0,6)}</Text>
                                                <Text style={{fontWeight: '500', fontSize: 14, color: 'black', marginTop: 8}}>{item.price} {item.currency}</Text>
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
        justifyContent: 'center',
        padding: 15
    },
    itemImage: {
        width: 45,
        height: 45,
        borderRadius: 100,
        marginRight: 15
    },
    itemText: {
        fontSize: 14,
        color: 'black',
        fontWeight: '500'
    },
    itemPrice: {
        fontSize: 16,
        color: '#BE2166',
        fontWeight: '500',
        marginLeft: 5
    },
    iconOrange: {
        color: 'orange',
        marginTop: 5
    },
    itemTextRead: {
        fontSize: 14,
    },
    itemPriceRead: {
        fontSize: 16,
        color: '#BE2166',
        marginLeft: 5
    },
    iconGreen: {
        color: 'green',
        marginTop: 5
    },
    numberCircle: {
        position: 'relative',
        bottom: 20,
        left: 30,
        backgroundColor: '#DE4232',
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: 23,
        height: 23,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    itemIconBulkgate: {
        width: 45,
        height: 45,
        backgroundColor: '#3FAEA0',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    itemIconSunsms: {
        width: 45,
        height: 45,
        backgroundColor: '#2B2B2A',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    itemIconPerson:{
        width: 45,
        height: 45,
        backgroundColor: '#EA1E63',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    }
});

module.exports = connect(mapStateToProps)(Invoices);