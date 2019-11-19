import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions
} from 'react-native';

import Bar from '../../components/Bar';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';

export default class SetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            newPwd : '',
            confirmPwd : ''
        };
    }

    _check = () => {
        if (this.state.newPwd == '') {
            this.refs.toast.show('请输入密码');
            return false;
        } else if (!this._checkLength(this.state.newPwd)) {
            this.refs.toast.show('请输入6-24位的密码');
            return false;
        } else if (this.state.newPwd != this.state.confirmPwd) {
            this.refs.toast.show('两次输入的密码不一致');
            return false;
        } else if (this.state.code == '') {
            this.refs.toast.show('请输入验证码');
            return false;
        }
        return true;
    }

    _checkLength = (str) => {
        if (str.length < 6 || str.length.length > 24) return false;
        else return true;
    }

    _changePwd = () => {
        if (this._check()) {
            const { navigate, state } = this.props.navigation;
            console.log('email ', state.params.email);
            Common.setPassword(state.params.email, this.state.code, this.state.newPwd, (result) => {
                if (result.code == 0) {
                    this.refs.toast.show('设置密码成功');
                    setTimeout(function() {
                        navigate('Login', { isVisiable: true, title: '密码登录', transition: 'forVertical', refresh: (token)=>{
                            if (state.params.refresh) state.params.refresh(token);
                        }});
                    }, 400);
                } else {
                    this.refs.toast.show(result.msg);
                }
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Bar />
                <Text style={styles.tip}>密码长度6~24位，可以是数字、字母等任意字符</Text>
                <TextInput placeholder="设置密码" secureTextEntry={true} style={styles.password} onChangeText={(text)=>this.setState({newPwd: text})}  />
                <TextInput placeholder="确认密码" secureTextEntry={true} style={styles.password} onChangeText={(text)=>this.setState({confirmPwd: text})}  />
                <TextInput placeholder="验证码" style={styles.inputStyle} onChangeText={(text)=>this.setState({code: text})}  />
                <Button text="完成" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._changePwd} />
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    tip: {
        fontSize: 13,
        textAlign: 'center',
        margin: 10
    },
    password: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
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
    btnContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.highlight,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {        
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    }
});
