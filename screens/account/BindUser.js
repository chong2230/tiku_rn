import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import Storage from '../../utils/Storage';

export default class BindUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone : '',
            pwd : '',
            confirmPwd : ''
        };
    }

    _check = () => {
        var reg = /^1\d{10}$/; 
        if (this.state.phone == '') {
            this.refs.toast.show('请输入手机号');
            return false;
        } else if (!reg.test(this.state.phone)) {
            this.refs.toast.show('手机号格式不正确');
            return false;
        } else if (this.state.pwd == '' || this.state.confirmPwd == '') {
            this.refs.toast.show('请输入密码');
            return false;
        } else if (!this._checkLength(this.state.pwd) || !this._checkLength(this.state.confirmPwd)) {
            this.refs.toast.show('请输入6-24位的密码');
            return false;
        } else if (this.state.pwd != this.state.confirmPwd) {
            this.refs.toast.show('两次输入的密码不一致');
            return false;
        }
        return true;
    }

    _checkLength = (str) => {
        if (str.length < 6 || str.length.length > 24) return false;
        else return true;
    }

    _changePhone = () => {
        if (this._check()) {
            let user = {
                phone : this.state.phone,
                password: this.state.pwd
            };
            Common.updateUser(user, (result) => {
                if (result.code == 0) {
                    this.refs.toast.show('修改成功');
                    DeviceEventEmitter.emit('refreshAccount', user);
                    global.guest = null;
                    Storage.delete('guest');    // 删除游客标识
                    const { goBack } = this.props.navigation;
                    setTimeout(function() {
                        goBack();
                    }, 500);
                } else {
                    this.refs.toast.show(result.msg);
                }
            });
        }
    }

    render() {
        let { state } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Bar />
                <Header title={state.params.title || '绑定账号'} goBack={()=>{
                        let { goBack } = this.props.navigation;
                        goBack();
                    }} />
                <Text style={styles.tip}>设置手机号后，您可以使用手机号登录</Text>
                <TextInput placeholder="请输入手机号" style={styles.phone} onChangeText={(text)=>this.setState({phone: text})} />
                <Text style={styles.tip}>密码长度6~24位，可以是数字、字母等任意字符</Text>
                <TextInput placeholder="请输入密码" secureTextEntry={true} style={styles.password} onChangeText={(text)=>this.setState({pwd: text})}  />
                <TextInput placeholder="请确认密码" secureTextEntry={true} style={styles.password} onChangeText={(text)=>this.setState({confirmPwd: text})}  />
                <Button text="完成" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._changePhone} />
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
        fontSize: 15,
        margin: 15
    },
    phone: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        fontSize: 15,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
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
