/**
 * 账号安全
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import SafeAccountItem from './safeAccountItem';

export default class SafeAccount extends Component {

    constructor(props) {
        super(props);
    }

    _changePwd = () => {
        const { navigate } = this.props.navigation;
        navigate('UpdatePassword', {isVisible: true, title: "修改密码"});
    }

    _changePhone = () => {
        const { navigate } = this.props.navigation;
        navigate('UpdatePhone', {isVisible: true, title: "修改手机号"});
    }

    _bindWx = () => {
        
    }

    _bindQq = () => {
        
    }

    _bindWeibo = () => {
        
    }

    render() {
        return (
            <View>
                <Bar />
                <Header title={'账号安全'} goBack={()=>{
                        let { goBack } = this.props.navigation;
                        goBack();
                    }} bottomLineColor={'rgba(0, 0, 0)'} />
                <SafeAccountItem txt1 = '修改密码' style={{marginTop: 10}} onPress={this._changePwd}/>
                <SafeAccountItem txt1 = '更换手机号' onPress={this._changePhone}/>
                <SafeAccountItem txt1 = '绑定微信' onPress={this._bindWx}/>
                <SafeAccountItem txt1 = '绑定QQ'  onPress={this._bindQq}/>
                <SafeAccountItem txt1 = '绑定微博' onPress={this._bindWeibo}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    separator: {
        backgroundColor: '#ECEFF2',
        height: 10
    }
});
