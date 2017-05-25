import Expo from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import store from './app/Store';
import Root from './app/Root';

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
              <Root/>
            </Provider>
        );
    }
}


Expo.registerRootComponent(App);
