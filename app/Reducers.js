import { combineReducers } from 'redux'

import dashboard from './screens/Dashboard/reducer'
import user from './screens/Sign/reducer'
import translator from './reducers/translatorReducer'


import profile from './screens/Profile/Profile/reducer';
import baseInformations from './screens/Profile/BaseInformations/reducer';
import changePassword from './screens/Profile/ChangePassword/reducer';
import paymentData from './screens/Profile/PaymentData/reducer';
import contactVerification from './screens/Profile/ContactVerification/reducer';
import storeCreate from './screens/Store/StoreCreate/reducer';
import storeSettings from './screens/Store/StoreSettings/reducer';
import notifications from './screens/Store/Notifications/reducer';
import storeList from './screens/Store/StoreList/reducer';
import orderList from './screens/Orders/OrderList/reducer';
import historyList from './screens/History/HistoryList/reducer';
import historyCampaignDetail from './screens/History/HistoryCampaignDetail/reducer';
import transactions from './screens/Payments/Transactions/reducer';
import invoices from './screens/Payments/Invoices/reducer';
import blacklist from './screens/Blacklist/reducer';
import scheduledList from './screens/Scheduled/ScheduledList/reducer';
import inboxList from './screens/Inbox/InboxList/reducer';
import inboxCampaignDetail from './screens/Inbox/InboxCampaignDetail/reducer';
import outboxList from './screens/Outbox/OutboxList/reducer';
import statistics from './screens/Statistics/reducer';
import scheduledDetail from './screens/Scheduled/ScheduledDetail/reducer';
import outboxDetail from './screens/Outbox/OutboxDetail/reducer';
import campaignList from './screens/Campaign/CampaignList/reducer';
import campaignCreate from './screens/Campaign/CampaignCreate/reducer';
import campaign from './screens/Campaign/Campaign/reducer';
import bulkgateRecipients from './screens/Campaign/Campaign/StepRecipients/BulkgateRecipients/reducer';
import keypadRecipients from './screens/Campaign/Campaign/StepRecipients/KeypadRecipients/reducer';
import stepDeal from './screens/Campaign/Campaign/StepDeal/reducer';
import templateList from './screens/Campaign/Campaign/StepText/TemplateList/reducer'
import campaignDashboard from './screens/Campaign/CampaignDashboard/reducer';

export default combineReducers({
    dashboard,
    user,
    translator,
    profile,
    baseInformations,
    changePassword,
    paymentData,
    contactVerification,
    storeCreate,
    storeSettings,
    notifications,
    storeList,
    orderList,
    historyList,
    historyCampaignDetail,
    transactions,
    invoices,
    blacklist,
    scheduledList,
    inboxList,
    inboxCampaignDetail,
    outboxList,
    statistics,
    scheduledDetail,
    outboxDetail,
    campaignList,
    campaignCreate,
    campaign,
    bulkgateRecipients,
    keypadRecipients,
    stepDeal,
    templateList,
    campaignDashboard
})