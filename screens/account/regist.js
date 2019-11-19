import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    AsyncStorage,
    Dimensions
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
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;

export default class Regist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uname : '',
            phone : '',
            pwd : '',
            pwd2 : '',
            email: '',
            code : ''
        };
    }

    _check = () => {
        var reg = /^1\d{10}$/;                          // 验证手机
        var reg2= /^(?![^a-zA-Z]+$)(?!\D+$)/;           // 验证密码
        var reg3 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;   // 验证邮箱
        /*if (this.state.uname == '') {
            this.refs.toast.show('请输入昵称');
            return false;
        } else */if (this.state.phone == '') {
            this.refs.toast.show('请输入手机号');
            return false;
        } else if (!reg.test(this.state.phone)) {
            this.refs.toast.show('手机号格式错误');
            return false;
        } else if (this.state.pwd == '') {
            this.refs.toast.show('请输入密码');
            return false;
        }  else if (!this._isValidLength(this.state.pwd)) {
            this.refs.toast.show('请输入6~24位密码');
            return false;
        } else if (!reg2.test(this.state.pwd)) {
            this.refs.toast.show('密码必须包含数字和字母');
            return false;
        } else if (this.state.pwd2 == '') {
            this.refs.toast.show('请输入确认密码');
            return false;
        } else if (this.state.pwd != this.state.pwd2) {
            this.refs.toast.show('两次输入的密码不一致');
            return false;
        } else if (this.state.email != '' && !reg3.test(this.state.email)) {
            this.refs.toast.show('请输入合法的电子邮箱');
            return false;
        }
        return true;
    }

    _isValidLength = (str) => {
        if (str.length < 6 || str.length.length > 24) return false;
        else return true;
    }

    _regist = () => {
        if (this._check()) {
            Common.regist(this.state.uname, this.state.phone, this.state.pwd, this.state.email, (result) => {
                if (result.code == 0) {
                    this.refs.toast.show('注册成功');
                    global.token = result.data.token;
                    Storage.save('token', result.data.token).then(()=>{
                        const { navigate, state, goBack } = this.props.navigation;
                        if (state.params.refresh) state.params.refresh(result.data.token);
                        setTimeout(function() {
                            goBack(state.params.returnKey);
                        }, 400);
                    });
                } else {
                    this.refs.toast.show(result.msg);
                }                
            });
        }
    }

    _getCode = () => {

    }

    _getService = () => {
        const { navigate } = this.props.navigation;
        navigate('Service', {isVisiable: true, title: ''});
    }

    _loginCallback = (type, openid, accessToken) => {
        Common.thirdPartyLogin(type, openid, accessToken, (result) => {
            if (result.code == 0) {
                let data = result.data;
                this.refs.toast.show('注册成功');
                global.token = data.token;
                Storage.save('token', data.token).then(()=>{
                    const { navigate, state, goBack } = this.props.navigation;
                    if (state.params.refresh) state.params.refresh(data.token);
                    setTimeout(() => {
                        goBack(state.params.returnKey);
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
                <Header title={'注册'} goBack={()=>{
                        let { goBack } = this.props.navigation;
                        goBack();
                    }}
                    bottomLineColor={'rgba(0, 0, 0, 0)'}
                />
                <TextInput placeholder="输入昵称" style={styles.name} onChangeText={(text)=>this.setState({uname: text})} />
                <TextInput placeholder="输入手机号" keyboardType='numeric' style={styles.inputStyle} onChangeText={(text)=>this.setState({phone: text})} />
                <TextInput placeholder="输入密码" secureTextEntry={true} style={styles.inputStyle} onChangeText={(text)=>this.setState({pwd: text})}  />
                <TextInput placeholder="确认密码" secureTextEntry={true} style={styles.inputStyle} onChangeText={(text)=>this.setState({pwd2: text})}  />            
                <TextInput placeholder="电子邮箱（用于找回密码，可不填）" style={styles.inputStyle} onChangeText={(text)=>this.setState({email: text})}  />            
                <Button text="完成" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._regist} />
                <View style={styles.other}>
                    <Text style={styles.tip}>点击『完成』，即表示您同意并愿意遵守</Text>
                    <Button text="《有知学堂用户协议》" style={styles.serviceBtn} containerStyle={styles.serviceBtnContainer} onPress={this._getService} />
                </View>
                <View style={styles.separate}></View>
                <ThirdPartyLogin loginCallback={this._loginCallback}></ThirdPartyLogin>
                <View style={styles.safeBottom}></View>
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    name: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 30,
        height: 50,
        fontSize: 15,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    inputStyle: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        fontSize: 15,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    codeView: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    codeInputStyle: {
        flex: 1
    },
    codeBtnContainer: {
        right: 10,
        paddingLeft: 10,
        borderLeftColor: '#e0e0e0',
        borderLeftWidth: 1
    },
    codeBtn: {
        fontSize: 15,
        color: Colors.highlight
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
        color: Colors.highlight
    },
    tip: {
        marginLeft: 10,
        fontSize: 13,
        color: '#828282'
    },
    serviceBtnContainer: {
        // right: 20,
        
    },
    serviceBtn: {
        fontSize: 13,
        color: Colors.highlight//'#3584d9'
    },
    bottom: {
        bottom: 30
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
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
