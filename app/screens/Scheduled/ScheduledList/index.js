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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import GetProduct from '../../../helperFunctions/GetProduct';
import GetName from '../../../helperFunctions/GetName';
import moment from 'moment';
import FilterModal from '../../../components/FilterModal';
import { AsyncStorage } from 'react-native';
import ConfirmModal from '../../../components/ConfirmModal';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        scheduledList: store.scheduledList
    }
}

export default class Scheduled extends Component{
    constructor(props){
        super(props)
        this.state = {
            refreshing: false,
            offset: 0,
            loadingFiltered: false,
            emptyData: false,
            selectedCampaign: [],
            selectedSms: [],
            selectCount: 0,
            confirmVisible: false,
            deleting: false
        }
    }

    componentWillMount(){
        this.fetchData(true)
    }

    fetchData(newData){

        this.props.dispatch(fetch('scheduled/get-scheduled-list', {reducer: 'scheduledList', newData}, {limit: 15, offset: this.state.offset, filter: {}, campaign_id: null}))


    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.scheduledList.fetching){
            this.setState({loadingNewPage: false, loadingFiltered: false})
        }

    }

    onEndReached(){
        if(this.props.scheduledList.data.result.total > this.state.offset && this.props.scheduledList.data.result.total > 15){
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

    cancelSelection(){
        this.setState({selectedCampaign: [], selectedSms: [], selectCount: 0})
    }

    select(sms_id, campaign_id){
        if(campaign_id !== ""){
            let selected = [...this.state.selectedCampaign];

            let selectCount = this.state.selectCount;
            if(selected.indexOf(campaign_id) === -1){
                selected.push(campaign_id);
                selectCount++;
            }else{
                selected.splice( selected.indexOf(campaign_id), 1 );
                selectCount--;
            }

            this.setState({selectedCampaign: selected, selectCount});
        }else{
            let selected = [...this.state.selectedSms];

            let selectCount = this.state.selectCount;
            if(selected.indexOf(sms_id) === -1){
                selected.push(sms_id);
                selectCount++;
            }else{
                selected.splice( selected.indexOf(sms_id), 1 );
                selectCount--;
            }

            this.setState({selectedSms: selected, selectCount});
        }
    }

    onDeleteSuccess(){
        this.setState({confirmVisible: false, selectedCampaign: [], selectedSms: [], selectCount: 0, deleting: false})
    }

    onDeleteError(){
        this.setState({confirmVisible: false, selectedCampaign: [], selectedSms: [], selectCount: 0, deleting: false})
    }

    deleteSelected(){
        this.setState({deleting: true}, ()=>{
            this.props.dispatch(deleteListItem('scheduled/delete', {reducer: 'scheduledList'}, {campaign_id: this.state.selectedCampaign, sms_id: this.state.selectedSms}, ()=>this.onDeleteSuccess(), ()=>this.onDeleteError()));
        })
    }

    formatTime(time, shortTime){

        let formatedTime;
        if(moment().format('D[.]MM[.]') == time.slice(0,6)){
            formatedTime = shortTime.slice(0,5)
        }else{
            formatedTime = time.slice(0,6)
        }

        return formatedTime
    }


    render() {

        let toolbar;
        if(this.state.selectCount > 0){
            toolbar = <View style={styles.toolbarContainer} elevation={2}>
                <TouchableOpacity onPress={()=>this.cancelSelection()}>
                    <View style={{width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon style={{color: 'white'}} name="close" size={30}/>
                    </View>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                    <Text style={{color: 'white', marginLeft: 25, fontSize: 20}}>{_('Selected')}: {this.state.selectCount}</Text>
                </View>
                <TouchableOpacity onPress={()=>this.setState({confirmVisible: true})}>
                    <View style={{width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon style={{color: 'white'}} name="delete" size={30}/>
                    </View>
                </TouchableOpacity>
            </View>
        }else{
            toolbar = <Toolbar
                openMenu={() => this.drawer.openDrawer()}
                background="container"
                title={_('Scheduled')}
                handleFilterIconClick={()=> this.setState({showFilter: true})}
                elevation={2}/>
        }

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
        if(this.props.scheduledList.emptyData){
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
                {toolbar}
                <View style={styles.container}>
                    {loader}
                    {emptyData}
                    <FlatList
                        ref={(flatlist) => {this.flatlist = flatlist}}
                        style={{flex: 1}}
                        data={this.props.scheduledList.list}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0.2}
                        keyExtractor={(item, index) => index}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({item}) => {

                            let itemRow;
                            if(item.campaign_id == ""){

                                let background = this.state.selectedCampaign.indexOf(item.campaign_id) !== -1 ? {backgroundColor: '#D8D8D8'} : {backgroundColor: 'white'};

                                itemRow = <TouchableWithoutFeedback key={item.id} onPress={()=>Actions.ScheduledDetail({id: item.campaign_id})} onLongPress={(event) => this.select(item.sms_id, item.campaign_id)}>
                                    <View>
                                        <View style={[styles.itemWrap, background]} >
                                            <GetProduct product={item.product}/>
                                            <View style={{flex: 1, marginLeft: -5}}>
                                                <Text style={styles.itemText}>[{_('campaign')}] {item.campaign_id}</Text>
                                            </View>
                                            <View style={{alignItems: 'center'}}>
                                                <Text>{this.formatTime(item.time, item.short_time)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.separator}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            }else{

                                let background = this.state.selectedSms.indexOf(item.sms_id) !== -1 ? {backgroundColor: '#D8D8D8'} : {backgroundColor: 'white'};

                                itemRow = <TouchableWithoutFeedback onLongPress={(event) => this.select(item.sms_id, item.campaign_id)} key={item.id}>
                                            <View>
                                                <View style={[styles.itemWrap, background]}>
                                                    <GetProduct product={item.product}/>
                                                    <View style={{flex: 1, marginLeft: -5}}>
                                                        <Text style={styles.itemText}>{item.number}</Text>
                                                        <Text style={styles.itemTextRead}>{item.message.substr(0, 30)}</Text>
                                                    </View>
                                                    <View style={{alignItems: 'center'}}>
                                                        <Text>{this.formatTime(item.time, item.short_time)}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.separator}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                            }

                            return itemRow
                        }}
                    />

                </View>
                <ConfirmModal
                    visible={this.state.confirmVisible}
                    handleClose={()=>this.setState({confirmVisible: false})}
                    numberOfItemsToDelete={this.state.selectCount}
                    handleOk={()=>this.deleteSelected()}
                    deleting={this.state.deleting}
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
        backgroundColor: '#EA1E63',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    g: {
        backgroundColor: '#8B8B8B',
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 30
    },
    c: {
        color: 'black',
        fontWeight: '600',
        fontSize: 16
    },
    toolbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.toolbar,
        height: 60,
        padding: 15,
    },
    bottomButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        borderRadius: 50,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60
    },
    modalContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: 0.9
    },
    modalSmallContainer: {
        backgroundColor: 'white',
        width: window.width/5 * 4 - 20,
        height: window.height/5 * 2,
        elevation: 4,
        padding: 25
    },
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
    text: {
        color: 'black',
        fontSize: 16
    }
});

module.exports = connect(mapStateToProps)(Scheduled);