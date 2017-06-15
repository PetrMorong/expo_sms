/**
 * Created by Petr on 16.5.2017.
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
import Menu from '../../../../../components/Menu';
import Toolbar from '../../../../../components/Toolbar';
import Color from '../../../../../config/Variables';
import { connect } from 'react-redux';
import { save,fetch } from '../../../../../actions/index';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import FlatList from 'react-native/Libraries/Lists/FlatList';


const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        templateList: store.templateList
    }
}

export default class TemplateList extends Component {
    constructor(props){
        super(props)
        this.state = {
            modalVisible: false,
            deleting: false
        }
    }

    componentWillMount(){
        this.fetchData()
    }

    fetchData(){
        this.props.dispatch(fetch('campaign/get-templates-list', {reducer: 'templateList'}))
    }

    delete(){
        this.setState({deleting: true}, ()=>{
            this.props.dispatch(save('campaign/delete-template', {reducer: 'templateList'}, {id: this.state.idToDelete}, ()=>setTimeout(()=>this.deleteSuccess(),10)))
        })
    }

    deleteSuccess(){
        this.setState({deleting: false, idToDelete: null, modalVisible: false}, ()=>{
            this.fetchData()
        })
    }

    getTemplate(item){
        this.props.dispatch(save('campaign/get-template', {reducer: 'templateList'}, {id: item.id, campaign_id: this.props.campaign_id}, ()=>setTimeout(()=>this.deleteSuccess(),10)))
        this.props.dispatch({type: 'LOAD_TEMPLATE', payload: item.template, meta: {reducer: 'templateList'}})
        Actions.pop()
    }

    render() {
        let menu  = <Menu/>;

        let view;
        if(this.props.templateList.fetching){
            view = <ActivityIndicator size="large" style={{height: 150}}/>
        }else{
            view = <FlatList
                ref={(flatlist) => {this.flatlist = flatlist}}
                style={{flex: 1}}
                data={this.props.templateList.data.result}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => {
                    return <TouchableWithoutFeedback key={item.id}  onPress={(event) => this.getTemplate(item)} >
                                <View>
                                    <View style={[styles.h]} >
                                        <View style={{flex: 1, marginLeft: -5, flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={{color: '#404040', fontSize: 16, fontWeight: '500', paddingLeft: 10}}>{item.name} </Text>
                                                <Text style={{fontSize: 17, paddingLeft: 10}}>{item.template.substr(0, 80)} </Text>
                                            </View>
                                            <TouchableOpacity onPress={()=>this.setState({modalVisible: true, idToDelete: item.id})}>
                                                <View style={{padding: 15}}>
                                                    <Icon name="delete" size={30} style={{color: '#404040'}}/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.separator}/>
                                </View>
                            </TouchableWithoutFeedback>
                    }}
            />
        }

        let modalView;
        if(this.state.deleting){
            modalView = <ActivityIndicator
                style={{height: 150}}
                size="large"
            />
        }else{
            modalView = <View style={{ width: window.width/5 * 4 - 25}}>
                <View style={styles.textWrap}>
                    <Text style={styles.text}>{_('Delete template')} ?</Text>
                </View>
                <View >
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={()=>this.setState({modalVisible: false})}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500', marginRight: 10}}>
                                    {_('Cancel').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.delete()}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#2196F3', fontSize: 17, fontWeight: '500'}}>
                                    {_('Delete').toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }

        return (
            <View style={styles.container}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={_('Templates')}
                    elevation={2}
                    back={true}/>

                {view}

                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({modalVisible: false})}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible: false})} >
                            <View style={styles.touchableClose} />
                        </TouchableWithoutFeedback>
                        <View style={styles.modalSmallContainer}>
                            {modalView}
                        </View>
                    </View>
                </Modal>
            </View>
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
        width: window.width/5 * 4,
        height: 130,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    touchableClose: {
        width: window.width,
        height: window.height,
        position: 'absolute',
        top: 0
    },
    text: {
        color: 'black',
        fontSize: 19,

    },
    textWrap: {
        height: 70,
        padding: 15
    }
});

module.exports = connect(mapStateToProps)(TemplateList);