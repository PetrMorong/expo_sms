/**
 * Created by Petr on 30.4.2017.
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
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Color from '../../config/Variables';
import GetName from '../../helperFunctions/GetName';

const window = Dimensions.get('window');

export default class Chips extends Component {

    render() {

        let chipsItem = Object.keys(this.props.filter).map((item)=>{

            return this.props.filter[item].map((x)=>{

                return <View style={{paddingLeft: 10, paddingRight: 5, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>{_(item)}:</Text>
                    <Text> <GetName name={x} item={item} identifier="statistics"/> </Text>
                    <TouchableWithoutFeedback onPress={()=> this.props.clearFilter(item, x)}>
                        <View style={{width: 30, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name="cancel" size={25} style={{color: 'lightgrey', marginLeft: 5}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            })
        });

        let clearFilterIcon;
        if(Object.keys(this.props.filter).length !==0){
            clearFilterIcon = <TouchableWithoutFeedback onPress={()=>this.props.clearFilterAll()}>
                <View style={{width: 60, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="close" size={30}/>
                </View>
            </TouchableWithoutFeedback>
        }

        let chips = <View style={{height: 60, alignItems: 'center', flexDirection: 'row'}}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ height: 40, elevation: 1, flexDirection: 'row'}}
                ref={(scroll) => { this.chipsScroll = scroll }}
            >
                <View style={{paddingLeft: 10, paddingRight: 10, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground,  borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>From:</Text>
                    <Text style={{color: Color.chipsText}}> {this.props.from}</Text>
                </View>
                <View style={{paddingLeft: 10, paddingRight: 10, marginLeft: 5, marginRight: 5, height: 40, backgroundColor: Color.chipsBackground, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }}>
                    <Text style={{color: Color.chipsText, fontWeight: '500'}}>To:</Text>
                    <Text style={{color: Color.chipsText}}> {this.props.to}</Text>
                </View>

                {chipsItem}
                {clearFilterIcon}
            </ScrollView>
        </View>;

        return (
            <View>
                {chips}
            </View>
        )
    }

}


