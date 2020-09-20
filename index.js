import React, { Component } from 'react';
import { AppRegistry, View, Alert, Platform, Linking } from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
  } from 'react-native-update';
import DeviceInfo from 'react-native-device-info';

import App from './App';
import {name as appName} from './app.json';
import _updateConfig from './update.json';
import LoadingView from './components/LoadingView';
import Common from './utils/Common';
import MyAlert from './components/Alert';
import Toast from './components/Toast';
import Colors from './constants/Colors';

const {appKey} = _updateConfig[Platform.OS];

class setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descr: '',
            isUpdate: 0,
            forceUpdate: 0,
            updateUrl: '',
            versionCode: "1.0"
        };
        this._init();
        this._checkVersionUpdate();
    }

    _init() {
        if (!__DEV__) {            
            Common.isHack = false;
            global.console = {
                info: () => {},
                log: () => {},
                warn: () => {},
                error: () => {},
                assert: () => {},
            };
            global.alert = () => {}
            global.isAudit = true;
        }
    }

    _checkVersionUpdate() {
        Common.checkVersionUpdate({}, (result)=>{
            if (result.code == 0) {
                let data = result.data;
                // For Test
                // data = {
                //     // descr: '增加做题模式；\n查看正确题目、错误题目和未做题目；\n添加QQ登录功能；',
                //     descr: '1. iOS13支持苹果第三方登录\n2. app销户功能 \n3. 在线资询 4. minor bug fix',
                //     isUpdate: 1,
                //     forceUpdate: 0,
                //     updateUrl: '',
                //     versionCode: "1.2"
                // };
                global.isAudit = data.isAudit;  // 是否审查中
                let ver = DeviceInfo.getVersion();
                if (data.isUpdate) {
                    this.setState({
                        descr: data.descr,
                        forceUpdate: data.forceUpdate,
                        updateUrl: data.updateUrl
                    }, ()=>{
                        this.alert.show();
                    });
                }
            }
        })
    }

    componentDidMount() {
        // this.checkUpdate();
    }

    doUpdate = async (info) => {
        try {
          const hash = await downloadUpdate(info);
          Alert.alert('提示', '下载完毕,是否重启应用?', [
            {text: '是', onPress: ()=>{switchVersion(hash);}},
            {text: '否',},
            {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
          ]);
        //   switchVersionLater(hash);
        } catch(err) {
          Alert.alert('提示', '更新失败.');
        }
      }

    checkUpdate = async () => {
        if (__DEV__) {
          // 开发模式不支持热更新，跳过检查
          return;
        }
        let info;
        try {
          info = await checkUpdate(appKey);
        } catch (err) {
          console.warn(err);
          return;
        }
        if (info.expired) {
          Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
            {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
          ]);
        } else if (info.upToDate) {
          Alert.alert('提示', '您的应用版本已是最新.');
        } else {
          Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
            {text: '是', onPress: ()=>{this.doUpdate(info)}},
            {text: '否',},
          ]);
            // this.doUpdate(info)
        }
    }

    render() {
        return (
            <View
                style={{
                    flex : 1,
                }}
            >
                <App />
                {<LoadingView
                    ref={(ref) => {
                        global.mLoadingComponentRef = ref;
                    }}
                />}
                {
                    <MyAlert
                        ref={(ref)=>this.alert = ref}
                        modalWidth={270}
                        modalHeight={200}
                        titleText={"发现新版本"}
                        titleFontSize={16}
                        titleFontWeight={"bold"}
                        desText={this.state.descr}
                        okText={'更新'}
                        cancelText={'取消'}
                        confirm={()=>{
                            Linking.openURL(this.state.updateUrl).catch(err => console.error('An error occurred', err));
                        }}
                        cancel={()=>{
                            this.alert.close();
                        }}
                        onPress={()=>{
                            if (!this.state.forceUpdate) {
                                this.alert.close();
                            }
                        }}
                        okFontColor={Colors.highlight}
                        cancelFontColor={Colors.gray}
                        showCancelBtn={this.state.forceUpdate == 0}
                    />
                }
                {
                    <Toast ref={(ref)=>{global.toastComponentRef = ref}} position="center" />
                }
            </View>
        );
    }
}

AppRegistry.registerComponent(appName, () => setup);
