/**
 * Created by Petr on 25.1.2017.
 */
import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ElevatedView from 'react-native-elevated-view'
import { connect } from 'react-redux';
import Color from '../config/Variables';
import { Actions } from 'react-native-router-flux';


const mapStateToProps = (store) => {
    return{
        credit: store.user.user.credit
    }
}

export default class Toolbar extends Component {

    renderCredit(){

        if(this.props.credit.currency == 'eur'){
            return parseInt(this.props.credit.credit).toFixed(4) + ' ' + _('Eur').toUpperCase()
        }else if(this.props.credit.currency == 'czk'){
            return _('Czk').toUpperCase() + ' ' + parseInt(this.props.credit.credit).toFixed(2)
        }else{
            return parseInt(this.props.credit.credit).toFixed(2) + ' ' +  _('credits')
        }

    }

    render() {
        let leftIcon;
        if(this.props.back){
            leftIcon = <TouchableWithoutFeedback  onPress={(event) => Actions.pop()} >
                <View style={{width: 35, paddingLeft: 15, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon style={styles.menuIcon} name="arrow-back" size={30}/>
                </View>
            </TouchableWithoutFeedback>;
        }else{
            leftIcon = <TouchableWithoutFeedback   onPress={(event) => this.openMenu()} >
                <View style={{width: 35, paddingLeft: 15, height: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon style={styles.menuIcon} name="menu" size={30}/>
                </View>
            </TouchableWithoutFeedback>;

        }

        let title;
        if(this.props.back){
            title =<View style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={(event) => Actions.pop()}>
                <View style={{width: 180, height: 60, justifyContent: 'center'}}>
                    <Text style={styles.screenName} >{this.props.title}</Text>
                </View>
            </TouchableWithoutFeedback>
            </View>
        }else{
            title = <View style={{flex: 1, height: 60, justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={(event) => this.openMenu()} >
                            <View style={{ width: 180, height: 60, justifyContent: 'center'}}>
                                <Text style={styles.screenName} >{this.props.title}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                </View>
        }

        let right;
        if(this.props.filter){
            right = <TouchableWithoutFeedback onPress={this.props.handleFilterIconClick}>
                <View style={{width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon style={styles.creditIcon} name='filter-list' size={30}/>
                </View>
            </TouchableWithoutFeedback>
        }else{
            right = <TouchableWithoutFeedback  onPress={(event) => Actions.BuyCredit()}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={styles.creditIcon} name='account-balance-wallet' size={22}/>
                        <Text style={styles.creditNumber}> {this.renderCredit()}</Text>
                    </View>
                </TouchableWithoutFeedback>
        }


        return (
            <ElevatedView style={styles[this.props.background]} elevation={this.props.elevation}>
                {leftIcon}
                {title}
                {right}
            </ElevatedView>
        );
    }

    openMenu(){
        this.props.openMenu();
    }

}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
        backgroundColor: Color.toolbar
    },
    containerNoBg: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
        backgroundColor: Color.secondaryColor
    },
    menuIcon: {
        color: Color.toolbarText,
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
    creditNumber: {
        color: Color.toolbarText,
        fontSize: 16
    }

});

module.exports = connect(mapStateToProps)(Toolbar);


