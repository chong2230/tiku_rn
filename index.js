import React, { Component } from 'react';
import { AppRegistry, View, Platform, Linking } from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import DeviceInfo from 'react-native-device-info';
import LoadingView from './components/LoadingView';
import Common from './utils/Common';
import Alert from './components/Alert';
import Colors from './constants/Colors';

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
        }
    }

    _checkVersionUpdate() {
        Common.checkVersionUpdate({}, (result)=>{
            if (result.code == 0) {
                let data = result.data;
                // For Test
                // data = {
                //     descr: '增加做题模式；\n查看正确题目、错误题目和未做题目；\n添加QQ登录功能；',
                //     isUpdate: 1,
                //     forceUpdate: 0,
                //     updateUrl: '',
                //     versionCode: "1.2"
                // };
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
                    <Alert
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
            </View>
        );
    }
}

AppRegistry.registerComponent(appName, () => setup);
