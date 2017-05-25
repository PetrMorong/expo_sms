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
import Menu from '../../components/Menu';
import Toolbar from '../../components/Toolbar';
import Color from '../../config/Variables';
import { connect } from 'react-redux';
import { save, fetch, deleteListItem } from '../../actions/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import GetProduct from '../../helperFunctions/GetProduct';
import GetName from '../../helperFunctions/GetName';
import moment from 'moment';
import FilterModal from '../../components/FilterModal';
import { AsyncStorage } from 'react-native';
import ConfirmModal from '../../components/ConfirmModal';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        blacklist: store.blacklist
    }
}

export default class Blacklist extends Component{
    constructor(props){
        super(props)
        this.state = {
            refreshing: false,
            offset: 0,
            loadingNewPage: true,
            loadingFiltered: false,
            showFilter: false,
            filter: {},
            emptyData: false,
            selected: [],
            selectCount: 0,
            confirmVisible: false,
            visibleModalAddNumber: false,
            addPhoneNumber: '',
            deleting: false
        }
    }

    componentWillMount(){
        AsyncStorage.getItem('filterBlacklist', (err, filter) => {

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

        this.props.dispatch(fetch('blacklist/get-blacklist', {reducer: 'blacklist', newData}, {limit: 15, offset: this.state.offset, filter: this.state.filter}))

        if(newData){
            this.flatlist.scrollToOffset({x: 0, y: 0})
        }
    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.blacklist.fetching){
            this.setState({loadingNewPage: false, loadingFiltered: false})
        }

        if(nextProps.blacklist.saved){
            this.setState({visibleModalAddNumber: false, addPhoneNumber: '', loadingFiltered: true })

            this.fetchData(true)
        }

    }

    onEndReached(){
        if(this.props.blacklist.data.result.list.total > this.state.offset && this.props.blacklist.data.result.list.total > 15){
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
            AsyncStorage.setItem('filterBlacklist', JSON.stringify(filter))
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
            AsyncStorage.removeItem('filterBlacklist')
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
            AsyncStorage.setItem('filterBlacklist', JSON.stringify(filter))
        })

    }

    cancelSelection(){
        this.setState({selected: [], selectCount: 0})
    }

    select(key){
        let selected = [...this.state.selected];

        let selectCount = this.state.selectCount;
        if(selected.indexOf(key) === -1){
            selected.push(key);
            selectCount++;
        }else{
            selected.splice( selected.indexOf(key), 1 );
            selectCount--;
        }

        this.setState({selected, selectCount});
    }


    onDeleteSuccess(){
        this.setState({confirmVisible: false, selected: [], selectCount: 0, deleting: false})
    }

    onDeleteError(){
        this.setState({confirmVisible: false, selected: [], selectCount: 0, deleting: false})
    }

    deleteSelected(){
        this.setState({deleting: true}, ()=>{
            this.props.dispatch(deleteListItem('blacklist/remove-number', {reducer: 'blacklist'}, {number: this.state.selected}, ()=>this.onDeleteSuccess(), ()=>this.onDeleteError() ));
        })
    }

    handleAddNumber(){
        this.props.dispatch(save('blacklist/save-blacklist-phone', {reducer: 'blacklist'}, {number: this.state.addPhoneNumber}))
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
                <TouchableWithoutFeedback onPress={()=>this.setState({confirmVisible: true})}>
                    <View style={{width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon style={{color: 'white'}} name="delete" size={30}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        }else{
            toolbar = <Toolbar
                openMenu={() => this.drawer.openDrawer()}
                background="container"
                title={_('Blacklist')}
                filter={true}
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
        if(this.props.blacklist.emptyData){
            emptyData = <View style={{height: window.height-60, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="filter-list" size={80} style={{marginBottom: 30}}/>
                <Text style={{fontSize: 25, textAlign: 'center'}}>{_('Selection did not match any records')}</Text>
            </View>
        }

        let chipsItem = Object.keys(this.state.filter).map((item)=>{

            return this.state.filter[item].map((x)=>{

                return <View style={{paddingLeft: 10, paddingRight: 5, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>{_(item)}:</Text>
                    <Text> <GetName name={x} item={item} identifier="blacklist"/> </Text>
                    <TouchableWithoutFeedback onPress={()=> this.clearFilter(item, x)}>
                        <View style={{width: 30, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name="cancel" size={25} style={{color: 'lightgrey', marginLeft: 5}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            })
        });

        let clearFilterIcon;
        if(Object.keys(this.state.filter).length !==0){
            clearFilterIcon = <TouchableWithoutFeedback onPress={()=>this.clearFilterAll()}>
                <View style={{width: 60, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="close" size={30}/>
                </View>
            </TouchableWithoutFeedback>
        }

        let chips
        if(Object.keys(this.state.filter).length !==0){
            chips = <View style={{height: 60, alignItems: 'center', flexDirection: 'row'}}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ height: 40, elevation: 1, flexDirection: 'row'}}
                    ref={(scroll) => { this.chipsScrollBlacklist = scroll }}>
                    {chipsItem}
                </ScrollView>
            </View>
        };


        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                {toolbar}
                {chips}
                <View style={styles.container}>
                    {loader}
                    {emptyData}
                    <FlatList
                        ref={(flatlist) => {this.flatlist = flatlist}}
                        style={{flex: 1}}
                        data={this.props.blacklist.list}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0.2}
                        keyExtractor={(item, index) => index}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({item}) => {

                            let itemRow;
                            if(this.state.selected.indexOf(item.id) !== -1){
                                itemRow = <TouchableWithoutFeedback key={item.id}  onLongPress={(event) => this.select(item.id)}>
                                    <View>
                                        <View style={styles.h} >
                                            <GetProduct product={item.product}/>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.itemText}>+ {item.number}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.separator}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            }else{
                                itemRow = <TouchableWithoutFeedback onLongPress={(event) => this.select(item.id)} key={item.id}>
                                            <View>
                                                <View style={styles.itemWrap}>
                                                    <GetProduct product={item.product}/>
                                                    <View style={{flex: 1}}>
                                                        <Text style={styles.itemText}>+ {item.number}</Text>
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
                <FilterModal visible={this.state.showFilter}
                             time={false}
                             handleClose={()=>this.setState({showFilter: false})}
                             handleSaveFilter={(data)=>this.handleSaveFilter(data)}
                             identifier="blacklist"
                             itemsToFilter={[
                                 'Select value',
                                 'number'
                             ]}
                />

                <TouchableOpacity onPress={()=>this.setState({visibleModalAddNumber: true})}>
                    <View style={styles.bottomButton} elevation={3}>
                        <Icon name="add" style={{color: 'white'}} size={30}/>
                    </View>
                </TouchableOpacity>

                <ConfirmModal
                    visible={this.state.confirmVisible}
                    handleClose={()=>this.setState({confirmVisible: false})}
                    numberOfItemsToDelete={this.state.selectCount}
                    handleOk={()=>this.deleteSelected()}
                    deleting={this.state.deleting}
                />

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.visibleModalAddNumber}
                    onRequestClose={() => this.setState({visibleModalAddNumber: false})}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={()=>this.setState({visibleModalAddNumber: false})} >
                            <View style={styles.touchableClose} />
                        </TouchableWithoutFeedback>
                        <View style={styles.modalSmallContainer}>
                            <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginBottom: 20}}>{_('Add number to blacklist')}</Text>
                            <TextInput
                                placeholder={_('Phone number')}
                                onChangeText={(addPhoneNumber) => this.setState({addPhoneNumber})}
                                value={this.state.addPhoneNumber}
                                keyboardType='numeric'/>
                            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>

                                <View style={{ flexDirection: 'row',  alignItems: 'flex-end', justifyContent: 'flex-end', }}>
                                    <TouchableOpacity onPress={()=>this.setState({visibleModalAddNumber: false})}>
                                        <View style={{padding: 10, paddingBottom: 0}}>
                                            <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                                {_('Cancel').toUpperCase()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>this.handleAddNumber()}>
                                        <View style={{padding: 10, paddingBottom: 0}}>
                                            <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                                {_('Add').toUpperCase()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    h: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#D8D8D8'
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

module.exports = connect(mapStateToProps)(Blacklist);