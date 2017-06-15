/**
 * Created by Petr on 7.5.2017.
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
import { MaterialIcons as Icon }from '@expo/vector-icons';
import Contacts from 'react-native-contacts';
import Toolbar from '../../../../../components/Toolbar';
import Menu from '../../../../../components/Menu';
import { connect } from 'react-redux';
import { save, fetch, deleteListItem } from '../../../../../actions/index';
import FlatList from 'react-native/Libraries/Lists/FlatList';
import Color from '../../../../../config/Variables';
import Checkbox from '../../../../../components/CheckBox';
import SaveModal from '../../../../../components/SaveModal'
import { Actions } from 'react-native-router-flux';
import DrawerLayout from 'react-native-drawer-layout';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        campaign: store.campaign
    }
}

export default class PhoneRecipientsAdd extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            data: [],
            originalData: [],
            selected: [],
            searching: false,
            selectedAll: false,
            confirmVisible: false,
            searchText: ''
        }
    }

    componentWillMount(){
        Contacts.getAll((err, contacts) => {
            if(err && err.type === 'permissionDenied'){
                console.log(err)
            } else {
                this.setState({loading: false, data: contacts, originalData: contacts})
            }
        })
    }

    selectContact(item){
        let selected = this.state.selected;

        if(this.state.selected.indexOf(item) !== -1){

            selected = this.state.selected.filter((x)=>{
                return x == item ?  false : true
            });

        }else{
            selected.push(item)
        }

        this.setState({selected})
    }

    selectAll(){

        if(this.state.selectedAll){
            this.setState({selected: [], selectedAll: false})
        } else {
            this.setState({selected: this.state.data, selectedAll: true})
        }

    }

    handleSearch(searchText){
         let newArray = this.state.originalData.filter((item)=>{
             return  item.givenName.indexOf(searchText) !== -1 ? true : false
         })

        this.setState({data: newArray, searchText})
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
                    onChangeText={(searchText) => this.handleSearch(searchText)}
                    value={this.state.searchText}
                    keyboardType="web-search"
                    style={{flex: 1, fontSize: 18, height: 50, marginLeft: 10, marginRight: 10, color: 'white'}}
                    placeholder="Search"
                    placeholderTextColor="white"
                    selectionColor="white"
                    autoFocus={true}
                />
            </View>
        }else{
            let selectCount;
            if(this.state.allContacts){
                selectCount = this.props.bulkgateRecipients.total
            }else{
                selectCount = this.state.selected.length;
            }

            let selectAllIcon;
            if(this.state.selectedAll){
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
                <TouchableWithoutFeedback onPress={()=>this.selectAll()}>
                    <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center', paddingRight: 15, marginLeft: 10 }}>
                        {selectAllIcon}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        }
    }

    renderView(){
        if(this.state.loading){
            return <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center', }}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }else{
            return <FlatList
                ref={(flatlist) => {this.flatlist = flatlist}}
                style={{flex: 1}}
                data={this.state.data}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => {

                    let background = this.state.selected.indexOf(item) !== -1 ? ['#D8D8D8', true] : ['white', false];

                    return <TouchableWithoutFeedback key={item.id}  onPress={(event) => this.selectContact(item)} >
                                <View>
                                    <View style={[styles.h, {backgroundColor: background[0]}]} >
                                        <View style={styles.b}>
                                           <Icon name="person" style={{color: 'white'}} size={25}/>
                                       </View>
                                        <View style={{flex: 1, marginLeft: -5, flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                                            <View style={{flex: 1, flexDirection: 'row'}}>
                                                <Text style={{fontSize: 16}}>{item.givenName} </Text>
                                            </View>
                                            <Checkbox onCheck={()=>this.selectContact(item)} checked={background[1]}/>
                                        </View>
                                    </View>
                                    <View style={styles.separator}/>
                                </View>
                            </TouchableWithoutFeedback>
                    }}
            />
        }
    }

    handleBack(){
        if(this.state.selected.length> 0){
            this.setState({confirmVisible: true})
        }else{
            Actions.pop()
        }
    }

    handleSave(){

        let newArray = this.state.selected.map((item)=>{
            return {
                first_name: item.givenName,
                phone_mobile: item.phoneNumbers[0].number
            }
        })

        this.setState({saving: true}, ()=>{
            this.props.dispatch(
                save(
                    'campaign/insert-recipients',
                    {reducer: 'campaign'},
                    {campaign_id: this.props.campaign.data.result.campaign.id , data: newArray, name: 'phone', prefix: 'phone'},
                    ()=>setTimeout(()=>{ this.onSuccessSave() }, 10)
                )
            )
        })


    }

    onSuccessSave(){
        this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.campaign.data.result.campaign.id}, ()=>Actions.PhoneRecipientsIndex()))
    }

    render() {
        let menu  = <Menu/>;

        let searched;
        if(this.state.searchText !== ''){
            searched = <View style={{backgroundColor: '#EEEEEE', height: 40, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#969696', fontSize: 16}}>{_('Results')}: {this.state.data.length}</Text>
                <TouchableOpacity onPress={()=>{this.setState({data: this.state.originalData, searchText: '', searching: false})}}>
                    <View style={{flexDirection: 'row',}}>
                        <Icon name="close" size={25} style={{color: '#969696', marginRight: 6}}/>
                        <Text style={{color: '#969696', fontSize: 16}}>{_('Clear search')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        }

        let button;
        if(this.state.selected.length > 0 || this.state.allContacts){
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
        }else{
            button = <View/>
        }

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                {this.renderToolbar()}
                {searched}
                {this.renderView()}
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
        backgroundColor: 'white'
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

module.exports = connect(mapStateToProps)(PhoneRecipientsAdd);
