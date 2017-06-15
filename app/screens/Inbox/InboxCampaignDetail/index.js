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
import { save, fetch } from '../../../actions/index';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import GetProduct from '../../../helperFunctions/GetProduct';
import GetStatus from '../../../helperFunctions/GetStatus';
import GetName from '../../../helperFunctions/GetName';
import moment from 'moment';
import FilterModal from '../../../components/FilterModal';
import { AsyncStorage } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        inboxCampaignDetail: store.inboxCampaignDetail
    }
}

export default class InboxCampaignDetail extends Component{
    constructor(props){
        super(props)
        this.state = {
            refreshing: false,
            offset: 0,
            loadingNewPage: true,
            loadingFiltered: true,
            showFilter: false,
            from: moment(moment().subtract(30, 'days').calendar()).format('YYYY[-]MM[-]DD'),
            to: moment().format('YYYY[-]MM[-]DD'),
            filter: {},
            emptyData: false
        }
    }

    componentWillMount(){
        AsyncStorage.getItem('filterInboxDetail', (err, filter) => {

            if(filter){
                this.setState({ loadingFiltered: false, filter: JSON.parse(filter) }, ()=>{
                    this.fetchData(true)
                })
            }

            if(err || filter === null){
                this.fetchData(true)
            }

        });

    }

    fetchData(newData){

        this.props.dispatch(fetch('inbox/load', {reducer: 'inboxCampaignDetail', newData}, {from: this.state.from, to: this.state.to, filter: this.state.filter, campaign_id: this.props.id, limit: 15, offset: this.state.offset}))

        if(newData){
            this.flatlist.scrollToOffset({x: 0, y: 0})
        }
    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.inboxCampaignDetail.fetching){
            this.setState({loadingNewPage: false, loadingFiltered: false})
        }

    }

    onEndReached(){
        if(this.props.inboxCampaignDetail.data.data.list.total > this.state.offset && this.props.inboxCampaignDetail.data.data.list.total > 15){
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

    formatTime(time){

        let formatedTime;
        if(moment().format('D[.]MM[.]') == time.slice(0,6)){
            formatedTime = time.slice(11,16)
        }else{
            formatedTime = time.slice(0,6)
        }

        return formatedTime
    }

    handleSaveFilter(data){

        let filter = this.state.filter;

        if(data.filter !== "" && data.filter_value !==""){

            let found = false;

            if(filter[data.filter]){

                filter[data.filter].map((x)=>{
                    if(x !== data.filter_value){
                        filter[data.filter].push(data.filter_value)
                    }
                });
                found = true;
            }

            if(!found){
                filter[data.filter] = [data.filter_value];
            }
        }


        this.setState({offset: 0, showFilter: false, loadingFiltered: true, from: data.from, to: data.to, filter: filter}, () => {
            this.fetchData(true);
            AsyncStorage.setItem('filterInboxDetail', JSON.stringify(filter))
        })

    }

    clearFilterAll(){
        this.setState({
            offset: 0,
            showFilter: false,
            loadingFiltered: true,
            filter: {},
            from: moment(moment().subtract(30, 'days').calendar()).format('YYYY[-]MM[-]DD'),
            to: moment().format('YYYY[-]MM[-]DD')
        }, () => {
            this.fetchData(true);
            AsyncStorage.removeItem('filterInboxDetail')
            this.chipsScroll.scrollTo({x: 0, y: 0, animated: true})
        })
    }

    clearFilter(value, item){
        let filter = this.state.filter;

        Object.keys(filter).map((x)=>{

            filter[x].map((y)=>{
                if(y === item && x === value){
                    filter[x].splice( filter[x].indexOf(y), 1 )
                }
            });

            if(filter[x].length === 0){
                delete filter[x]
            }
        });

        this.setState({offset: 0, showFilter: false, loadingFiltered: true, data: [], filter: filter}, () => {
            this.fetchData(true);
            AsyncStorage.setItem('filterInboxDetail', JSON.stringify(filter))
            this.chipsScroll.scrollTo({x: 0, y: 0, animated: true})
        })

    }


    render() {

        let loader;
        if(this.state.loadingFiltered){
            loader = <View style={{backgroundColor: 'white', height: window.height-120, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }

        let emptyData;
        if(this.props.inboxCampaignDetail.emptyData){
            emptyData = <View style={{height: window.height-150, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="filter-list" size={80} style={{marginBottom: 30}}/>
                <Text style={{fontSize: 25, textAlign: 'center'}}>{_('Selection did not match any records')}</Text>
            </View>
        }

        let chipsItem = Object.keys(this.state.filter).map((item)=>{

            return this.state.filter[item].map((x)=>{

                return <View style={{paddingLeft: 10, paddingRight: 5, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>{_(item)}:</Text>
                    <Text> <GetName name={x} item={item} identifier="inbox"/> </Text>
                    <TouchableOpacity onPress={()=> this.clearFilter(item, x)}>
                        <View style={{width: 30, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name="cancel" size={25} style={{color: 'lightgrey', marginLeft: 5}}/>
                        </View>
                    </TouchableOpacity>
                </View>

            })
        });

        let clearFilterIcon;
        if(Object.keys(this.state.filter).length !==0){
            clearFilterIcon = <TouchableOpacity onPress={()=>this.clearFilterAll()}>
                <View style={{width: 60, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="close" size={30}/>
                </View>
            </TouchableOpacity>
        }

        let chips = <View style={{height: 60, alignItems: 'center', flexDirection: 'row'}}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ height: 40, elevation: 1, flexDirection: 'row'}}
                ref={(scroll) => { this.chipsScroll = scroll }}
            >
                <View style={{paddingLeft: 10, paddingRight: 10, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground,  borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>From:</Text>
                    <Text style={{color: Color.chipsText}}> {this.state.from}</Text>
                </View>
                <View style={{paddingLeft: 10, paddingRight: 10, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>To:</Text>
                    <Text style={{color: Color.chipsText}}> {this.state.to}</Text>
                </View>

                {chipsItem}
                {clearFilterIcon}
            </ScrollView>
        </View>;


        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={this.props.id}
                    filter={true}
                    back={true}
                    handleFilterIconClick={()=> this.setState({showFilter: true})}
                    elevation={2}/>
                {chips}
                <View style={styles.container}>
                    {loader}
                    {emptyData}
                    <FlatList
                        ref={(flatlist) => {this.flatlist = flatlist}}
                        style={{flex: 1}}
                        data={this.props.inboxCampaignDetail.list}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0.2}
                        keyExtractor={(item, index) => index}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({item}) => {

                            let itemRow;
                            if(item.campaign){
                                itemRow = <TouchableOpacity onPress={()=> Actions.Chat()} key={item}>
                                <View>
                                    <View style={styles.itemWrap}>
                                        <GetProduct product={item.type}/>
                                        <View style={{flex: 1}}>
                                            <Text style={styles.itemText}>[{_('Campaign')}] {item.campaign_id}</Text>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <Text>{this.formatTime(item.sms_center_time)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.separator}/>
                                </View>
                            </TouchableOpacity>
                            }else{
                                itemRow = <TouchableOpacity onPress={()=> Actions.Chat()} key={item}>
                                <View>
                                    <View style={styles.itemWrap}>
                                        <View>
                                            <View style={styles.itemIconPerson}><Icon name="person" size={25} style={{color: 'white'}}/></View>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={styles.itemText}>{item.from}</Text>
                                            <Text style={styles.itemTextRead}>{item.message.substr(0, 35)}</Text>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <Text>{this.formatTime(item.sms_center_time)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.separator}/>
                                </View>
                            </TouchableOpacity>
                            }

                            return itemRow


                        }}
                    />

                </View>
                <FilterModal visible={this.state.showFilter}
                             time={true}
                             handleClose={()=>this.setState({showFilter: false})}
                             handleSaveFilter={(data)=>this.handleSaveFilter(data)}
                             identifier="inbox"
                             itemsToFilter={[
                                 'Select value',
                                 'from',
                                 'text'
                             ]}
                />
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
        backgroundColor: Color.secondaryColor,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 25,
        marginLeft: 5
    }

});

module.exports = connect(mapStateToProps)(InboxCampaignDetail);