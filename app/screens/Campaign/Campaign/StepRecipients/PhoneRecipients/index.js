/**
 * Created by Petr on 10.5.2017.
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
import Icon from 'react-native-vector-icons/MaterialIcons';
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

export default class PhoneRecipientsIndex extends Component {
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

    selectContact(item){
        let selected = this.state.selected;

        if(this.state.selected.indexOf(item) !== -1){

            selected = this.state.selected.filter((x)=>{
                return x == item ?  false : true
            });

            this.setState({selected, selectedAll: false})
        }else{
            selected.push(item)
            this.setState({selected})
        }
    }

    selectAll(){

        if(this.state.selectedAll){
            this.setState({selected: [], selectedAll: false})
        } else {
            this.setState({selected: this.props.campaign.data.result.recipientsCount.phone_limit, selectedAll: true})
        }

    }

    render() {

        let menu  = <Menu/>;

        let count;
        if(this.props.campaign.data.result.recipientsCount.phone > 0){
            count = <Text style={styles.count}>{this.props.campaign.data.result.recipientsCount.phone}</Text>
        }

        let deleteIcon;
        if(this.state.selected.length > 0){
            deleteIcon = <TouchableWithoutFeedback onPress={()=>this.setState({searching: true, searchText: ''})}>
                <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon style={styles.creditIcon} name='delete' size={30}/>
                </View>
            </TouchableWithoutFeedback>
        }

        let selectAllIcon;
        if(this.state.selectedAll){
            selectAllIcon = <Icon style={styles.creditIcon} name='close' size={30}/>
        }else{
            selectAllIcon = <Icon style={styles.creditIcon} name='select-all' size={30}/>
        }

        let selectAll;
        if(this.props.campaign.data.result.recipientsCount.phone > 0){
            selectAll = <TouchableWithoutFeedback onPress={()=>this.selectAll()}>
                <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>
                    {selectAllIcon}
                </View>
            </TouchableWithoutFeedback>
        }

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <View style={styles.toolbar}>
                    <TouchableWithoutFeedback  onPress={()=>Actions.pop()} >
                        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 25, height: 60, paddingLeft: 15 }}>
                            <View style={{width: 25, height: 60,  borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon style={styles.menuIcon} name="arrow-back" size={30}/>
                            </View>
                            <View style={{height: 60, justifyContent: 'center'}}>
                                <View style={{ width: 180, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.screenName}>{_('Phone recipients') }</Text>
                                    {count}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {deleteIcon}
                    {selectAll}

                </View>
                <FlatList
                    ref={(flatlist) => {this.flatlist = flatlist}}
                    style={{flex: 1}}
                    data={this.props.campaign.data.result.recipientsCount.phone_limit}
                    keyExtractor={(item, index) => index}
                    renderItem={({item}) => {

                    let background = this.state.selected.indexOf(item) !== -1 ? ['#D8D8D8', true] : ['white', false];

                    return <TouchableWithoutFeedback key={item.id}  onPress={(event) => this.selectContact(item)} >
                                <View>
                                    <View style={[styles.h, {backgroundColor: background[0]}]} >
                                        <View style={styles.b}>
                                           <Icon name="person" style={{color: 'white'}} size={25}/>
                                       </View>
                                        <View style={{flex: 1, marginLeft: -5, flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{flex: 1, flexDirection: 'row'}}>
                                                <Text style={{fontSize: 16}}>{item.first_name} </Text>
                                            </View>
                                            <Checkbox onCheck={()=>this.selectContact(item)} checked={background[1]}/>
                                        </View>
                                    </View>
                                    <View style={styles.separator}/>
                                </View>
                            </TouchableWithoutFeedback>
                    }}
                />
                <TouchableWithoutFeedback onPress={()=>Actions.PhoneRecipientsAdd()}>
                    <View style={{height: 50, backgroundColor: Color.button, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{_('Add more').toUpperCase()}</Text>
                    </View>
                </TouchableWithoutFeedback>
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
    toolbar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.toolbar
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
    menuIcon: {
        color: Color.toolbarText,
    },
    count: {
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#4CAF50',
        padding: 7,
        paddingLeft: 10,
        paddingRight: 10,
        color: 'white',
        borderRadius: 2
    }
});

module.exports = connect(mapStateToProps)(PhoneRecipientsIndex);
