/**
 * Created by cluo on 2017/12/24.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import AccountItem from '../../components/AccountItem';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import { TabbarSafeBottomMargin } from '../../utils/Device';

export default class Account extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            token: null,
            info: {},
            showNote: false,        // 显示日记
            showFavor: false,     // 显示收藏
            showDownload: false,    // 显示下载
            showShare: false,        // 显示分享
            showMessage: false
        };
    }

    componentDidMount() {
        let self = this;        
        if (global.token) this._getAccount();
        this.emitter = DeviceEventEmitter.addListener('refreshAccount', (data) => {
            if (data.phone) {
                data.phone = data.phone.substr(0, 3) + '****' + data.phone.substr(data.phone.length-4, 4);
            }
            self.setState({
                info: Object.assign({}, self.state.info, data)
            })
        })
        this.emitter = DeviceEventEmitter.addListener('navigationStateChange', (data) => {
            if (global.token) self._getAccount();
        })
    }

    _getAccount = () => {
        Common.getAccount((result)=>{
            if (result.code == 0) {
                let data = result.data;
                let phone = '';
                if (data.phone) {
                    phone = data.phone.substr(0, 3) + '****' + data.phone.substr(data.phone.length-4, 4);
                } else {
                    phone = ' ';
                }
                data.phone = phone;
                this.setState({
                    info : data
                });                
            } else if (result.code == 2) {
                this._goLogin();
            }
        });
    }

    _onPress = (type) => {
        if (global.token == null) {
            this._goLogin();
            return;
        }
        let self = this;
        const { navigate } = this.props.navigation;
        switch (type) {
            case 0:
            navigate('Profile', {isVisiable: true, title: '个人信息', info: JSON.stringify(this.state.info),
                refresh: (data)=>{
                    // console.log(data);
                    this.setState({
                        info: data
                    });                    
                }});
                break;
            case 1:
                navigate('Recharge', {money: this.state.info.balance, isVisiable: true, title: '账户', refresh: (money)=>{
                    if (money != null) {
                        self.setState({
                            info: Object.assign({}, self.state.info, {balance: money})
                        })
                    }
                }});
                break;
            case 2:
                navigate('Column', {from: 'purchase', isVisiable: true, title: '已购'});
                break;
            case 4:
            case 7:
            case 8:
                Alert.alert('', '程序小哥正在快马加鞭，敬请期待噢~');
                break;
            case 3:
                navigate('Ticket', {isVisible: true, title: '我的礼券'});
                break;
            case 5:
                navigate('Note', {isVisible: true, title: '我的笔记'});
                break;
            case 6:
                navigate('Message', {isVisible: true, title: '我的留言'});
                break;
        }
    }

    _showInfo = () => {

    }

    _goLogin = () => {
        const { navigate } = this.props.navigation;
        navigate('Login', { isVisible: false, title: '密码登录', transition: 'forVertical', refresh: (token)=>{
            if (token != null) {
                this._getAccount();
            }
        }});
    }

    _goSetting = () => {
        const { navigate } = this.props.navigation;
        navigate('Setting', {isVisible: false, title: '设置', refresh: (token)=>{
            if (token == null) {
                this.setState({
                    info: {}
                });
            } else {
                this._getAccount();
            }
            
        }});
    }

    render() {
        let avatarImg;
        if (this.state.info.avatarImage) {
            avatarImg = <Image source={{uri: Common.baseUrl + this.state.info.avatarImage}} style={styles.avatarIcon} />;
        } else {
            avatarImg = <Image source={require('../../images/defaultAvatar.jpg')} style={styles.avatarIcon} />;
        }
        let noteView, favorView, downloadView, shareView, messageView;
        if (this.state.showNote) noteView = <AccountItem txt1 = "我的笔记" source = {require('../../images/account/note.png')} onPress={()=>this._onPress(5)} />;
        if (this.state.showFavor) favorView = <AccountItem txt1 = "我的收藏" source = {require('../../images/account/hobby.png')} onPress={()=>this._onPress(7)} />;
        if (this.state.showDownload) downloadView = <AccountItem txt1 = "我的下载" source = {require('../../images/account/download.png')} onPress={()=>this._onPress(8)} />;
        if (this.state.showShare) shareView = <AccountItem txt1 = "分享有赏" source = {require('../../images/account/publish.png')} onPress={()=>this._onPress(4)} />;
        if (this.state.showMessage) messageView = <AccountItem txt1 = "我的留言" source = {require('../../images/account/message.png')} onPress={()=>this._onPress(6)} />;
        return (
            <View style={styles.container}>                
                <View>
                    <Image source={require('../../images/account/person_bg.jpg')} style={styles.person} />
                </View>
                <ScrollView>
                    <TouchableOpacity onPress={()=>this._onPress(0)}>
                        <View style={styles.avatar}>
                            {avatarImg}
                            <View style={styles.avatarInfo}>
                                <Text style={styles.name}>{this.state.info.nickName || '未登录'}</Text>
                                <Text style={styles.phone}>{this.state.info.phone || '点击头像登录'}</Text>
                            </View>
                        </View>    
                    </TouchableOpacity>                    
                    <View style={styles.separator}></View>
                    <AccountItem txt1 = "账户" count={this.state.money} source = {require('../../images/account/nick.png')} onPress={()=>this._onPress(1)} />
                    <AccountItem txt1 = "已购" source = {require('../../images/account/star.png')} onPress={()=>this._onPress(2)} />
                    <AccountItem txt1 = "礼券" count={this.state.ticket} source = {require('../../images/account/ticket.png')} onPress={()=>this._onPress(3)} />
                    {shareView}
                    <View style={styles.separator}></View>                    
                    
                    {noteView}
                    {messageView}
                    {favorView}
                    {downloadView}
                    {/*<View style={styles.separator}></View>*/}
                    <AccountItem txt1 = "设置" source = {require('../../images/account/set.png')} onPress={this._goSetting}/>                    
                </ScrollView>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }  

    componentWillUnmount() {
        this.emitter.remove();
    }  
}

Account.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    person: {
        height: 150
    },
    avatar: {
        flexDirection:'row', 
        height: 80
    },
    avatarIcon: {
        width: 50,
        height: 50,        
        borderRadius: 25,
        alignSelf: 'center',
        left: 10
    },
    avatarInfo: {
        justifyContent:'center', 
        flexDirection: 'column',
        left: 20
    },
    name: {
        fontWeight: 'bold', 
        fontSize: 15
    },
    phone: {
        color: '#828282',
        fontSize: 13, 
        top: 5
    },
    separator: {
        backgroundColor: '#ECEFF2',
        height: 10
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
