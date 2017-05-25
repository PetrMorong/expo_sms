// @flow
'use strict';

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ART,
    LayoutAnimation,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

const {
    Surface,
    Group,
    Rectangle,
    Shape,
} = ART;

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';
import AnimShape from './AnimShape';
import Theme from './Theme';

const d3 = {
    scale,
    shape,
};

import {
    scaleBand,
    scaleLinear
} from 'd3-scale';

type Props = {
    height: number,
    width: number,
    pieWidth: number,
    pieHeight: number,
    colors: any,
    onItemSelected: any
};

type State = {
    highlightedIndex: number,
};

class Pie extends React.Component {

    state: State;

    constructor(props: Props) {
        super(props);
        this.state = { highlightedIndex: 0 };
        this._createPieChart = this._createPieChart.bind(this);
        this._value = this._value.bind(this);
        this._label = this._label.bind(this);
        this._color = this._color.bind(this);
        this._onPieItemSelected = this._onPieItemSelected.bind(this);
    }

    // methods used to tranform data into piechart:
    // TODO: Expose them as part of the interface
    _value(item, index) {

        let returnValue;
        try{
            returnValue = Math.trunc(item[1])
        }catch(e){
            returnValue =  item[1];
        }

        if(index > 7 ){
            returnValue =  ''
        }

        return returnValue

    }

    _label(item, index) {

        let returnValue;
        try{
            returnValue = this.capitalizeFirstLetter(item[0].substr(0, 14)) + ':'

        }catch (e){
            returnValue = item[0] + ':';
        }

        if(index > 7 ){
            returnValue =  ''
        }

        return returnValue

    }

    _color(index) { return Theme.colors[index]; }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    _createPieChart(index) {

        var arcs = d3.shape.pie()
            .value(this._value)
            (this.props.data);

        var hightlightedArc = d3.shape.arc()
            .outerRadius(this.props.pieWidth/2 + 10)
            .padAngle(.05)
            .innerRadius(30);

        var arc = d3.shape.arc()
            .outerRadius(this.props.pieWidth/2)
            .padAngle(.05)
            .innerRadius(30);

        var arcData = arcs[index];
        var path = (this.state.highlightedIndex == index) ? hightlightedArc(arcData) : arc(arcData);

        return {
            path,
            color: this._color(index),
        };
    }

    _onPieItemSelected(index) {
        this.setState({...this.state, highlightedIndex: index});
        this.props.onItemSelected(index);
    }


    render() {


        const margin = styles.container.margin;
        const x = this.props.pieWidth / 2 + margin;
        const y = this.props.pieHeight / 2 + margin;

        return (
            <View width={this.props.width} height={this.props.height} >
                <Surface width={this.props.width} height={this.props.height} style={{marginTop: 15}}>
                    <Group x={x} y={y}>
                        {
                            this.props.data.map( (item, index) =>
                                (<AnimShape
                                    key={'pie_shape_' + index}
                                    color={this._color(index)}
                                    d={ () => this._createPieChart(index)}
                                />)
                            )
                        }
                    </Group>
                </Surface>
                <View style={{position: 'absolute', top: -20, left: 45 + this.props.pieWidth}}>
                    {
                        this.props.data.map( (item, index) =>
                        {
                            var fontWeight = this.state.highlightedIndex == index ? 'bold' : 'normal';
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => this._onPieItemSelected(index)}>
                                    <View style={{width: 142, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View style={{width: 92}}>
                                            <Text style={[styles.label, {color: this._color(index), fontWeight: fontWeight}]}>{this._label(item, index)} </Text>
                                        </View>
                                        <View style={{width: 45}}>
                                            <Text style={[styles.label, {color: this._color(index), fontWeight: fontWeight}]}>{this._value(item, index)}</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })
                    }
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        margin: 20,
    },
    label: {
        fontSize: 14,
        marginTop: 7,
        fontWeight: 'normal',
    }
};

export default Pie;