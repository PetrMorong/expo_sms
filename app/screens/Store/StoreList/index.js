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
import ConfirmModal from '../../../components/ConfirmModal';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        storeList: store.storeList
    }
};

export default class StoreList extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            offset: 0,
            selectCount: 0,
            loadingNewPage: true,
            selected: [],
            confirmVisible: false,
            emptyData: false
        }
    }

    componentWillMount(){
        this.initialFetch()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.storeList.data){

            try{
                let array = Object.keys(nextProps.storeList.data.result.list).map((x) => nextProps.storeList.data.result.list[x]);

                if(this.state.offset === 0){
                    this.setState({data: array, emptyData: false})
                }else{
                    let newData = this.state.data.concat(array);
                    this.setState({data: newData, emptyData: false})
                }
            }catch(e){
                this.setState({emptyData: true})
            }
        }

        if(!nextProps.storeList.fetching){
            this.setState({loadingNewPage: false})
        }

    }

    initialFetch(){
        this.props.dispatch(fetch('store/get-store-list', {reducer: 'storeList'}, {limit: 20, offset: 0}))
    }

    onEndReached(){
        if(this.props.storeList.data.result.count > this.state.offset && this.props.storeList.data.result.count > 20){
            this.setState({offset: this.state.offset+20, loadingNewPage: true}, () => {
               this.props.dispatch(fetch('store/get-store-list', {reducer: 'storeList'}, {limit: 20, offset: this.state.offset}))
            })
        }
    }


    onRefresh(){
        this.setState({offset: 0, selectCount: 0}, () => {
            this.props.dispatch(fetch('store/get-store-list', {reducer: 'storeList'}, {limit: 20, offset: this.state.offset}))
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
        this.setState({confirmVisible: false, selected: [], selectCount: 0})
    }

    deleteSelected(){
        this.props.dispatch(deleteListItem('store/remove-stores', {reducer: 'storeList'}, {id: this.state.selected}, ()=>this.onDeleteSuccess()));
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
                title={_('Stores')}
                elevation={2}/>
        }

        let emptyData;
        if(this.state.emptyData){
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
                    {emptyData}
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
                            if(item.profile_photo){
                                image = <Image style={styles.itemImage} resizeMode='stretch' source={{ uri: 'http://10.0.0.19/bulkgate/deal/store/' + item.id + '?store_id=' + item.id + '&name=profile_photo&timestamp=' + Date.now() + '&do=renderImageStore'}}/>
                            }else{
                                image = <View style={{width: 45, height: 45, borderRadius: 100, marginRight: 15, backgroundColor: Color.button, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon name="image"  style={{color: 'black'}} size={25}/>
                                </View>
                            }

                            let itemRow;
                            if(this.state.selected.indexOf(item.id) !== -1){
                                itemRow = <TouchableWithoutFeedback key={item.id}  onLongPress={(event) => this.select(item.id)}>
                                    <View>
                                        <View style={styles.h} >
                                            <View style={styles.g}>
                                                <Icon name="done" style={{color: 'white'}} size={20}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.c}>{item.name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.separator}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            }else{
                                itemRow = <TouchableWithoutFeedback
                                            onPress={(event)=> Actions.StoreSettings({id: item.id})}
                                            key={item.id}
                                            onLongPress={(event) => this.select(item.id)}>
                                            <View>
                                                <View style={styles.itemWrap}>
                                                    <View>
                                                        {image}
                                                    </View>
                                                    <View style={{flexDirection: 'row', flex: 1}}>
                                                        <Text style={styles.itemText}>{item.name}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.separator}/>
                                            </View>
                                    </TouchableWithoutFeedback>
                            }

                            return itemRow
                        }}
                    />
                    <TouchableOpacity onPress={() => Actions.StoreCreate()}>
                        <View style={styles.bottomButton} elevation={3}>
                            <Icon name="add" style={{color: 'white'}} size={30}/>
                        </View>
                    </TouchableOpacity>
                    <ConfirmModal
                        visible={this.state.confirmVisible}
                        handleClose={()=>this.setState({confirmVisible: false})}
                        numberOfItemsToDelete={this.state.selectCount}
                        handleOk={()=>this.deleteSelected()}
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
    toolbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B8B8B',
        height: 60,
        padding: 15,
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
        marginRight: 15,
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
    g: {
        backgroundColor: '#8B8B8B',
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 15
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

});

module.exports = connect(mapStateToProps)(StoreList);