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
    DeviceEventEmitter, Linking, Platform
} from 'react-native';

import AccountItem from '../../components/AccountItem';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import { TabbarSafeBottomMargin } from '../../utils/Device';
import Button from "../../components/Button";
import Alert from '../../components/Alert';
import Colors from "../../constants/Colors";
import AnalyticsUtil from '../../utils/AnalyticsUtil';

export default class Account extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            token: null,
            info: {},
            member: null,     // 会员信息
            showNote: false,        // 显示日记
            showFavor: true,     // 显示收藏
            showDownload: false,    // 显示下载
            showShare: false,        // 显示分享
            showMessage: false
        };
    }

    componentDidMount() {
        let self = this;        
        if (global.token) {
            this._load();
        }
        this.emitter = DeviceEventEmitter.addListener('refreshAccount', (data) => {
            if (!data) {    // 注销
                this.setState({
                    info: {},
                    member: null
                });
                return;
            }
            if (data.phone) {
                data.phone = data.phone.substr(0, 3) + '****' + data.phone.substr(data.phone.length-4, 4);
            }
            self.setState({
                info: Object.assign({}, self.state.info, data)
            })
        })
        this.navigationEmitter = DeviceEventEmitter.addListener('navigationStateChange', (data) => {
            if (global.token) self._load();
        });
        this.memberEmitter = DeviceEventEmitter.addListener('memberChange', (data) => {
            if (global.token) self._getUserMember();
        });
        AnalyticsUtil.onEvent('ntk_my');
    }

    _load = () => {
        this._getAccount();
        this._getUserMember();
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

    _getUserMember = () => {
        Common.getUserMember({
            courseId: global.course.courseId || global.course.id
        }, (result)=>{
            if (result.code == 0) {
                this.setState({
                    member: result.data
                })
            }
        })
    }

    _onPress = (type) => {
        if (global.token == null && type == 0) {
            this._goLogin();
            return;                
        }
        let self = this;
        const { navigate } = this.props.navigation;
        switch (type) {
            case 0:
            navigate('Profile', {isVisible: false, title: '个人信息', info: JSON.stringify(this.state.info),
                refresh: (data)=>{
                    // console.log(data);
                    this.setState({
                        info: data
                    });                    
                }});
                break;
            case 1:
                navigate('Recharge', {money: this.state.info.balance, isVisible: false, title: '账户', refresh: (data)=>{
                    if (data != null) {
                        if (data.token) this._load();
                        else {
                            self.setState({
                                info: Object.assign({}, self.state.info, {balance: data.balance})
                            })
                        }
                    }
                }});
                break;
            case 2:
                navigate('Subject', {from: 'purchase', isVisible: false, title: '已购试卷'});
                break;
            case 4:
            case 8:
                Alert.alert('', '程序小哥正在快马加鞭，敬请期待噢~');
                break;
            case 3:
                navigate('Ticket', {isVisible: false, title: '我的礼券'});
                break;
            case 5:
                navigate('Note', {isVisible: true, title: '我的笔记'});
                break;
            case 6:
                navigate('Message', {isVisible: true, title: '我的留言'});
                break;
            case 7:
                navigate("MyCollect", { course: global.course, isVisible: false});
                break;
            case 9:
                navigate("MyRecord", {course: global.course, isVisible: false});
                break;
            case 10:
                this._getWrongTimuList();
                break;
        }
    }

    _getWrongTimuList = () => {
        let { state, navigate } = this.props.navigation;
        let params = {
            professionId: global.course.professionId,
            courseId: global.course.id
        };
        Common.getWrongTimuList(params, (result)=>{
            console.log('getTimuList ', result);
            if (result.code == 0) {
                if (result.data && result.data.length == 0) {
                    this.toast.show('还没有错题哦~');
                } else {
                    navigate("WrongTimu", {course: global.course,
                        list: result.data, isVisible: false});
                }
            } else {
                this.toast.show(result.msg);
            }
        });
    }

    _showInfo = () => {

    }

    _goLogin = () => {
        const { navigate } = this.props.navigation;
        navigate('Login', { isVisible: false, from: 'Account', title: '密码登录', transition: 'forVertical', refresh: (token)=>{
            if (token != null) {
                this._load();
            }
        }});
    }

    // 在线咨询
    _goChat = () => {
        let qq = '498643367';
        let url = Platform.OS === 'ios' ? 'mqq://im/chat?chat_type=wpa&uin='+qq+'&version=1&src_type=web'
            : 'mqqwpa://im/chat?chat_type=wpa&uin=' + qq;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    _goSetting = () => {
        const { navigate } = this.props.navigation;
        navigate('Setting', {isVisible: false, title: '设置', refresh: (token)=>{
            if (token == null) {
                this.setState({
                    info: {}
                });
            } else {
                this._load();
            }
            
        }});
    }

    _onPressMember = () => {
        if (this.state.member && this.state.member > 1) {
            this.alert.show();
        } else {
            this._goGoods();
        }
    }

    // 进入商品购买列表 TODO: refresh paper, not reload
    _goGoods = () => {
        const { navigate, state } = this.props.navigation;
        navigate("Goods", {
            isVisible: false, refresh: ()=>{
                this._load();
            }
        });
    }

    render() {
        let avatarImg;
        if (this.state.info.avatarImage) {
            avatarImg = <Image source={{uri: Common.baseUrl + this.state.info.avatarImage}} style={styles.avatarIcon} />;
        } else {
            avatarImg = <Image source={require('../../images/defaultAvatar.jpg')} style={styles.avatarIcon} />;
        }
        let name = this.state.info.nickName;
        if (name) {
            name += this.state.member && this.state.member.level > 1 ? '（会员）' : '（普通用户）';
        } else {
            name = '未登录';
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
                                <Text style={styles.name}>{name}</Text>
                                <Text style={styles.phone}>{this.state.info.phone || '点击头像登录'}</Text>
                            </View>
                            {
                                global.token && !global.isAudit ?
                                    <View style={styles.rightInfo}>
                                        <Button text={this.state.member && this.state.member.level > 1 ? '会员权益' : '升级会员'}
                                                style={styles.memberBtn} containerStyle={styles.memberBtnContainer}
                                                onPress={this._onPressMember} />
                                    </View>
                                    : null
                            }
                        </View>
                    </TouchableOpacity>                    
                    <View style={styles.separator}></View>
                    {
                        Platform.OS === 'ios' ? <AccountItem txt1 = "账户" count={this.state.info.balance ? this.state.info.balance + '余额' : ''} source = {require('../../images/account/nick.png')} onPress={()=>this._onPress(1)} /> : null
                    }                    
                    {!global.isAudit ? <AccountItem txt1 = "礼券" count={this.state.ticket} source = {require('../../images/account/ticket.png')} onPress={()=>this._onPress(3)} /> : null}
                    <AccountItem txt1 = "已购试卷" source = {require('../../images/account/star.png')} onPress={()=>this._onPress(2)} />
                    {shareView}
                    <View style={styles.separator}></View>                    
                    
                    {noteView}
                    {messageView}
                    {favorView}
                    {downloadView}
                    {/*<View style={styles.separator}></View>*/}
                    <AccountItem txt1 = "做题记录" source = {require('../../images/account/publish.png')} onPress={()=>this._onPress(9)} />
                    {/*<AccountItem txt1 = "错题库" source = {require('../../images/account/note.png')} onPress={()=>this._onPress(10)} />*/}
                    <View style={styles.separator}></View>
                    <AccountItem txt1 = "在线咨询" source = {require('../../images/account/message.png')} onPress={this._goChat}/>
                    <AccountItem txt1 = "设置" source = {require('../../images/account/set.png')} onPress={this._goSetting}/>                    
                </ScrollView>
                <View style={styles.safeBottom}></View>
                <Alert
                    ref={(ref)=>this.alert = ref}
                    modalWidth={319}
                    modalHeight={180}
                    titleText="会员权益"
                    titleFontSize={16}
                    titleFontWeight={"bold"}
                    desText={this.state.member && this.state.member.level > 1 ? this.state.member.comments + '\n\n有效期：\n' +
                         this.state.member.validStart + '~' + this.state.member.validEnd : ''}
                    showCancelBtn={false}
                    okFontColor={'#4789F7'}
                />
            </View>
        );
    }  

    componentWillUnmount() {
        this.emitter.remove();
        this.navigationEmitter.remove();
        this.memberEmitter.remove();
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
        height: 200
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
    rightInfo: {
        position: 'absolute',
        justifyContent:'center',
        alignItems: 'center',
        height: 80,
        right: 20
    },
    memberBtnContainer: {
        backgroundColor: Colors.highlight,
        borderRadius: 10,
        alignItems: 'center',
        width: 80,
        height: 30,
    },
    memberBtn: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        height: 30,
        lineHeight: 30
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
