/**
 * Created by Petr on 4.5.2017.
 */
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
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { save, fetch, deleteListItem } from '../../../../../actions/index';
import Toolbar from '../../../../../components/Toolbar';
import Menu from '../../../../../components/Menu';
import RadioButton from '../../../../../components/RadioButton';
import Color from '../../../../../config/Variables';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Checkbox from '../../../../../components/CheckBox';
import { Actions } from 'react-native-router-flux';
import SaveModal from '../../../../../components/SaveModal'
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        bulkgateRecipients: store.bulkgateRecipients,
        campaign: store.campaign
    }
}

export default class BulkgateRecipients extends Component {
    constructor(props){
        super(props)

        this.state = {
            offset: 0,
            selectRecipients: true,
            allContacts: false,
            index: 0,
            selectedContacts: this.props.campaign.address_book_contacts_selected,
            selectedGroups: this.props.campaign.address_book_groups_selected,
            searching: false,
            confirmVisible: false,
            selectCount: this.props.campaign.data.result.recipientsCount.address_book,
            searchText: '',
            refreshing: false,
            loadingNewPage: false,
            loading: true,
            routes: [
                { key: '1', title: _('Contacts') },
                { key: '2', title: _('Groups') }
            ]
        }
    }

    fetchData(newData){
        this.props.dispatch(fetch('campaign/get-address-book', {reducer: 'bulkgateRecipients', newData}, {limit: 30, offset: this.state.offset}))
    }

    componentWillMount(){
        this.fetchData(true)
    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.bulkgateRecipients.fetching){
            this.setState({loadingNewPage: false, loading: false})
        }

    }

    onEndReached(){
        if(this.props.bulkgateRecipients.list.length > this.state.offset && this.props.bulkgateRecipients.data.result.count > 30){
            this.setState({offset: this.state.offset+30, loadingNewPage: true}, () => {
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
                return this.renderContacts();
            case '2':
                return this.renderGroups();
            default:
                return null;
        }
    };

    selectContact(item){

        let selected = this.state.selectedContacts;

        let selectCount = this.state.selectCount;

        if(selected.indexOf(item.id) !== -1){

            selected = selected.filter((x)=>{
                return x == item.id ?  false : true
            });

            selectCount--;

        }else{
            selected.push(item.id)
            selectCount++;
        }

        this.setState({selectedContacts: selected, selectCount})

    }

    selectGroup(item){

        let selectCount = this.state.selectCount;

        let selected = this.state.selectedGroups;

        if(selected.indexOf(item.id) !== -1){

            selected = selected.filter((x)=>{
                return x == item.id ?  false : true
            });

            selectCount = selectCount - item.count;

        }else{
            selected.push(item.id)

            selectCount = selectCount + item.count;
        }

        this.setState({selectedGroups: selected, selectCount})

    }

    selectAllContacts(){
        this.setState({selected: this.props.bulkgateRecipients.list, selectedAll: true})
    }

    clearSelection(toDelete){

        let newArray = this.state.selected.filter((item)=>{
            return item.id == toDelete ?  false : true
        });

        this.setState({selected: newArray})
    }

    clearSelectionAll(){
        this.setState({selected: []})
    }

    cancelSearchGroups(){
        this.props.dispatch({type: 'CANCEL_FILTER_GROUPS', meta: {reducer: 'campaign'}})
    }

    handleSearch(){
        this.setState({searching: false})

        if(this.state.index == 1){
            this.props.dispatch({type: 'FILTER_GROUPS', meta: {reducer: 'campaign'}, payload: this.state.searchText})
        }else {
            this.props.dispatch(fetch('campaign/load-address-book-preview', {reducer: 'bulkgateRecipients'}, {query: this.state.searchText, limit: 50}))
        }
    }

    renderContacts(){

        if(this.state.loading){
            return <View style={{backgroundColor: 'white', height: window.height-120, width: window.width, justifyContent: 'center', }}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }else{

            let searched;
            if(this.props.bulkgateRecipients.searched){
                searched = <View style={{backgroundColor: '#EEEEEE', height: 40, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: '#969696', fontSize: 16}}>{_('Results')}: {this.props.bulkgateRecipients.list.length}</Text>
                    <TouchableOpacity onPress={()=>{this.fetchData(true)}}>
                        <View style={{flexDirection: 'row',}}>
                            <Icon name="close" size={25} style={{color: '#969696', marginRight: 6}}/>
                            <Text style={{color: '#969696', fontSize: 16}}>{_('Clear search')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }

            let emptyData;
            if(this.props.bulkgateRecipients.list.length == 0 && !this.props.bulkgateRecipients.fetching){
                emptyData = <View style={{height: window.height-200, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="search" size={80} style={{marginBottom: 30}}/>
                    <Text style={{fontSize: 25, textAlign: 'center'}}>{_('Nothing found')}</Text>
                </View>
            }

            return <View style={styles.container}>
                {searched}
                {emptyData}
                <FlatList
                    ref={(flatlist) => {this.flatlist = flatlist}}
                    style={{flex: 1}}
                    data={this.props.bulkgateRecipients.list}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.onRefresh()}
                    onEndReachedThreshold={0.2}
                    keyExtractor={(item, index) => index}
                    onEndReached={() => this.onEndReached()}
                    ListFooterComponent={this.renderFooter}
                    renderItem={({item}) => {

                        let background = this.state.selectedContacts.indexOf(item.id) !== -1 ? ['#D8D8D8', true] : ['white', false];

                        return <TouchableWithoutFeedback key={item.id}  onPress={(event) => this.selectContact(item)} >
                                    <View>
                                        <View style={[styles.h, {backgroundColor: background[0]}]} >
                                            <View style={styles.b}>
                                               <Icon name="person" style={{color: 'white'}} size={25}/>
                                           </View>
                                            <View style={{flex: 1, marginLeft: -5, flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                                                <View style={{flex: 1, flexDirection: 'row'}}>
                                                    <Text style={{fontSize: 16}}>{item.first_name} </Text>
                                                    <Text style={{fontSize: 16}}>{item.last_name} </Text>
                                                </View>
                                                <Checkbox onCheck={()=>this.selectContact(item)} checked={background[1]}/>
                                            </View>
                                        </View>
                                        <View style={styles.separator}/>
                                    </View>
                                </TouchableWithoutFeedback>
                        }}
                />
            </View>
        }
    }

    renderGroups(){

        let searched;
        if(this.props.campaign.searched){
            searched = <View style={{backgroundColor: '#EEEEEE', height: 40, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#969696', fontSize: 16}}>{_('Results')}: {this.props.campaign.address_book_groups.length}</Text>
                <TouchableOpacity onPress={()=>this.cancelSearchGroups()}>
                    <View style={{flexDirection: 'row',}}>
                        <Icon name="close" size={25} style={{color: '#969696', marginRight: 6}}/>
                        <Text style={{color: '#969696', fontSize: 16}}>{_('Clear search')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        }

        let emptyData;
        if(this.props.campaign.address_book_groups.length == 0 && !this.props.campaign.fetching){
            emptyData = <View style={{height: window.height-200, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="search" size={80} style={{marginBottom: 30}}/>
                <Text style={{fontSize: 25, textAlign: 'center'}}>{_('Nothing found')}</Text>
            </View>
        }

       return  <View style={styles.container}>
            {searched}
            {emptyData}
            <FlatList
                ref={(flatlistGroups) => {this.flatlistGroups = flatlistGroups}}
                style={{flex: 1}}
                data={this.props.campaign.address_book_groups}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => {

                        let background = this.state.selectedGroups.indexOf(item.id) !== -1 ? ['#D8D8D8', true] : ['white', false];

                        return <TouchableWithoutFeedback key={item.id}  onPress={(event) => this.selectGroup(item)} >
                                    <View>
                                        <View style={[styles.h, {backgroundColor: background[0]}]} >
                                            <View style={styles.b}>
                                               <Icon name="group" style={{color: 'white'}} size={25}/>
                                           </View>
                                            <View style={{flex: 1, marginLeft: -5, flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text style={{fontSize: 16}}>{item.name} </Text>
                                                </View>
                                                <Text style={{fontSize: 16, color: 'white', backgroundColor: '#4CAF50', paddingLeft: 10, padding: 6, borderRadius: 2, marginRight: 10}}>{item.count} </Text>

                                                <Checkbox onCheck={()=>this.selectGroup(item)} checked={background[1]}/>
                                            </View>
                                        </View>
                                        <View style={styles.separator}/>
                                    </View>
                                </TouchableWithoutFeedback>
                        }}
            />
        </View>

    }

    handleBack(){
        if(this.state.selectCount > 0){
            this.setState({confirmVisible: true})
        }else{
            Actions.pop()
        }
    }

    handleSave(){
        let transformedData = {
            campaign: {
                address_book_contacts: this.state.selectedContacts,
                address_book_groups: this.state.selectedGroups
            }
        };


        this.setState({saving: true}, ()=>{
            this.props.dispatch(
                save(
                    'campaign/set-value',
                    {reducer: 'campaign'},
                    {id: this.props.campaign.data.result.campaign.id , data: transformedData},
                    ()=>setTimeout(()=>{ this.onSuccessSave() }, 10)
                )
            )
        })
    }

    onSuccessSave(){
        this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.campaign.data.result.campaign.id}, ()=>Actions.pop()))
    }

    renderToolbar(){
        if(this.state.searching){
            return <View style={styles.toolbar}>
                <TouchableWithoutFeedback  onPress={()=>this.setState({searching: false})} >
                    <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center', paddingLeft: 15}}>
                        <Icon style={styles.menuIcon} name="close" size={30}/>
                    </View>
                </TouchableWithoutFeedback>
                <TextInput
                    onChangeText={(searchText) => this.setState({searchText})}
                    value={this.state.searchText}
                    keyboardType="web-search"
                    style={{flex: 1, fontSize: 18, height: 50, marginLeft: 10, marginRight: 10, color: 'white'}}
                    placeholder="Search"
                    placeholderTextColor="white"
                    selectionColor="white"
                    autoFocus={true}
                />
                <TouchableWithoutFeedback onPress={()=>this.handleSearch()}>
                    <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center', paddingRight: 15}}>
                        <Icon style={styles.creditIcon} name='search' size={30}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        }else{
            let selectCount;
            if(this.state.allContacts){
                selectCount = this.props.bulkgateRecipients.total
            }else{
                selectCount = this.state.selectCount;
            }

            let selectAllIcon;
            if(this.state.allContacts){
                selectAllIcon = <Icon style={styles.creditIcon} name='close' size={30}/>
            }else{
                selectAllIcon = <Icon style={styles.creditIcon} name='select-all' size={30}/>
            }

            return <View style={styles.toolbar}>
                <TouchableWithoutFeedback  onPress={()=>this.handleBack()} >
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 25, height: 60, paddingLeft: 15 }}>
                        <View style={{width: 25, height: 60,  borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon style={styles.menuIcon} name="arrow-back" size={30}/>
                        </View>
                        <View style={{height: 60, justifyContent: 'center'}}>
                            <View style={{ width: 180}}>
                                <Text style={styles.screenName}>{_('Selected') + ': ' + selectCount }</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>this.setState({searching: true, searchText: ''})}>
                    <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon style={styles.creditIcon} name='search' size={30}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{this.setState({allContacts: !this.state.allContacts})}}>
                    <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center', paddingRight: 15, marginLeft: 10 }}>
                    {selectAllIcon}
                </View>
                </TouchableWithoutFeedback>
            </View>
        }
    }

    render() {
        let menu  = <Menu/>;

        let selectedAllOverlay;
        if(this.state.allContacts){
            selectedAllOverlay = <View style={{ flexDirection: 'row', width: window.width, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 22, color: 'black'}}>{_('You selected all ')} </Text>
                <Text style={{fontSize: 22, color: 'white', backgroundColor: '#4CAF50', paddingLeft: 14, padding: 10, borderRadius: 2, marginRight: 8}}>{this.props.bulkgateRecipients.total} </Text>
                <Text style={{fontSize: 22, color: 'black'}}>{_('contacts')}</Text>
            </View>
        }else{
            selectedAllOverlay = <View/>
        }

        let tabViewAnimated;
        if(!this.state.allContacts){
            tabViewAnimated = <TabViewAnimated
                style={{flex: 1}}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onRequestChangeTab={this._handleChangeTab}
            />
        }

        let button;
        if(this.state.saving){
            button = <TouchableWithoutFeedback>
                <View style={{height: 50, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator
                        style={{height: 30}}
                        size="large"
                    />
                </View>
            </TouchableWithoutFeedback>
        }else{
            button = <TouchableWithoutFeedback onPress={()=>this.handleSave()}>
                <View style={{height: 50, backgroundColor: Color.button, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{_('Save').toUpperCase()}</Text>
                </View>
            </TouchableWithoutFeedback>
        }

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                {this.renderToolbar()}
                {selectedAllOverlay}
                {tabViewAnimated}
                {button}
                <SaveModal
                    visible={this.state.confirmVisible}
                    handleClose={()=>this.setState({confirmVisible: false})}
                    numberOfItemsToDelete={this.state.selectCount}
                    handleOk={()=>this.handleSave()}
                />
            </DrawerLayout>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    b: {
        backgroundColor: Color.primaryColor,
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 20
    },
    h: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    screenName: {
        color: Color.toolbarText,
        marginLeft: 15,
        fontSize: 18
    },
    creditIcon: {
        marginRight: 5,
        color: Color.toolbarText,
    },
    toolbar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.toolbar
    },
    menuIcon: {
        color: Color.toolbarText,
    },
});

module.exports = connect(mapStateToProps)(BulkgateRecipients);