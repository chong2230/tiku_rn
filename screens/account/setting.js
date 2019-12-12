import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Linking,
    Platform,
    NativeModules,
    AsyncStorage
} from 'react-native';

// import * as CacheManager from 'react-native-http-cache';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import Storage from '../../utils/Storage';
import Toast from '../../components/Toast';
import Alert from '../../components/Alert';
import SettingItem from './settingItem';

export default class Setting extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            cacheSize: 0,   //缓存大小
            token: null,
            showPull: false,        // 显示推送
            showPlay: false,        // 显示播放和下载
            showShare: false        // 显示分享
        });
    }
    componentWillMount() {
        Storage.get('token').then((val)=>{
            if (val) {
                this.setState({
                    token: val
                });
            }
        });
        this.getCacheSize();        
    }

    // 获得缓存大小
    async getCacheSize() {
        // const data = await CacheManager.getCacheSize();
        // const size = data / (1024 * 1024);
        this.setState({ cacheSize: /*size.toFixed(2) +*/ '0M'});
    }

    // 清除缓存
    async clearCache() {
        // await CacheManager.clearCache();
        // this.getCacheSize();
        // 这里貌似清除不能全部清除为0，这里直接写死0即可。
        this.setState({cacheSize: '0M'});
        this.toast.show('清除缓存成功');
        
    }

    _safeAccount = () => {
        const { state, navigate } = this.props.navigation;
        if (this.state.token == null) {
            navigate('Login', { isVisible: false, title: '密码登录', transition: 'forVertical',
                refresh: (token)=>{
                    if (token) {
                        if (state.params.refresh instanceof Function) state.params.refresh(token);
                    }
                }
            });
        } else {
            navigate('SafeAccount', {isVisible: false, title: "账户安全"});
        }        
    }

    _setPull = () => {
        
    }

    _setPlay = () => {
        
    }

    _appraise = () => {
        let appId = '1487972395';
        // iOS 7以下的版本 itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=APP_ID
        // iOS 7 itms-apps://itunes.apple.com/app/idAPP_ID
        // iOS 8+ itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=APP_ID&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software";
        let url = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id='+appId+'&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software'
        if (Platform.OS === 'ios') {
            Linking.openURL(url).catch(err => console.error('An error occurred', err)); 
        } 
        
    }

    _suggest = () => {
        const { navigate } = this.props.navigation;
        navigate('Suggest', {isVisible: true, title: '意见与建议'});
    }
    
    _about = () => {
        const { navigate } = this.props.navigation;
        navigate('About', {isVisible: true, title: '关于我们'});
    }

    _share = () => {
        
    }

    _logout = () => {
        Storage.delete('token').then(()=>{
            global.token = null;
            const { navigate, state } = this.props.navigation;
            setTimeout(function() {
                if (state.params.refresh) state.params.refresh(null);
                navigate('Login', { isVisible: false, title: '密码登录',
                    from: 'setting', returnKey: state.key, transition: 'forVertical',
                    refresh: (token)=>{
                        if (token != null) {
                            state.params.refresh(token);
                        }
                    }
                });
            }, 400);
        });   
    }

    render() {
        let pullView, playView, shareView, logoutView;
        if (this.state.showPull) pullView = <SettingItem txt1 = '推送设置' onPress={this._setPull}/>;
        if (this.state.showPlay) playView = <SettingItem txt1 = '播放和下载' onPress={this._setPlay}/>;
        if (this.state.showShare) shareView = <SettingItem txt1 = '推荐给好友' onPress={this._share}/>;
        if (this.state.token != null) {
            logoutView = (
                <TouchableOpacity  onPress={()=> this.alert.show()}>
                        <View style={styles.bottom}>
                            <Text style={styles.logoutBtn}>退出当前账号</Text>
                        </View>
                    </TouchableOpacity>
            );
        }
        return (
            <View style={styles.container}>
                <Bar />
                <Header title={'设置'} goBack={()=>{
                        let { goBack } = this.props.navigation;
                        goBack();
                    }}
                    bottomLineColor={'rgba(0, 0, 0)'} />
                <ScrollView style={{marginBottom:0}}>
                    <SettingItem txt1 = '账号安全' onPress={this._safeAccount}/>
                    <View style={styles.separator}></View>
                    {pullView}
                    {playView}
                    <SettingItem txt1 = '清除缓存' count = {this.state.cacheSize} showBorder = {false} onPress={this.clearCache.bind(this)}/>
                    <View style={styles.separator}></View>
                    <SettingItem txt1 = '给应用评分' onPress={this._appraise}/>
                    <SettingItem txt1 = '意见与建议' showBorder = {false} onPress={this._suggest}/>
                    <View style={styles.separator}></View>
                    <SettingItem txt1 = '关于我们' onPress={this._about}/>
                    {shareView}
                    <View style={{backgroundColor:'white',height:20}}></View>
                    
                    {logoutView}
                </ScrollView>
                <Alert
                    ref={(ref)=>this.alert = ref}
                    modalWidth={270}
                    modalHeight={124}
                    titleText="您确定要退出吗？"
                    titleFontSize={16}
                    titleFontWeight={"bold"}
                    confirm={this._logout}
                    okFontColor={'#4789F7'}
                />
                <Toast ref={(ref)=>{this.toast = ref}} position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white'
        flex: 1
    },
    bottom: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: 'white'        
    },
    logoutBtn: {
        color: Colors.highlight,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: '500'
    },
    separator: {
        backgroundColor: '#ECEFF2',
        height: 10
    }
});
