import React, { Component } from 'react';
import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter
} from 'react-native';
import { parseNativeArgs, isJson } from '../utils/Util';

const { 
    LKRouteBridgeModule,
    LKAudioPlayerBridgeModule,
    LKUserInfoEventEmitter
} = NativeModules;
const EVENT_TYPE_SEND_USER_INFO_EVENT = 'sendUserInfoEvent';

export default class Page extends Component {

    constructor(props) {
        super(props); 
        this._getParams();
        this._addListener();       
    }

    _getParams = () => {
        // TODO: 不同页面跳转进来参数的处理，是通过props.args还是props.navigation.state获取
        let args = this.props.args;
        if (args) {
            this.params = isJson(args) ? JSON.parse(args) : args;//parseNativeArgs(args);
            if (global) {
                global.uid = this.params.uid;
                global.uname = this.params.uname;
                global.icon = this.params.icon;
                global.source_id = this.params.source_id;
                global.token = this.params.token;
                global.guid = this.params.guid;
                global.ver = this.params.ver;
            }
        } else {
            this.params = this.props.navigation.state.params || {};
        }
        // 测试数据
        if (typeof this.params == 'object' && JSON.stringify(this.params) == "{}") {
            this.params = {
                mid: 'AODAxODc4NjYzMzM2',
                uid: 'a19c391b982644b0ae9b747b4f32004a',//'b8f65d78962f4a79a9b9cd13d40ca667',
                token: 'owiuei',
                guid: '98aad48a966f5323fad30aa6b52ee1df8fb23f42',
                ver: '4.5.2',
                isFirst: 1
            }
        }
        console.log(this.params)
    }

    _addListener = () => {
        let self = this;
        function handler(reminder) {
            console.log('reminder of user info ', reminder)
            if (global && reminder.uid) {
                global.uid = reminder.uid;
                global.token = reminder.token;
            }
        }
        if (Platform.OS === "ios") {
            if (LKUserInfoEventEmitter) {
                self.userEmitter = new NativeEventEmitter(LKUserInfoEventEmitter);
                self.userSubscriber = self.userEmitter.addListener(
                  EVENT_TYPE_SEND_USER_INFO_EVENT,
                  handler
                );
            }
        } else {
            self.userSubscriber = DeviceEventEmitter.addListener(
                EVENT_TYPE_SEND_USER_INFO_EVENT, 
                handler
            );
        }
    }

    // 返回到原生页面或RN页面
    _onClickBackButton = () => {
        this.props.navigation.goBack();
    }

    // 页面跳转
    go = (route, params=null, callback=()=>{}) => {
        LKRouteBridgeModule && LKRouteBridgeModule.push(route, params, callback);
    }    

    componentWillUnmount() {
        console.log('unmount in page');
        if (this.userSubscriber) this.userSubscriber.remove();
    }
}