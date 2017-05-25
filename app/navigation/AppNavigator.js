/**
 * Created by Petr on 24.1.2017.
 */
import React, { Component } from 'react';
import { View, Text, BackHandler, BackAndroid } from 'react-native'
import {Scene, Router} from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';


import Dashboard from '../screens/Dashboard/Dashboard';
import DashboardNewUser from '../screens/Dashboard/DashboardNewUser'

import Campaign from '../screens/Campaign/Campaign/index'
import CampaignCreate from '../screens/Campaign/CampaignCreate/index'
import CampaignRecipients from '../screens/Campaign/Campaign/StepRecipients/index'
import PhoneRecipientsAdd from '../screens/Campaign/Campaign/StepRecipients/PhoneRecipients/add'
import CsvExcel from '../screens/Campaign/Campaign/StepRecipients/CsvExcel/index'
import Vcard from '../screens/Campaign/Campaign/StepRecipients/Vcard/index'
import PhoneRecipientsIndex from '../screens/Campaign/Campaign/StepRecipients/PhoneRecipients/index'
import KeypadRecipients from '../screens/Campaign/Campaign/StepRecipients/KeypadRecipients/index'
import BulkgateRecipients from '../screens/Campaign/Campaign/StepRecipients/BulkgateRecipients/index'
import CampaignText from '../screens/Campaign/Campaign/StepText/index'
import CampaignSummary from '../screens/Campaign/Campaign/StepSummary/index'
import CampaignDashboard from '../screens/Campaign/CampaignDashboard/index'
import CampaignList from '../screens/Campaign/CampaignList/index'
import CampaignDeal from '../screens/Campaign/Campaign/StepDeal/index'
import DealPreview from '../screens/Campaign/Campaign/StepDeal/preview'
import TemplateList from '../screens/Campaign/Campaign/StepText/TemplateList/index'

import StoreCreate from '../screens/Store/StoreCreate/index'
import StoreSettings from '../screens/Store/StoreSettings/index'
import ColorPickerComponent from '../screens/Store/ColorPicker'
import CompanyData from '../screens/Store/CompanyData'
import ShortUrl from '../screens/Store/ShortUrl'
import Notifications from '../screens/Store/Notifications/index'
import CustomerSms from '../screens/Store/Notifications/CustomerSms'
import CustomerEmail from '../screens/Store/Notifications/CustomerEmail'
import OwnerSms from '../screens/Store/Notifications/OwnerSms'
import OwnerEmail from '../screens/Store/Notifications/OwnerEmail'
import Language from '../screens/Store/Language'
import StoreList from '../screens/Store/StoreList/index'
import StorePreview from '../screens/Store/StorePreview'
import OrderForm from '../screens/Store/OrderForm'

import Order from '../screens/Orders/Order'
import OrderList from '../screens/Orders/OrderList/OrderList'

import HistoryList from '../screens/History/HistoryList/index'
import CampaignDetail from '../screens/History/HistoryCampaignDetail/index'

import ScheduledList from '../screens/Scheduled/ScheduledList/index'
import ScheduledDetail from '../screens/Scheduled/ScheduledDetail/index'

import InboxList from '../screens/Inbox/InboxList/index'
import InboxDetail from '../screens/Inbox/InboxCampaignDetail/index'

import OutboxList from '../screens/Outbox/OutboxList/index'
import OutboxDetail from '../screens/Outbox/OutboxDetail/index'

import Chat from '../components/Chat'
import ChatDetail from '../components/ChatDetail'
import TestSMS from '../components/TestSMS'

import BuyCredit from '../screens/Payments/BuyCredit'
import Transactions from '../screens/Payments/Transactions/index'
import Invoices from '../screens/Payments/Invoices/index'
import InvoiceDetail from '../screens/Payments/Invoices/detail'

import Statistics from '../screens/Statistics/Statistics'

import Blacklist from '../screens/Blacklist/index'

import Settings from '../screens/Settings/Settings'

import SignIn from '../screens/Sign/SignIn'
import SignUp from '../screens/Sign/SignUp'
import LostPassword from '../screens/Sign/LostPassword'
import SignUpStepTwo from '../screens/Sign/SignUpStepTwo'

import Profile from '../screens/Profile/Profile/index'
import BaseInformations from '../screens/Profile/BaseInformations/index'
import ChangePassword from '../screens/Profile/ChangePassword/index'
import PaymentData from '../screens/Profile/PaymentData/index'
import ContactVerification from '../screens/Profile/ContactVerification/index'

BackAndroid.addEventListener("hardwareBackPress", () => {
    Actions.pop();
    return true;

});

export default class AppNavigator extends Component {

    render() {
        return (
            <Router >
                <Scene key="root" duration={0}>
                    <Scene key='SignIn' component={SignIn}  hideNavBar />
                    <Scene key='SignUp' component={SignUp} hideNavBar/>
                    <Scene key='SignUpStepTwo' component={SignUpStepTwo} hideNavBar/>
                    <Scene key='LostPassword' component={LostPassword} hideNavBar/>
                    <Scene key='Dashboard' component={Dashboard} hideNavBar/>
                    <Scene key='DashboardNewUser' component={DashboardNewUser} hideNavBar/>
                    <Scene key='Profile' component={Profile} hideNavBar/>
                    <Scene key='BaseInformations' component={BaseInformations} hideNavBar/>
                    <Scene key='PaymentData' component={PaymentData} hideNavBar/>
                    <Scene key='ContactVerification' component={ContactVerification} hideNavBar/>
                    <Scene key='ChangePassword' component={ChangePassword} hideNavBar/>
                    <Scene key='StoreList' component={StoreList} hideNavBar/>
                    <Scene key='StoreCreate' component={StoreCreate} hideNavBar/>
                    <Scene key='StoreSettings' component={StoreSettings} hideNavBar/>
                    <Scene key='StorePreview' component={StorePreview} hideNavBar/>
                    <Scene key='OrderForm' component={OrderForm} hideNavBar/>
                    <Scene key='Language' component={Language} hideNavBar/>
                    <Scene key='ShortUrl' component={ShortUrl} hideNavBar/>
                    <Scene key='Notifications' component={Notifications} hideNavBar/>
                    <Scene key='CompanyData' component={CompanyData} hideNavBar/>
                    <Scene key='CustomerSms' component={CustomerSms} hideNavBar/>
                    <Scene key='CustomerEmail' component={CustomerEmail} hideNavBar/>
                    <Scene key='OwnerEmail' component={OwnerEmail} hideNavBar/>
                    <Scene key='OwnerSms' component={OwnerSms} hideNavBar/>
                    <Scene key='CampaignCreate' component={CampaignCreate} hideNavBar/>
                    <Scene key='CampaignList' component={CampaignList} hideNavBar/>
                    <Scene key='HistoryList' component={HistoryList} hideNavBar/>
                    <Scene key='ScheduledList' component={ScheduledList} hideNavBar/>
                    <Scene key='ScheduledDetail' component={ScheduledDetail} hideNavBar/>
                    <Scene key='InboxList' component={InboxList} initial={true} hideNavBar/>
                    <Scene key='Statistics' component={Statistics} hideNavBar/>
                    <Scene key='Order' component={Order} hideNavBar/>
                    <Scene key='OrderList' component={OrderList} hideNavBar/>
                    <Scene key='HistoryList' component={HistoryList} hideNavBar/>
                    <Scene key='HistoryCampaignDetail' component={CampaignDetail} hideNavBar/>
                    <Scene key='InboxDetail' component={InboxDetail} hideNavBar/>
                    <Scene key='InboxList' component={InboxList} hideNavBar/>
                    <Scene key='OutboxList' component={OutboxList} hideNavBar/>
                    <Scene key='OutboxDetail' component={OutboxDetail} hideNavBar/>
                    <Scene key='BuyCredit' component={BuyCredit} hideNavBar/>
                    <Scene key='Transactions' component={Transactions} hideNavBar/>
                    <Scene key='Invoices' component={Invoices} hideNavBar/>
                    <Scene key='InvoiceDetail' component={InvoiceDetail} hideNavBar/>
                    <Scene key='Blacklist' component={Blacklist} hideNavBar/>
                    <Scene key='Settings' component={Settings} hideNavBar/>
                    <Scene key='ColorPicker' component={ColorPickerComponent} hideNavBar/>
                    <Scene key='Chat' component={Chat} hideNavBar/>
                    <Scene key='ChatDetail' component={ChatDetail} hideNavBar/>
                    <Scene key='Campaign' component={Campaign} hideNavBar/>
                    <Scene key='CampaignDashboard' component={CampaignDashboard} hideNavBar/>
                    <Scene key='CampaignDeal' component={CampaignDeal} hideNavBar/>
                    <Scene key='CampaignRecipients' component={CampaignRecipients} hideNavBar/>
                    <Scene key='CampaignSummary' component={CampaignSummary} hideNavBar/>
                    <Scene key='CampaignText' component={CampaignText} hideNavBar/>
                    <Scene key='KeypadRecipients' component={KeypadRecipients} hideNavBar/>
                    <Scene key='PhoneRecipientsAdd' component={PhoneRecipientsAdd} hideNavBar/>
                    <Scene key='PhoneRecipientsIndex' component={PhoneRecipientsIndex} hideNavBar/>
                    <Scene key='CsvExcel' component={CsvExcel} hideNavBar/>
                    <Scene key='Vcard' component={Vcard} hideNavBar/>
                    <Scene key='BulkgateRecipients' component={BulkgateRecipients} hideNavBar/>
                    <Scene key='DealPreview' component={DealPreview} hideNavBar/>
                    <Scene key='TemplateList' component={TemplateList} hideNavBar/>
                    <Scene key='TestSMS' component={TestSMS} hideNavBar/>
                </Scene>
            </Router>
        );
    }
}





