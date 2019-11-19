import React, {Component,PropTypes} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    Dimensions,
    DeviceEventEmitter,
    Linking
} from 'react-native';

// import openShare from 'react-native-open-share';
import ImageButton from './ImageButton';

var deviceW = Dimensions.get('window').width;

export default  class ThirdPartyLogin extends Component {

    constructor(props) {
        super(props);  
        this.state = {
            showWxBtn: false,
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
                console.log('open weixin');
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
    }

    _wechatLogin = () => {
        var _this = this;
        if (this.state.isWechatInstalled) {
            // console.log('Wechat Installed');
            // openShare.wechatLogin();

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
        var _this = this;
        if (this.state.isQQInstalled) {
            // console.log('QQ Installed');
            // openShare.qqLogin();

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

    render() {
        let wxBtn, qqBtn, wbBtn;
        let otherLogin = '';
        if (this.state.showWxBtn && this.state.isWechatInstalled) {
            wxBtn = <ImageButton source={require('../images/icon-wx.jpg')} style={styles.imageButton} onPress={this._wechatLogin} />;
            otherLogin = '其他方式登录';
        }
        if (this.state.isQQInstalled) {
            qqBtn = <ImageButton source={require('../images/icon-qq.jpg')} style={styles.imageButton} onPress={this._qqLogin} />;
            otherLogin = '其他方式登录';
        }
        // console.log('isWeiboInstalled ', openShare.isWeiboInstalled);
        console.log('isWeiboInstalled ', this.state.isWeiboInstalled);
        if (this.state.isWeiboInstalled) {
            wbBtn = <ImageButton source={require('../images/icon-wb.jpg')} style={styles.imageButton} onPress={this._weiboLogin} />;
            otherLogin = '其他方式登录';
        }
        return (
            <View style={styles.container}>
                <Text style={styles.otherLogin}>{otherLogin}</Text>
                <View style={styles.btns}>
                    {wxBtn}
                    {qqBtn}
                    {wbBtn}
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
        fontSize: 13
    },
    btns: {
        flexDirection: 'row',
        marginLeft: 60,
        marginRight: 60
    },
    imageButton: {
        width: 50,
        height: 50,
        margin: (deviceW-100-120)/4
    }

});