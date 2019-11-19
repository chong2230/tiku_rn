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
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import Toast from '../../components/Toast';

const deviceW = Dimensions.get('window').width;

export default class ForgetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email : ''
        };
    }

    _check = () => {
        var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (this.state.email == '') {
            this.refs.toast.show('请输入电子邮箱');
            return false;
        } else if (!reg.test(this.state.email)) {
            this.refs.toast.show('请输入合法的电子邮箱');
            return false;
        }
        return true;
    }

    _next = () => {
        if (this._check()) {
            Common.safeValidate(this.state.phone, this.state.code, (result) => {
                if (result.code == 0) {
                    this.refs.toast.show('验证成功');
                    const { navigate, state } = this.props.navigation;
                    setTimeout(function() {
                        navigate('SetPassword', { isVisible: true, title: '设置密码', refresh: (token)=>{
                            if (state.params.refresh) state.params.refresh(token);
                        }});
                    }, 400);
                } else {
                    this.refs.toast.show(result.msg);
                }
            });
        }
    }

    _sendEmail = () => {
        let self = this;
        if (this._check() == false) return; 
        Common.sendEmail(this.state.email, (result) => {
            console.log(self.state.email, result);
            if (result.code == 0) {
                self.refs.toast.show('发送邮件成功，请查收');
                const { navigate, state } = this.props.navigation;
                setTimeout(function() {
                    navigate('SetPassword', { isVisible: true, title: '设置密码', email: self.state.email, refresh: (token)=>{
                        if (state.params.refresh) state.params.refresh(token);
                    }});
                }, 400);
            } else {
                self.refs.toast.show(result.msg);
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Bar />
                <TextInput placeholder="输入电子邮箱" style={styles.inputStyle} onChangeText={(text)=>this.setState({email: text})} />                
                <Button text="发送邮件" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._sendEmail} />                
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
        flex: 1,
        height: 30,
        flexDirection: 'row',
        marginTop: 20
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
        color: '#3584d9'
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
    }
});
