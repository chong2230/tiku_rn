/**
 *  
 * 分享（只支持一/两排按钮）
 * 箩筐、微信好友、朋友圈、QQ、QQ空间、新浪微博
 *（对应类型type：luokuang, wechat_friend, wechat_timeline, qq, qzone, weibo）
 * 加入筐伴(kuang friend)、屏蔽(block)、举报(tip off)
 * props
 * multiline: true/false 多行显示 default: false
 * showLuokuang
 * 
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform
} from 'react-native';
import ImageButton from './ImageButton';
import Colors from './Colors';
import { TabbarSafeBottomMargin } from '../utils/Device';


const { width,height } = Dimensions.get('window');
const modalHeight = 200;
const iconWidth = 43;
const iconHeight = 43;
const ModalBottomMargin = (Platform.OS == 'ios' ? 0 : 20);
const dict = {
    'luokuang': {src: require('../images/icon/luokuang.png'), name: '箩筐'},
    'wechat_friend': {src: require('../images/icon/wechat_friend.png'), name: '微信好友'},
    'wechat_timeline': {src: require('../images/icon/wechat_timeline.png'), name: '朋友圈'},
    'qq': {src: require('../images/icon/qq.png'), name: 'QQ'},
    'qzone': {src: require('../images/icon/qzone.png'), name: 'QQ空间'},
    'weibo': {src: require('../images/icon/weibo.png'), name: '新浪微博'},
    'follow_shot': {src: require('../images/icon/follow_shot.png'), name: '跟拍'},
    'add_friend': {src: require('../images/icon/add_friend.png'), name: '加入筐伴'},
    'remove_friend': {src: require('../images/icon/remove_friend.png'), name: '从筐伴删除'},
    'block': {src: require('../images/icon/block.png'), name: '屏蔽'},
    'unblock': {src: require('../images/icon/unblock.png'), name: '解除屏蔽'},
    'prosecute': {src: require('../images/icon/prosecute.png'), name: '举报'},
    'delete': {src: require('../images/icon/delete.png'), name: '删除内容'},
}

export default class ShareModal1 extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            
        };
    }

    _renderView = () => {
        let itemsView = [];
        let items = [];
        let commonItems = ['wechat_friend', 'wechat_timeline', 'qq', 'qzone', 'weibo'];
        // 箩筐放在最前面
        if (this.props.showLuokuang) items.push('luokuang');
        items = items.concat(commonItems);
        let len = items.length;
        for(let item of items) {
            itemsView.push(this._renderItem(item, len));
        }

        let itemsView2 = [];
        if (this.props.multiline) {
            // 添加跟拍、加入筐伴/从筐伴删除、屏蔽/解除屏蔽、举报、删除内容等            
            let items2 = [];
            if (this.props.showFollowshot) items2.push('follow_shot');
            if (this.props.showAddfriend) items2.push('add_friend');
            if (this.props.showRemovefriend) items2.push('remove_friend');
            if (this.props.showBlock) items2.push('block');
            if (this.props.showUnblock) items2.push('unblock');
            if (this.props.showProsecute) items2.push('prosecute');
            if (this.props.showDelete) items2.push('delete');
            for(let item2 of items2) {
                itemsView2.push(this._renderItem(item2, len));
            }
        }
        return (
            <View style={{flex: 1}}>
                <ScrollView horizontal={true}>
                    {itemsView}
                </ScrollView>
                {
                    this.props.multiline ?
                    <ScrollView horizontal={true}>
                        {itemsView2}
                    </ScrollView> : 
                    null
                }
            </View>
        );
    }

    _renderItem = (type, len) => {
        let data = dict[type];
        //居中显示
        let leftStyle = len < 6 ? 
            { marginLeft: (width - (iconWidth + 20) * len)/(len + 1) } 
            : null;
        return (
            <View style={[styles.item, leftStyle]} key={type}>
                <ImageButton source={data.src} style={styles.icon} onPress={()=>this._postMessage(type)}></ImageButton>
                <Text name={styles.name}>{data.name}</Text>

            </View>
        );        
    }

    // 发送分享消息
    _postMessage = (msg) => {
        this.props.onRequestClose();
        this.props.postMessage(msg);
    }

    render() {
        let modalStyle2 = this.props.multiline ? {height: modalHeight + 90} : null;
        let shadowStyle2 = this.props.multiline ? {height: height - modalHeight - TabbarSafeBottomMargin - 90 - ModalBottomMargin} : null;
        return (
            <View style={styles.container}>
                { /* 解决全面屏底部留白问题 */ }
                <View style={styles.space}></View>
                <TouchableWithoutFeedback onPress={()=>this.props.onRequestClose()}>
                    <View style={[styles.shadowView, shadowStyle2]}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={[styles.modalStyle, modalStyle2]}>
                    <Text style={styles.title}>分享</Text>
                    {
                        this._renderView()
                    }
                    
                    <View style={styles.separator}></View>
                    <TouchableOpacity onPress={()=>this.props.onRequestClose()}>
                        <View style={[styles.item, styles.handleItem]}>
                            <Text style={styles.textStyle}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }
}

ShareModal1.propTypes = {
    multiline: PropTypes.bool,
    showLuokuang: PropTypes.bool,
    // showWechatFriend: PropTypes.bool,
    // showWechatTimeline: PropTypes.bool,
    // showQq: PropTypes.bool,
    // showQzone: PropTypes.bool,
    // showWeibo: PropTypes.bool,
    showFollowshot: PropTypes.bool,
    showAddfriend: PropTypes.bool,
    showRemovefriend: PropTypes.bool,
    showBlock: PropTypes.bool,
    showUnblock: PropTypes.bool,
    showTipoff: PropTypes.bool,
    showDelete: PropTypes.bool
}

ShareModal1.defaultProps = {
    multiline: false,
    showLuokuang: false,
    // showWechatFriend: true,
    // showWechatTimeline: true,
    // showQq: true,
    // showQzone: true,
    // showWeibo: true,
    showFollowshot: false,
    showAddfriend: false,
    showRemovefriend: false,
    showBlock: false,
    showUnblock: false,
    showProsecute: true,
    showDelete: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    shadowView:{
        backgroundColor: 'white',
        opacity: 0,
        height: height - modalHeight - TabbarSafeBottomMargin - ModalBottomMargin,
        width: width,
    },
    modalStyle:{
        backgroundColor: 'white',
        width: width,
        height: modalHeight
    },
    title: {
        color: Colors.share,
        width: width,
        textAlign: 'center',
        fontSize: 18,
        marginTop: 15,
        marginBottom: 15
    },
    item: {
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 10
    },
    handleItem: {
        height: 50,
    },
    icon: {
        width: iconWidth,
        height: iconHeight,
        margin: 10
    },
    name: {
        color: Colors.share
    },
    textStyle: {
        fontSize: 18,
        marginTop: 15,
        color: '#4a4a4a'
    },
    line: {
        backgroundColor: '#eceff2',
        width: width - 50,
        height: 1,
        marginLeft: 20,
    },
    separator: {
        backgroundColor: '#eceff2',
        height: 10
    },
    space: {
        backgroundColor: 'white',
        width: width,
        height: 20,
        position: 'absolute',
        bottom: 0
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});

