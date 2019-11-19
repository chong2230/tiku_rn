import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // Button,
    Image,
    View,
    ScrollView,
    StatusBar,
    Alert,
    WebView,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';

// import Orientation from 'react-native-orientation';
// import HTMLView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';

import HTMLView from '../../components/HTMLView';
import Button from '../../components/Button';
import Colors from '../../components/Colors';
import VideoPlayer from '../../components/VideoPlayer';
import Common from '../../utils/Common';
import { formatDate } from '../../utils/Util';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class ColumnDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            detail : {},
            latest : []
        };
        
    }

    componentWillMount() {
        // Orientation.lockToLandscape();
        this._getColumnInfo();
        pageNumber = 1;
        this._load();
    }

    _getColumnInfo = () => {
        let self = this;
        const { params } = this.props.navigation.state;
        Common.getColumnInfo(params.id, (result)=>{
            if (result.code == 0) {
                self.setState({
                    detail : result.data
                });
            }
        });
    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            columnId: params.id,
            order : 'DESC',
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        Common.getLatest(param, (result)=>{
            if (result.code == 0) {

                let data = result.data || [];
                let list = data;
                // 兼容性写法，返回数据是数组时，取数组内容；否则取list的内容
                if (!Array.isArray(data)) {
                    list = data.list;     
                }
                hasMore = list.length == pageSize;
                
                let listData = this.state.latest;
                if (isLoading) {
                    for (let i in list) {
                        listData.push(list[i]);
                    }
                    isLoading = false;
                } else {
                    listData = list;                    
                }
                this.setState({
                    latest: listData
                });
            }
        });
    }

    _onOrientationChanged = (isFullScreen) => {
        // if (isFullScreen) {
        //     Orientation.lockToPortrait();
        // } else {
        //     Orientation.lockToLandscape();
        // }
    }

    _onClickBackButton = () => {
        this.props.navigation.goBack();
    }

    _onLayoutChange = (event) => {
        let {x, y, width, height} = event.nativeEvent.layout;
        let isLandscape = (width < height);
        console.log('_onLayoutChange width: ' + width + ', height: ' + height + ', isLandscape: ' + isLandscape);
        if (isLandscape) {
            this.setState({
                isFullScreen: true,
            });
            this.videoPlayer.updateLayout(width, height, true);
        } else {
            this.setState({
                isFullScreen: false
            });
            this.videoPlayer.updateLayout(width, width * 9/16, false);
        }
        //Orientation.unlockAllOrientations();
    }

    // 免费试读
    _readFree = () => {
        let detail = this.state.detail;
        const { navigate } = this.props.navigation;
        navigate('Articles', { isVisiable: true, title: detail.title, columnId: detail.id, hadSub: detail.hadSub, price: detail.price, transition: 'forVertical'});
    }

    // 开始学习
    _startRead = () => {
        let detail = this.state.detail;
        const { navigate, state } = this.props.navigation;
        navigate("Articles", {isVisible: true, title: detail.title, columnId: detail.id, hadSub: detail.hadSub, price: detail.price});
    }

    _subscribe = () => {
        if (global.token) {
            this._goBalance();
        } else {
            this._goLogin();
        }
    }

    _goLogin = () => {
        const { navigate } = this.props.navigation;
        navigate('Login', { isVisiable: true, title: '密码登录', transition: 'forVertical', callback: ()=>{
                this._getColumnInfo();
            }});
    }

    _goBalance = () => {
        const { navigate, state } = this.props.navigation;
        navigate('Balance', { isVisiable: true, title: '结算台', 
            detail: JSON.stringify(this.state.detail), columnId: this.state.detail.id, 
            type: state.params.type, callback: ()=>{
                this._getColumnInfo();
            }});   
    }

    render() {
        let detail = this.state.detail;
        let mediaView;
        if (detail.videoUrl) {
            mediaView = (
                <View onLayout={this._onLayoutChange}>                                                                      
                    <VideoPlayer
                        ref={(ref) => this.videoPlayer = ref}
                        videoURL={Common.baseUrl + detail.videoUrl}
                        // videoTitle={this.params.title}
                        videoCover={Common.baseUrl + detail.videoCover}
                        onChangeOrientation={this._onOrientationChanged}
                        onTapBackButton={this._onClickBackButton}
                    />
                </View>                
            );
        } else {
            let headerImg;
            if (detail.coverImage) headerImg = <Image source={{uri:Common.baseUrl + detail.coverImage}} style={styles.headerImg} />;
            mediaView = (
                <View style={{height: 200}}>
                    {headerImg}
                    <TouchableOpacity style={styles.backButton} onPress={this._onClickBackButton}>
                        <Image
                          source={require('../../images/icon_back.png')}
                          style={{width: 35, height: 35}}
                        />
                    </TouchableOpacity> 
                </View>
            );
        }
        let orderNumTxt = detail.price > 0 ? detail.orderNum + "人购买" : '';

        // let subscribeTxt = '加入学习￠' + detail.price;
        let bottom;
        let subscribeTxt;
        let otherText = detail.originalPrice != detail.price ? detail.originalPrice : null;
        // 没有购买时，显示订阅按钮。价格为0时，直接阅读
        if (detail && !detail.hadSub && detail.price>0) {
            subscribeTxt = '订阅￠' + detail.price + '  ';
            bottom = (                
                <View style={styles.bottom}>
                    <Button text="免费试读" onPress={this._readFree} 
                        style={styles.readBtn} containerStyle={styles.readContainer} />
                    <Button text={subscribeTxt} onPress={this._subscribe} 
                        style={styles.subscribeBtn} containerStyle={styles.subscribeContainer}
                        otherText={otherText} otherStyle={styles.otherTextStyle} />
                </View>
            );
        } else {
            bottom = (                
                <View style={styles.bottom}>                    
                    <Button text="开始学习" onPress={this._startRead} 
                        style={styles.subscribeBtn} containerStyle={[styles.subscribeContainer, styles.startContainer]} />
                </View>
            );
        }
        let latestView = [];
        for (let i=0; i<this.state.latest.length; i++) {
            let d = this.state.latest[i];
            let item = (
                <View key={d.id} style={styles.latestItem}>
                    <View style={styles.latestTop}>
                        <Icon
                          name="hand-o-right"
                          color={Colors.highlight}
                          backgroundColor="white"
                          size={15}
                          >
                        </Icon>  
                        <Text style={styles.latestItemTitle}>{d.title}</Text>
                    </View>
                    <Text style={styles.latestCtime}>{formatDate(d.gmtPublish)}</Text>
                    <Text numberOfLines={1} style={styles.latestSummary}>{d.summary}</Text>
                </View>
            );
            latestView.push(item);
        }
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <StatusBar
                        animated={true}
                        hidden={false}
                        backgroundColor={'black'}
                        translucent={true}
                        barStyle={'light-content'}>
                    </StatusBar> 
                    {mediaView}                        
                    <View style={styles.author}>
                        <View style={styles.authorAvatar}>
                            <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + detail.authorAvatarImage}}
                                style={styles.avatarImage}/>
                        </View>
                        <View style={styles.authorInfo}>
                           <Text style={styles.authorName}>{detail.authorName}</Text>
                           <Text style={styles.authorHonor}>{detail.authorTitle}</Text> 
                        </View>
                        <Text style={styles.subCount}>{orderNumTxt}</Text>
                    </View>
                    <HTMLView value={detail.content || ''} style={styles.htmlStyle} /> 
                    <View style={styles.latest}>
                        <Text style={styles.latestTitle}>最近更新</Text>
                        {latestView}
                    </View>                   
                </ScrollView>
                {bottom}
                <View style={styles.safeBottom}></View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        backgroundColor: '#ECEFF2'
    },
    header: {
        backgroundColor:'white',
        width: deviceW,
        height: 55
    },
    headerTitle : {
        width: deviceW,
        height: 30,
        marginTop: 25,
        fontSize: 20,
        color: 'black',
        fontWeight: '400',
        textAlign: 'center'
    },
    headerImg: {
        width: deviceW,
        height:200,
        justifyContent:'center',
        alignItems:'center'
    },
    backButton: {
        position:'absolute',
        top: 10,
        left: 10,
        flexDirection:'row',
        width: 44,
        height: 44,
        alignItems:'center',
        justifyContent:'center',
        // marginLeft: 10
    },
    author: {
        width: deviceW,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: Colors.highlight,//'#ff5a05',
        borderWidth: 1,
        backgroundColor: 'white',
        flexShrink: 0,
        justifyContent: 'center'
    },
    avatarImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        left: 1
    },
    authorInfo: {
        width: deviceW-150,
        marginTop: 5,
        marginLeft: 10
    },
    authorName: {
        fontSize: 13,
        color: 'black',
        textAlign: 'left'
    },
    authorHonor: {
        fontSize: 13,
        color: '#828282',
    },
    subCount: {
        fontSize: 13,
        color: '#828282',
        flex: 1
    },
    htmlStyle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white'
    },
    latest: {
        marginTop: 10,
        backgroundColor: 'white'  
    }, 
    latestTitle: {
        fontSize: 20, 
        fontWeight: '500',
        margin: 10
    },
    latestItem: {
        marginLeft: 10
    },
    latestTop: {
        marginTop: 10,
        flexDirection: 'row',
    },
    latestItemTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 10
    },
    latestCtime: {
        marginTop: 6,        
        fontSize: 13,
        color: '#828282'
    },
    latestSummary: {
        marginTop: 6,
        marginBottom: 5,
        fontSize: 13,
        color: '#828282'
    },
    bottom: {
        flexDirection: 'row'
    },
    readContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: 'white',
        width: deviceW/3 - 20,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    readBtn: {        
        color: Colors.highlight,
        fontSize: 16,
        textAlign: 'center',
    },
    subscribeContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.highlight,
        width: deviceW * 2 / 3 - 20,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subscribeBtn: {        
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    startContainer: {
        width: deviceW - 20
    },
    otherTextStyle: {
        fontSize: 14,
        color: '#f4cca5',
        textDecorationLine: 'line-through',
        width: 60,
        textAlign: 'center'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});