import React, {Component,PropTypes} from 'react';
import {
    Text,
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
    Alert,
    Dimensions,
    DeviceEventEmitter,
    Linking,
    Platform,
    NativeModules,
    requireNativeComponent
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import openShare from 'react-native-open-share';
import ImageButton from './ImageButton';
import {compareVer} from '../utils/Util';

const LoginModule = NativeModules.loginModule;
var NativeView = requireNativeComponent('SignWithApple');

var deviceW = Dimensions.get('window').width;

const SharePlatform = {
    QQ: 0,
    SINA: 1,
    WECHAT: 2,
    WECHATMOMENT: 3,
    QQZONE: 4,
    FACEBOOK: 5
};

export default  class ThirdPartyLogin extends Component {

    constructor(props) {
        super(props);  
        this.state = {
            showWxBtn: false,
            showWbBtn: false,
            showAppleBtn: false,
            isWechatInstalled: false,
            isQQInstalled: false,
            isWeiboInstalled: false
        }  
    }

    componentDidMount() {
        let self = this;
        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                // Linking.openURL('weixin://');
                // console.log('open weixin');
                self.setState({
                    isWechatInstalled: true
                });
            } else {
                console.log('请先安装微信');
            }
        });
        Linking.canOpenURL('mqq://').then(supported => {
            if (supported) {
                // Linking.openURL('mqq://');
                // console.log('open qq');
                self.setState({
                    isQQInstalled: true
                });
            } else {
                console.log('请先安装QQ');
            }
        });
        Linking.canOpenURL('sinaweibo://').then(supported => {
            if (supported) {
                // Linking.openURL('weibo://');
                // console.log('open weibo ');
                self.setState({
                    isWeiboInstalled: true
                });
            } else {
                console.log('请先安装微博');
            }
        });
        let systemVersion = DeviceInfo.getSystemVersion();
        if (Platform.OS == 'ios' && compareVer(systemVersion, '13.0') >= 0) {
            this.setState({
                showAppleBtn: true
            })
        }
    }

    _wechatLogin = () => {
        if (Platform.OS == 'android') {
            this.login('WECHAT');
            return;
        }
        var _this = this;
        if (this.state.isWechatInstalled) {
            // console.log('Wechat Installed');
            openShare.wechatLogin();

        } else {
            // console.log('Wechat not installed');
            _this.props.loginCallback('wx', null, null);
        }
        // openShare.wechatLogin();

        if(!_this.wechatLogin) {
          _this.wechatLogin = DeviceEventEmitter.addListener(
            'managerCallback',
            (response) => {
                let data = JSON.stringify(response);
                // Alert.alert(
                //     'response',
                //     JSON.stringify(response)
                // );
                _this.props.loginCallback('wx', data);
                _this.wechatLogin.remove();
                delete _this.wechatLogin;
            }
          );
        }
    }

    _qqLogin = () => {
        if (Platform.OS == 'android') {
            this.login('QQ');
            return;
        }
        var _this = this;
        if (this.state.isQQInstalled) {
            // console.log('QQ Installed');
            openShare.qqLogin();

        } else {
            // console.log('QQ not installed');
            _this.props.loginCallback('qq', null, null);
        }
        // openShare.qqLogin();

        if(!_this.qqLogin) {
          _this.qqLogin = DeviceEventEmitter.addListener(
            'managerCallback',
            (response) => {
                let data = response.res;
                _this.props.loginCallback('qq', data.openid, data.access_token);
                _this.qqLogin.remove();
                delete _this.qqLogin;
            }
          );
        }
    }

    _weiboLogin = () => {
        if (Platform.OS == 'android') {
            this.login('SINA');
            return;
        }
        var _this = this;
        if (this.state.isWeiboInstalled) {
            // console.log('Weibo Installed');
            // openShare.weiboLogin();

        } else {
            // console.log('Weibo not installed');
            _this.props.loginCallback('wb', null, null);
        }

        if(!_this.weiboLogin) {
          _this.weiboLogin = DeviceEventEmitter.addListener(
            'managerCallback',
            (response) => {
                let data = response.res;
                _this.props.loginCallback('wb', data.userID, data.accessToken);              
                _this.weiboLogin.remove();
                delete _this.weiboLogin;
            }
          );
        }
    }

    login(platform) {
        if (!LoginModule) return;
        LoginModule.login(SharePlatform[platform], (response) => {
            /**
             * response
             * 授权数据
             * uid
             * openid
             * accessToken
             * expiration
             * 用户数据
             * name
             * iconurl
             * unionGender
             */
            console.log('login response', response);
            if (platform == 'QQ') {
                let data = response;
                _this.props.loginCallback('qq', data.openid, data.accessToken);
            } else if (platform == 'SINA') {
                _this.props.loginCallback('wb', data.uid, data.accessToken);
            }
        })
    }

    render() {
        if (Platform.OS == 'android') return null;
        let wxBtn, qqBtn, wbBtn;
        let otherLogin = '';
        if (this.state.showWxBtn && this.state.isWechatInstalled) {
            wxBtn = <ImageButton source={require('../images/icon-wx.jpg')}
                                 style={[styles.imageButton, this.state.showAppleBtn ? styles.loginBtn : null]}
                                 onPress={this._wechatLogin} />;
            otherLogin = '其他方式登录';
        }
        if (this.state.isQQInstalled) {
            qqBtn = <ImageButton source={require('../images/icon-qq.jpg')}
                                 style={[styles.imageButton, this.state.showAppleBtn ? styles.loginBtn : null]}
                                 onPress={this._qqLogin} />;
            otherLogin = '其他方式登录';
        }
        if (this.state.showWbBtn && this.state.isWeiboInstalled) {
            wbBtn = <ImageButton source={require('../images/icon-wb.jpg')}
                                 style={[styles.imageButton, this.state.showAppleBtn ? styles.loginBtn : null]}
                                 onPress={this._weiboLogin} />;
            otherLogin = '其他方式登录';
        }
        return (
            <View style={styles.container}>
                <Text style={styles.otherLogin}>{otherLogin}</Text>
                <View style={styles.btns}>
                    {wxBtn}
                    {qqBtn}
                    {wbBtn}
                    {
                        this.state.showAppleBtn ?
                            <NativeView
                                style={styles.appleView}  //这里的 style 可以定义原生iOSView的样式
                                onClick={(info)=>{
                                    console.log(info);
                                    if(info.nativeEvent.success){
                                        let res = info.nativeEvent.success;
                                        // alert(info.nativeEvent.success)
                                        this.props.loginCallback('apple', res.userID, res.token);
                                    }else if(info.nativeEvent.error){
                                        Alert.alert('提示', info.nativeEvent.error)
                                    }
                                }}
                            >
                                <Image
                                    source={require('../images/account/apple_login.png')}
                                    style={[styles.imageButton, styles.appleBtn]}
                                    />
                                <Text style={styles.appleText}>苹果账号登录</Text>
                            </NativeView> : null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    otherLogin: {
        margin: 10,
        textAlign: 'center',
        color: '#828282',
        fontSize: 15
    },
    btns: {
        flexDirection: 'row',
        marginLeft: 60,
        marginRight: 60,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    imageButton: {
        width: 50,
        height: 50,
        marginTop: 30,
        marginBottom: 30
        // margin: (deviceW-100-120)/4
    },
    loginBtn: {
        width: 30,
        height: 30
    },
    appleView: {
        width: 118, 
        height:30
    },
    appleBtn: {
        width: 118,
        height: 30,
        top: -30,
        left: 0,
        position: 'absolute'
    },
    appleText: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        top: 9,
        left: 31,
        position: 'absolute'
    }

});