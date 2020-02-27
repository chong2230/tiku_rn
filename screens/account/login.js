import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    StatusBar,
    Alert,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import Colors from '../../constants/Colors';
import ThirdPartyLogin from '../../components/ThirdPartyLogin';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import Navigator1 from '../../utils/navigator1';
import Toast from '../../components/Toast';

const deviceW = Dimensions.get('window').width;

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone : '',
            pwd : ''
        };
    }

    _check = () => {
        if (this.state.phone == '') {
            this.refs.toast.show('请输入手机号');
            return false;
        } else if (this.state.pwd == '') {
            this.refs.toast.show('请输入密码');
            return false;
        }
        return true;
    }

    _login = () => {
        if (this._check()) {
            Common.login(this.state.phone, this.state.pwd, (result) => {
                if (result.code == 0) {
                    let data = result.data;
                    this.refs.toast.show('登录成功');
                    global.token = data.token;
                    Storage.save('token', data.token).then(()=>{
                        const { navigate, state, goBack } = this.props.navigation;
                        if (state.params.refresh) state.params.refresh(data.token);
                        setTimeout(function() {
                            if (state.params.callback instanceof Function) {
                                state.params.callback();
                            }
                            // navigate('Main');
                            goBack();
                        }, 400);
                    });                    
                } else {
                    this.refs.toast.show(result.msg);
                }                               
            });
        }
    }

    _regist = () => {
        const { navigate, state } = this.props.navigation;
        navigate('Regist', { isVisible: false, title: '注册',
            returnKey: state.params.from == 'setting' ? state.params.returnKey : state.key,
            refresh: (token)=>{
                if (state.params.refresh) state.params.refresh(token);
            }
        });
    }

    _forgetPwd = () => {
        const { navigate, state } = this.props.navigation;
        navigate('ForgetPassword', { isVisible: true, title: '安全验证', refresh: (token)=>{
            if (state.params.refresh) state.params.refresh(token);
        }});
    }

    leftAction = () => {
        const { navigate, goBack, state } = this.props.navigation;
        if (state.params.from == 'setting') navigate('Account');
        else {
            if (state.params.callback instanceof Function) {
                state.params.callback();
            }
            goBack();
        }
    }

    rightAction = () => {
        const { navigate, state } = this.props.navigation;
        navigate('FreeLogin', { isVisible: true, title: '免密登录', refresh: (token)=>{
            if (state.params.refresh) state.params.refresh(token);
        }});
    }

    _loginCallback = (type, openid, accessToken) => {
        Common.thirdPartyLogin(type, openid, accessToken, (result) => {
            if (result.code == 0) {
                let data = result.data;
                this.refs.toast.show('登录成功');
                global.token = data.token;
                Storage.save('token', data.token).then(()=>{
                    const { navigate, state, goBack } = this.props.navigation;
                    if (state.params.refresh) state.params.refresh(data.token);
                    if (state.params.callback instanceof Function) {    // 同login
                        state.params.callback();
                    }
                    setTimeout(function() {
                        goBack();
                    }, 400);
                });       
            } else {
                this.refs.toast.show(result.msg);
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Bar />
                {/*<Navigator1 leftText = '返回' centerText = '密码登录'  rightText = '' leftAction = {()=>this.leftAction()} rightAction = {() => this.rightAction()}/>*/}
                <Header
                    leftBtnIsHidden={true}
                    title={'登录'}
                    // goBack={()=>{this.leftAction()}}
                    rightSource={require('../../images/account/loginDismiss.png')}
                    onRight={()=>{
                        this.leftAction();
                    }}
                    bottomLineColor={'rgba(0, 0, 0)'}
                />
                <TextInput placeholder="输入手机号" keyboardType='numeric' style={styles.phone} onChangeText={(text)=>this.setState({phone: text})} />
                <TextInput placeholder="输入密码" secureTextEntry={true} style={styles.password} onChangeText={(text)=>this.setState({pwd: text})}  />
                <Button text="登录" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._login} />
                <View style={styles.other}>
                    <Button text="注册" style={styles.registBtn} containerStyle={styles.registBtnContainer} onPress={this._regist} />
                    <Button text="忘记密码" style={styles.forgetBtn} containerStyle={styles.forgetBtnContainer} onPress={this._forgetPwd} />
                </View>
                <View style={styles.separate}></View>
                <ThirdPartyLogin loginCallback={this._loginCallback}></ThirdPartyLogin>
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

Login.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    tip: {
        fontSize: 13,
        textAlign: 'center',
        margin: 10
    },
    phone: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 30,
        height: 50,
        fontSize: 15,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    password: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        fontSize: 15,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    btnContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.highlight,
        width: deviceW - 20,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {        
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    other: {
        height: 30,
        flexDirection: 'row',
        marginTop: 20
    },
    separate: {
        flex: 1
    },
    registBtnContainer: {
        flex: 1,
        left: 20,

    },
    registBtn: {
        fontSize: 15,
        color: Colors.highlight//'#ea642e'
    },
    forgetBtnContainer: {
        right: 20,
        
    },
    forgetBtn: {
        fontSize: 15,
        color: '#828282'
    },
    bottom: {
        // bottom: 30
    },
    otherLogin: {
        margin: 20,
        textAlign: 'center',
        color: '#828282'
    },
    btns: {
        flexDirection: 'row',
        marginLeft: 60,
        marginRight: 60
    },
    imageButton: {
        width: 50,
        height: 50,
        margin: (deviceW-150-120)/6
    }
});
