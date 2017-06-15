/**
 * Created by Petr on 27.4.2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Modal,
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
import Menu from '../../../components/Menu';
import Toolbar from '../../../components/Toolbar';
import { MaterialIcons as Icon }from '@expo/vector-icons';
import GetProduct from '../../../helperFunctions/GetProduct';
import GetMethod from '../../../helperFunctions/GetMethod';
import Color from '../../../config/Variables';
import Button from '../../../components/Button';
import { save, fetch } from '../../../actions/index';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-drawer-layout';


const window = Dimensions.get('window');

export default class InvoiceDetail extends Component {

    handleSave(){
        this.props.dispatch(save('payments/download-invoices', {reducer: 'invoices'}, { invoice_id: this.props.year  + this.props.invoice_id, code: this.props.code, username: this.props.username}))
    }

    render() {

        let menu  = <Menu/>;
        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="containerNoBg"
                    back={true}
                    title={_('Invoice') + ' ' + this.props.invoice_id}
                    handleFilterIconClick={()=> this.setState({showFilter: true})}
                    elevation={0}/>
                <View style={styles.container}>
                    <View style={{height: 200, backgroundColor: Color.secondaryColor, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={require('../../../images/white-label/sunsms/invoices.png')} style={{height: 165, width: 135}} resizeMode='stretch' />
                    </View>

                    <View style={{alignItems: 'center', marginTop: 15}}>
                        <View style={{padding: 15, width: 300}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                <Text style={{fontSize: 16}}>{_('Product')}</Text>
                                <View style={{marginRight: -20}}>
                                    <GetProduct  product={this.props.product}/>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13}}>
                                <Text style={{fontSize: 16}}>{_('Method')}</Text>
                                <GetMethod method={this.props.method}/>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13}}>
                                <Text style={{fontSize: 16}}>{_('Date')}</Text>
                                <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>{this.props.date}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13}}>
                                <Text style={{fontSize: 16}}>{_('Invoice no.')}</Text>
                                <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>{this.props.invoice_id}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13}}>
                                <Text style={{fontSize: 16}}>{_('Price')}</Text>
                                <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>{this.props.price} {this.props.currency}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13}}>
                                <Text style={{fontSize: 16}}>{_('Credit')}</Text>
                                <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>{this.props.credit}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{margin: 15, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button
                            click={() => this.handleSave()}
                            text={_('Download PDF').toUpperCase()}
                            buttonStatus='default'
                        />
                    </View>
                </View>
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});

module.exports = connect()(InvoiceDetail);