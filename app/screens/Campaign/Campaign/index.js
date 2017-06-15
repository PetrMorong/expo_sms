/**
 * Created by Petr on 4.5.2017.
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
import { MaterialIcons as Icon }from '@expo/vector-icons';
import { connect } from 'react-redux';
import { save, fetch, deleteListItem } from '../../../actions/index';
import Toolbar from '../../../components/Toolbar';
import Menu from '../../../components/Menu';
import Step from '../../../components/StepperSingleStep';
import DrawerLayout from 'react-native-drawer-layout';

import StepRecipients from './StepRecipients/index'
import StepDeal from './StepDeal/index'
import StepText from './StepText/index'
import StepSummary from './StepSummary/index'

const window = Dimensions.get('window');

const mapStateToProps = (store) => {
    return{
        campaign: store.campaign,
        stepDeal: store.stepDeal,
        storeList: store.storeList
    }
}

export default class Campaign extends Component {
    constructor(props){
        super(props)

        let state;
        if(this.props.status == 'concept-contacts'){
            state = {step: 1, step1: 'active', step2: 'disabled', step3: 'disabled', step4: 'disabled'}
        }
        if(this.props.status == 'concept-deal'){
            state = {step: 2, step1: 'done', step2: 'active', step3: 'disabled', step4: 'disabled'}
        }
        if(this.props.status == 'concept-text'){
            state = {step: 3, step1: 'done', step2: 'done', step3: 'active', step4: 'disabled'}
        }
        if(this.props.status == 'summary' || this.props.status == "summary-duplicity"){
            state = {step: 4, step1: 'done', step2: 'done', step3: 'done', step4: 'active'}
        }

        this.state = state
    }

    componentWillMount(){
        this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.id}))
        this.props.dispatch(fetch('campaign/get-deal-image', {reducer: 'stepDeal'}, {id: this.props.id}))
        this.props.dispatch(fetch('store/get-store-list', {reducer: 'storeList'}, {limit: 20, offset: 0}))
    }

    renderName(){
        try{
            return _('Campaign') + ' ' + this.props.campaign.data.result.campaign.name
        }catch(e){
            return _('Campaign')
        }
    }

    renderStepper(){

        if(this.props.campaign.data.result.campaign.type == 'classic'){
            return <View style={[{paddingLeft: 20, paddingRight: 20}, styles.stepperContainer]} >
                <Step type={this.state.step1} number="1" title={_('Recipients')} handlePress={()=>this.goToStep1()}/>
                <View style={styles.line}/>
                <Step type={this.state.step3} number="2" title={_('Sms text')} handlePress={()=>this.goToStep3()}/>
                <View style={styles.line}/>
                <Step type={this.state.step4} number="3" title={_('Summary')}/>
            </View>
        }

        if(this.props.campaign.data.result.campaign.type == 'smart'){
            return  <View style={styles.stepperContainer} >
                <Step type={this.state.step1} number="1" title={_('Recipients')} handlePress={()=>this.goToStep1()}/>
                <View style={styles.line}/>
                <Step type={this.state.step2} number="2" title={_('Deal')} handlePress={()=>this.goToStep2()}/>
                <View style={styles.line}/>
                <Step type={this.state.step3} number="3" title={_('Sms text')} handlePress={()=>this.goToStep3()}/>
                <View style={styles.line}/>
                <Step type={this.state.step4} number="4" title={_('Summary')} />
            </View>
        }
    }

    goToStep1(){
        this.setState({step: 1, step1: 'active', step2: 'disabled', step3: 'disabled', step4: 'disabled'})
        this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'concept-contacts'}))

    }

    goToStep2(){
        this.setState({step: 2, step1: 'done', step2: 'active', step3: 'disabled', step4: 'disabled'})
        this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'concept-deal'}))
    }

    goToStep3(){
        this.setState({step: 3, step1: 'done', step2: 'done', step3: 'active', step4: 'disabled'})
        this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'concept-text'}))

    }

    handleNext(data){

        if(this.state.step == 1 && this.props.campaign.data.result.campaign.type == 'classic'){
            this.setState({step: 3, step1: 'done', step2: 'done', step3: 'active', step4: 'disabled'})
            this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'concept-text'}))
        }

        if (this.state.step == 1 && this.props.campaign.data.result.campaign.type == 'smart'){
            this.setState({step: 2, step1: 'done', step2: 'active', step3: 'disabled', step4: 'disabled'})
            this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'concept-deal'}))
        }

        if (this.state.step == 2){

            data.expiration_hours = data.expiration_date.substr(11,2);
            data.expiration_minutes = data.expiration_date.substr(14,2);

            this.props.dispatch(save('campaign/set-value', {reducer: 'campaign'}, {id: this.props.id, data: {deal: data}}, ()=>setTimeout(()=>{
                this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'concept-text'}))
                this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.id}, ()=>{
                    this.setState({step: 3, step1: 'done', step2: 'done', step3: 'active', step4: 'disabled'})
                }))
            }), 10))
        }

        if (this.state.step == 3){

            data.scheduled_hours = data.scheduled_date.substr(11,2);
            data.scheduled_minutes = data.scheduled_date.substr(14,2);


            let difference = {};
            Object.keys(data).map((item)=>{
                if(data[item] !== this.props.campaign.data.result.campaign[item]){
                    difference[item] = data[item];
                }
            });


           this.props.dispatch(save('campaign/set-value', {reducer: 'campaign'}, {id: this.props.id, data: {campaign: difference}}, ()=>setTimeout(()=>{

                this.props.dispatch(save('campaign/to-step', {reducer: 'campaign'}, {campaign_id: this.props.id, step: 'summary'}, ()=>setTimeout(()=>{
                    //success
                    this.props.dispatch(fetch('campaign/get-campaign', {reducer: 'campaign'}, {id: this.props.id}, ()=>{
                        this.setState({step: 4, step1: 'done', step2: 'done', step3: 'done', step4: 'active'})
                    }))
                }), 10))

            }), 10))

        }

    }

    handleBack(){

        if(this.state.step == 2){
            this.setState({step: 1, step1: 'active', step2: 'disabled', step3: 'disabled', step4: 'disabled'})
        }

        if(this.state.step == 3 && this.props.campaign.data.result.campaign.type == 'classic'){
            this.setState({step: 1, step1: 'active', step2: 'disabled', step3: 'disabled', step4: 'disabled'})
        }

        if(this.state.step == 3 && this.props.campaign.data.result.campaign.type == 'smart'){
            this.setState({step: 2, step1: 'done', step2: 'active', step3: 'disabled', step4: 'disabled'})
        }

        if(this.state.step == 4){
            this.setState({step: 3, step1: 'done', step2: 'done', step3: 'active', step4: 'disabled'})
        }


    }

    renderStep(){

        if(this.state.step == 1){
            return <StepRecipients handleNext={()=>this.handleNext()} />
        }

        if(this.state.step == 2){
            return <StepDeal handleNext={(data)=>this.handleNext(data)} handleBack={()=>this.handleBack()} />
        }

        if(this.state.step == 3){
            return <StepText handleNext={(data)=>this.handleNext(data)} handleBack={()=>this.handleBack()} />
        }

        if(this.state.step == 4){
            return <StepSummary handleBack={()=>this.handleBack()} />
        }
    }

    render() {
        let menu  = <Menu/>;

        let view;
        if(this.props.campaign.fetching || this.props.stepDeal.fetching || this.props.storeList.fetching){
            view = <View style={{backgroundColor: 'white', height: window.height-60, width: window.width, justifyContent: 'center'}}>
                <ActivityIndicator
                    style={{height: 150}}
                    size="large"
                />
            </View>
        }else{

            view = <View style={styles.container}>
                    {this.renderStepper()}
                    {this.renderStep()}
                </View>
        }

        return (
            <DrawerLayout
                drawerWidth={300}
                ref={(_drawer) => this.drawer = _drawer}
                renderNavigationView={() => menu}>
                <Toolbar
                    openMenu={() => this.drawer.openDrawer()}
                    background="container"
                    title={this.renderName()}
                    elevation={2}/>
                {view}
            </DrawerLayout>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    stepperContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
        elevation: 2
    },
    line: {
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
        borderBottomColor: '#D0DFE8',
        borderBottomWidth: 1,
        marginBottom: 15
    }
});

module.exports = connect(mapStateToProps)(Campaign);