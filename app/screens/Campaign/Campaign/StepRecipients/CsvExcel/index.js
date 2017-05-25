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

export default class CsvExcel extends Component {
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
            this.setState({selected: this.props.campaign.csv_excel_list, selectedAll: true})
        }

    }

    render() {
        let excelCount  = this.props.campaign.data.result.recipientsCount;

        let count;
        if(excelCount.csv_excel > 0){
            count = <Text style={styles.count}>{excelCount.csv_excel}</Text>
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
        if(excelCount.csv_excel > 0){
            selectAll = <TouchableWithoutFeedback onPress={()=>this.selectAll()}>
                <View style={{width: 50, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>
                    {selectAllIcon}
                </View>
            </TouchableWithoutFeedback>
        }

        let emptyData;
        if(excelCount.csv_excel == 0){
            emptyData = <View style={{height: window.height-100, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="grid-on" size={80} style={{marginBottom: 30}}/>
                <Text style={{fontSize: 25, textAlign: 'center'}}>{_('For importing contacts from Csv/Excel visit web application')}</Text>
            </View>
        }

        let menu  = <Menu/>;

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
                                    <Text style={styles.screenName}>{_('Csv/excel') }</Text>
                                    {count}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {deleteIcon}
                    {selectAll}

                </View>
                <View style={styles.container}>
                    {emptyData}
                    <FlatList
                        ref={(flatlist) => {this.flatlist = flatlist}}
                        style={{flex: 1}}
                        data={this.props.campaign.csv_excel_list}
                        keyExtractor={(item, index) => index}
                        renderItem={({item, index}) => {

                    let background = this.state.selected.indexOf(item) !== -1 ? ['#D8D8D8', true] : ['white', false];

                    return <TouchableWithoutFeedback onPress={(event) => this.selectContact(item)} >
                            <View>
                                <View style={[styles.h, {backgroundColor: background[0]}]} >
                                    <View style={{flex: 1, marginLeft: -5, flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                                        <Text style={{fontSize: 16}}>{item.name}</Text>

                                        </View>
                                        <Text style={styles.count}>{item.count}</Text>
                                        <Checkbox onCheck={()=>this.selectContact(item)} checked={background[1]}/>
                                    </View>
                                </View>
                                <View style={styles.separator}/>
                            </View>
                        </TouchableWithoutFeedback>
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
    toolbar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.toolbar
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
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
});

module.exports = connect(mapStateToProps)(CsvExcel);
