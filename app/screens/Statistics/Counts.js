/**
 * Created by Petr on 17.2.2017.
 */
import React, { Component } from 'react';
import { StyleSheet, Modal,  Button,  Text, Picker, View, Image, Switch,  Dimensions, TextInput, TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView, ART, LayoutAnimation} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import { connect } from 'react-redux';

import Pie from './Pie';

import Chips from './Chips';
import Theme from './Theme';

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        statistics: store.statistics
    }
}

export default class Counts extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,

        };
        this._onPieItemSelected = this._onPieItemSelected.bind(this);
        this._shuffle = this._shuffle.bind(this);
    }

    _onPieItemSelected(newIndex){
        this.setState({...this.state, activeIndex: newIndex});
    }

    _shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
        return a;
    }



    render() {

        let charts;
        if(this.props.statistics.data && this.props.statistics.emptyData !== true){
            charts = <View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Delivery status')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.status.count} />
                    </View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Country')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.country.count} />
                    </View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Operator')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.operator.count} />
                    </View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Sender Id')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.senderId.count} />
                    </View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Service')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.service.count} />
                    </View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Extensions')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.extensions.count} />
                    </View>
                    <View style={styles.card}>
                        <Text style={{color: 'black', fontSize: 22, paddingTop: 15, paddingLeft: 15}}>{_('Route')}</Text>
                        <Pie
                            pieWidth={140}
                            pieHeight={140}
                            onItemSelected={this._onPieItemSelected}
                            colors={Theme.colors}
                            width={window.width - 20}
                            height={530}
                            data={this.props.statistics.data.result.route.count} />
                    </View>
                </View>
        }

        return (
            <ScrollView>
                <View style={styles.container} >
                    <Chips
                        clearFilterAll={()=>this.props.clearFilterAll()}
                        clearFilter={(item,x)=>this.props.clearFilter(item, x)}
                        from={this.props.from}
                        filter={this.props.filter}
                        to={this.props.to}/>
                    {charts}
                </View>
            </ScrollView>
        );
    }
}

const styles = {
    container: {
        backgroundColor: '#E2E2E2'
    },
    chart_title : {
        paddingTop: 15,
        textAlign: 'center',
        paddingBottom: 5,
        paddingLeft: 5,
        fontSize: 18,
        color: 'grey',
        fontWeight:'bold',
    },
    card: {
        margin: 10,
        marginBottom: 0,
        backgroundColor: 'white',
        borderRadius: 3,
        height: 250,
        elevation: 2
    }
}

module.exports = connect(mapStateToProps)(Counts);
