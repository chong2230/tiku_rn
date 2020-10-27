/**
* 账号注销
**/

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Text,
    DeviceEventEmitter,
    Platform
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Page from '../../components/Page';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import Toast from '../../components/Toast';
import Alert from '../../components/Alert';
import ShadowToast from '../../components/ShadowToast';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import {TabbarSafeBottomMargin} from "../../utils/Device";
import Storage from "../../utils/Storage";

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;

export default class AccountLogoff extends Page {

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    _logoffAccount = () => {
        let params = {

        };
        Common.logoff(params, (result)=>{
            if (result.code == 0) {
                this.iconToast.show('账号注销申请成功');
                Storage.delete('token').then(()=>{
                    global.token = null;
                    global.guest = null;    // 是否为游客
                    Storage.delete('guest');
                    DeviceEventEmitter.emit('refreshAccount');
                    // const {navigate, state, goBack} = this.props.navigation;
                    // this.timeout = setTimeout(() => {
                    //     goBack(state.params.returnKey);
                    // }, 1500);
                    const { navigate, state } = this.props.navigation;
                    setTimeout(function() {
                        if (state.params.refresh) state.params.refresh(null);
                        navigate('Account', { isVisible: false, transition: 'forVertical',
                            refresh: (token)=>{
                                if (token != null) {
                                    state.params.refresh(token);
                                }
                            }
                        });
                    }, 400);
                });

            } else {
                this.refs.toast.show(result.msg);
            }
        })
    }  

    _cancel = () => {
        this.goBack();
    }

    _check = () => {

    }

    _goNotice = () => {
        let { navigate } = this.props.navigation;
        navigate('AccountLogoffNotice', { isVisible: false });
    }

    _confirmLogoff = () => {
        this.alert.show();
    }

    alertConfirm = () => {
        this._logoffAccount();
    }

    _pressAgreeImg = () => {
        this.setState({
            selected: !this.state.selected
        })
    }

    render() {
        let label1 = '帐号一旦被注销将不可恢复，请你在操作之前自行备份帐号相关的所有信息和数据。注销帐号，你将无法再使用本帐号，也将无法找回你帐号及与帐号相关的任何内容或信息（即使你使用相同的手机号码再次注册并使用）。'
        let alertTip = '您的账号将被注销，同时手机号、第三方授权释放。您确定要注销吗？';
        return (
            <View style={styles.container}>
                <Bar />
                {this._renderNavBar()}
                <Text numberOfLines={10} style={styles.title}>{label1}</Text>
                <Text style={styles.tip}>重要提示：若账号内有账户余额等资产，注销账号后资产清零永久性无法找回！</Text>
                {this._renderButtons()}
                {this._renderAgree()}
                <View style={styles.safeBottom}></View>
                <Alert
                    ref={(ref)=>this.alert = ref}
                    modalWidth={270}
                    modalHeight={195}
                    titleText="注销账号"
                    titleFontSize={18}
                    titleFontWeight={"bold"}
                    desText={alertTip}
                    descFontColor={Colors.text}
                    okFontColor={'#FF4337'}
                    okText={'确认注销'}
                    confirm={this._logoffAccount}
                    cancelText={'取消'}

                />
                <Toast ref="toast" position="center" />
                <ShadowToast ref={(ref)=>{this.iconToast = ref}}></ShadowToast>
            </View>
        );
    }

    _renderNavBar = () => {
        return (
            <View>
                <Header
                    title={'账号注销'}
                    goBack={()=>{
                        let { goBack } = this.props.navigation;
                        goBack();
                    }}
                    bottomLineColor={'rgba(0, 0, 0, 0)'}
                    />
            </View>
        )
    }

    _renderLabel = (label1, label2=null) => {
        return (
            <View style={styles.labelView}>
                <Text style={styles.label1}>{'• ' + label1}</Text>
                <Text style={styles.label2}>{label2}</Text>
            </View>
        );
    }

    _renderButtons = () => {
        let btnDisabled = !this.state.selected;
        let btnDisabledStyle = btnDisabled ? {opacity: 0.6} : null;
        return (
            <View style={styles.buttons}>
                <Button disabled={btnDisabled} style={[styles.button, btnDisabledStyle]} text={'确认注销账号'}
                    onPress={this._confirmLogoff}
                />
            </View>
        );
    }

    _renderAgree = () => {
        return (
            <View style={styles.agreeBox}>
                <ImageButton source={this.state.selected ? require('../../images/icon/radio_selected.png') : require('../../images/icon/radio.png')}
                       style={styles.agreeImg} onPress={this._pressAgreeImg} />
                <Text style={styles.agreeText}>我已阅读并同意</Text>
                <Button style={styles.noticeBtn} text={'《有知学堂注销须知》'}
                        onPress={this._goNotice}
                />
            </View>
        );
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.timeout && clearTimeout(this.timeout);
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    title: {
        width: deviceW - 30,
        marginTop: 15,
        marginLeft: 15,
        color: Colors.title,
        fontSize: 15,
        fontWeight: '500',
        // height: 23,
        lineHeight: 23
    },
    tip: {
        color: '#FF4337',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 65,
        fontSize: 14,
        lineHeight: 23,
        fontWeight: '500',
    },
    labelView: {
        margin: 15
    },
    label1: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '500',
        height: 23,
        lineHeight: 23
    },
    label2: {
        fontSize: 14,
        color: Colors.gray,
        height: 19,
        lineHeight: 19
    },
    icon: {
        width: 14,
        height: 14,
        marginRight: 20
    },
    buttons: {
        marginTop: 25,
        marginBottom: 15
    },
    button: {
        marginHorizontal: 24,
        height: 44,
        backgroundColor: '#FF4337',
        fontSize: 17,
        fontWeight: 'bold',
        borderRadius: 4,
        lineHeight: 44,
        textAlign: 'center',
        color: 'white',
    },
    agreeBox: {
        flexDirection: 'row',
        marginLeft: 21,
        marginBottom: 37,
        alignItems: 'center'
    },
    agreeImg: {
        width: 15,
        height: 15,
        marginRight: 5,
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: {h: 3, w: 3},
        shadowOpacity: 0.2,
        alignSelf: 'center'
    },
    agreeText: {
        fontSize: 14,
        color: Colors.gray,
        fontWeight: '500'
    },
    noticeBtn: {
        color: Colors.highlight,
        fontWeight: '500'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
