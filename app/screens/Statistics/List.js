/**
 * Created by Petr on 1.5.2017.
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
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { connect } from 'react-redux';
import Chips from './Chips';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        statistics: store.statistics,
        user: store.user
    }
}

export default class List extends Component {

    formatCredit(credit){

        if(credit > 1){
            return credit.toFixed(2)
        }else{
            return credit.toFixed(4)
        }
    }

    render() {

        let view;
        if(this.props.statistics.data && this.props.statistics.emptyData !== true){

            let list = this.props.statistics.data.result.list;

             view = Object.keys(list).map( (item, index) =>{
                return <View key={index} style={styles.itemRow}>
                    <View style={{width: 140, flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={{width: 40, height: 40}}
                            source={{uri: 'https://www.bulkgate.com/images/flags/32/'+item+'.png'}}/>
                        <Text style={{color: 'black', fontSize: 16, marginLeft: 10}}>{this.props.user.user.countries[item]}</Text>
                    </View>
                    <View style={{flex: 1, marginLeft: 35, flexDirection: 'row'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '500'}}>{list[item][list[item].length-1][1]} </Text>
                        <Text style={{color: 'black', fontSize: 16}}>sms</Text>
                    </View>
                    <View style={{width: 60, flexDirection: 'row'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '500'}}>{this.formatCredit(list[item][list[item].length-1][2])} </Text>
                        <Text style={{color: 'black', fontSize: 16}}> kr</Text>
                    </View>
                </View>
            })
        }

        return (
            <ScrollView>
                <View style={styles.container}>
                    <Chips
                        clearFilterAll={()=>this.props.clearFilterAll()}
                        clearFilter={(item,x)=>this.props.clearFilter(item, x)}
                        from={this.props.from}
                        filter={this.props.filter}
                        to={this.props.to}/>
                    {view}
                </View>
        </ScrollView>

        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemRow: {
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        padding: 15,
        alignItems: 'center'
    }
});

module.exports = connect(mapStateToProps)(List);
