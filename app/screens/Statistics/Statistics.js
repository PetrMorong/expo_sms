/**
 * Created by Petr on 17.2.2017.
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
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import { AsyncStorage } from 'react-native';
import FilterModal from '../../components/FilterModal';
import { save, fetch } from '../../actions/index';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

import Counts from './Counts';
import Costs from './Costs';
import ListStats from './List';

const mapStateToProps = (store) => {
    return{
        statistics: store.statistics
    }
}


export default class Statistics extends Component{
    constructor(props){
        super(props)
        this.state = {
            index: 0,
            routes: [
                { key: '1', title: _('Counts') },
                { key: '2', title: _('Costs') },
                { key: '3', title: _('List') },
            ],
            showFilter: false,
            loading: true,
            from: moment(moment().subtract(30, 'days').calendar()).format('YYYY[-]MM[-]DD'),
            to: moment().format('YYYY[-]MM[-]DD'),
            filter: {},
            emptyData: false
        }
    }

    componentWillMount(){
        AsyncStorage.getItem('filterStatistics', (err, filter) => {

            if(filter){
                this.setState({ filter: JSON.parse(filter) }, ()=>{
                    this.fetchData(true)
                })
            }

            if(err || filter === null){
                this.fetchData(true)
            }

        });

    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.statistics.fetching){
            this.setState({ loading: false})
        }

    }

    fetchData(newData){

        this.props.dispatch(fetch('statistics/get-statistics', {reducer: 'statistics', newData}, {from: this.state.from, to: this.state.to, filter: this.state.filter}))

    }


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
                return <Counts  clearFilterAll={()=>this.clearFilterAll()}
                               clearFilter={(item,x)=>this.clearFilter(item, x)}
                               from={this.state.from}
                               filter={this.state.filter}
                               to={this.state.to}/>;
            case '2':
                return <Costs  clearFilterAll={()=>this.clearFilterAll()}
                                clearFilter={(item,x)=>this.clearFilter(item, x)}
                                from={this.state.from}
                                filter={this.state.filter}
                                to={this.state.to}/>;
            case '3':
                return <ListStats clearFilterAll={()=>this.clearFilterAll()}
                             clearFilter={(item,x)=>this.clearFilter(item, x)}
                             from={this.state.from}
                             filter={this.state.filter}
                             to={this.state.to}/>;
            default:
                return null;
        }
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


        this.setState({offset: 0, showFilter: false, loading: true, from: data.from, to: data.to, filter: filter}, () => {
            this.fetchData(true);
            AsyncStorage.setItem('filterStatistics', JSON.stringify(filter))
        })

    }

    clearFilterAll(){
        this.setState({
            offset: 0,
            showFilter: false,
            loading: true,
            filter: {},
            from: moment(moment().subtract(30, 'days').calendar()).format('YYYY[-]MM[-]DD'),
            to: moment().format('YYYY[-]MM[-]DD')
        }, () => {
            this.fetchData(true);
            AsyncStorage.removeItem('filterStatistics')
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

        this.setState({offset: 0, showFilter: false, loading: true, data: [], filter: filter}, () => {
            this.fetchData(true);
            AsyncStorage.setItem('filterStatistics', JSON.stringify(filter))
        })

    }


    render() {

        let loader;
        if(this.state.loading){
            loader = <View style={{ backgroundColor: 'white', height: window.height-10, width: window.width, justifyContent: 'center', alignItems: 'center', marginTop: -50}}>
                <ActivityIndicator
                    style={{height: 100}}
                    size="large"
                />
                <Text style={{fontSize: 20, textAlign: 'center'}}>{_('Loading statistics may take a while')}</Text>
            </View>
        }

        let emptyData;
        if(this.props.statistics.emptyData){
            emptyData = <View style={{height: window.height-60, width: window.width, justifyContent: 'center', alignItems: 'center'}}>
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
                    title={_('Statistics')}
                    elevation={0}
                    filter={true}
                    handleFilterIconClick={()=> this.setState({showFilter: true})}/>

                <View style={styles.container}>
                    {loader}
                    {emptyData}
                    <TabViewAnimated
                        style={{flex: 1}}
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderHeader={this._renderHeader}
                        onRequestChangeTab={this._handleChangeTab}
                    />

                </View>
                <FilterModal visible={this.state.showFilter}
                             time={true}
                             handleClose={()=>this.setState({showFilter: false})}
                             handleSaveFilter={(data)=>this.handleSaveFilter(data)}
                             identifier="history"
                             itemsToFilter={[
                                 'Select value',
                                 'recipient',
                                 'type',
                                 'status'
                             ]}
                />
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
   container: {
       backgroundColor: 'white',
       flex: 1
   }
});

module.exports = connect(mapStateToProps)(Statistics);
