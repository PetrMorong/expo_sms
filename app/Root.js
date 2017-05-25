import React, {Component} from 'react';
import { connect } from 'react-redux';
import AppNavigator from './navigation/AppNavigator'
import { getTranslations } from './actions/index'
import { AsyncStorage } from 'react-native';
import Translator from './Translator';

const translatorInstance = new Translator;

window._ = function (key,defaultLabel) {
    return translatorInstance.translate(key, defaultLabel);
};

window.numberToBool= function (arg) {
  return  !!+arg;
};


export default class Root extends Component {
    constructor(props)
    {
        super(props);

        AsyncStorage.getItem('translations', (err, result) => {
            if(!result){
                this.props.dispatch(getTranslations());
                return;
            }
            translatorInstance.setTranslates(JSON.parse(result));
        });
    }


    componentWillReceiveProps(nextProps)
    {
        translatorInstance.setTranslates(nextProps.translations);
    }

    render() {
        return (
           <AppNavigator  initialRoute={{ident: "Sign"}}/>
        )
    }

}

module.exports = connect()(Root);