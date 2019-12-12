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
    Dimensions
} from 'react-native';

// import Orientation from 'react-native-orientation';
// import HTMLView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import HTMLView from '../../components/HTMLView';
import Colors from '../../components/Colors';
import Button from '../../components/Button';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import { formatDate, formatFullTime } from '../../utils/Util';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;
const imgHeight = deviceW*640/1142;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class Article extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            detail : {},    // 专栏详情
            data: {},       // 文章详情
            comments: []    // 评论
        };
        
    }

    componentWillMount() {
        //Orientation.lockToLandscape();
        const { params } = this.props.navigation.state;
        this._getColumnInfo();
        Common.getArticle(params.id, (result)=>{
            if (result.code == 0) {
                this.setState({
                    data : result.data
                });
            }
        });
        pageNumber = 1;
        this._load();
    }

    _getColumnInfo = () => {
        const { params } = this.props.navigation.state;
        Common.getColumnInfo(params.columnId, (result)=>{
            if (result.code == 0) {
                this.setState({
                    detail : result.data
                });
            }
        });
    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            articleId: params.id,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        Common.getComments(param, (result)=>{
            if (result.code == 0) {
                let list = result.data || [];
                hasMore = list.length == pageSize;
                let data = this.state.comments;
                if (isLoading) {
                    for (let i in list) {
                        data.push(list[i]);
                    }
                    isLoading = false;
                } else {
                    data = list;                    
                }
                this.setState({
                    comments : data
                });
            }
        });
    }

    _subscribe = () => {
        let self = this;
        Storage.get('token').then((val)=>{
            if (val) {
                self._goBalance();
            } else {
                self._goLogin();
            }
        });
    }

    _goLogin = () => {
        const { navigate } = this.props.navigation;
        navigate('Login', { isVisible: true, title: '密码登录', transition: 'forVertical'});
    }

    _goBalance = () => {
        const { navigate, state } = this.props.navigation;
        navigate('Balance', { isVisible: true, title: '结算台',
            detail: JSON.stringify(this.state.detail), columnId: state.params.columnId,
            callback: ()=>{
                this._getColumnInfo();
            }
        });   
    }

    // 文章点赞
    _addZan = () => {
        let self = this;
        let data = this.state.data;
        let type = data.hadLiked ? 0 : 1;
        Common.addZan(data.id, type, function(result) {
            if (result.code == 0) {
                data.hadLiked = data.hadLiked ? false : true;
                if (type == 0) data.likeCount--;
                else data.likeCount++;
                self.setState({
                    data: data
                })
            }
        })
    }

    // 文章留言
    _addComment = () => {
        let self = this;
        const { navigate } = this.props.navigation;
        navigate('Comment', { id: this.state.data.id, isVisible: true, refresh: () => {
            pageNumber = 1;
            self._load();
        }});
    }

    // 评论赞
    _zan = (comment) => {
        let self = this;
        let type = comment.hadLiked ? 0 : 1;
        Common.zanComment(comment.id, type, function(result) {
            if (result.code == 0) {
                comment.hadLiked = comment.hadLiked ? false : true;
                if (type == 0) comment.likeCount--;
                else comment.likeCount++;
                let comments = self.state.comments;
                for (let i in comments) {
                    if (comments[i].id == comment.id) {
                        comments[i] = comment;
                        break;
                    }
                }
                self.setState({
                    comments: comments
                });
            } else if (result.code == 2) {
                self._goLogin();
            }
        })
    }

    // 评论分享
    _share = () => {

    }

    _onScroll = (event) => {
        if(this.state.loadMore){
            this._loadMore();
            this.state.loadMore = false;
            return;
        }
        let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;        
        if(y+height>=contentHeight-20){
            this.setState({
                loadMore:true
            });
        }
    }

    _loadMore = () => {
        if (hasMore) {
            isLoading = true;
            pageNumber++;
            this._load();
        }
    }

    render() {
        let detail = this.state.detail;
        let data = this.state.data;
        let bottom;
        let comments = [];
        let headerView;
        if (data && data.image) {
            headerView = <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + data.image}}
                           style={styles.img}/>;
        }
        // 没有购买时，显示订阅按钮
        if (detail && !detail.hadSub && detail.price>0) {
            let subscribeTxt = '订阅￠' + detail.price + '  ';
            let otherText = detail.originalPrice != detail.price ? detail.originalPrice : null;
            bottom = (
                <View style={styles.bottom}>                    
                    <Button text={subscribeTxt} onPress={this._subscribe} 
                        style={styles.subscribeBtn} containerStyle={styles.subscribeContainer}
                        otherText={otherText} otherStyle={styles.otherTextStyle} />
                </View> 
            );
        } else if (global.token && detail && (detail.hadSub || detail.price == 0)) {
            let zanColor = data.hadLiked ? Colors.highlight : "#898989";
            bottom = (  
                <View style={styles.bottom2}> 
                    <View style={styles.iconItem}>
                        <Icon.Button
                          name="thumbs-o-up"
                          color={zanColor}
                          backgroundColor="white"
                          size={20}
                          marginLeft={8}
                          onPress={this._addZan}
                          >
                        </Icon.Button>           
                        <Text style={[styles.iconTxt, {color: zanColor}]}>{data.likeCount}</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Icon.Button
                          name="commenting-o"
                          color="#898989"
                          backgroundColor="white"
                          size={20}
                          marginLeft={8}
                          onPress={this._addComment}
                          >
                        </Icon.Button>                 
                        <Text style={styles.iconTxt}>留言</Text>
                    </View>
                </View>
            );
        }
        for (let i=0; i<this.state.comments.length; i++) {
            let c = this.state.comments[i];
            let replies;
            if (c.replies) {
                replies = (
                    <View>
                        <View>
                            <Text>作者回复</Text>
                        </View>
                        <Text>{c.replies.content}</Text>
                        <Text>{formatFullTime(c.replies.gmtCreate)}</Text>
                    </View>
                );
            }
            let commentZanColor = c.hadLiked ? Colors.highlight : "#898989";
            let avatarImage;
            if (c.userHeader) {
                avatarImage = <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + c.userHeader}}
                           style={styles.avatarImage}/>;
            } else {
                avatarImage = <Image resizeMode={'stretch'} source={require('../../images/avatar.jpg')}
                           style={styles.avatarImage}/>;
            }
            let comment = (
                <View key={i+1} style={styles.comment}>
                    {avatarImage} 
                    <View style={styles.commentRight}>
                        <View style={styles.commentRow}>
                            <Text style={styles.commentName}>{c.userName}</Text>
                            <Icon.Button
                              name="share-square-o"
                              color="#898989"
                              backgroundColor="white"
                              size={15}
                              right={5}
                              onPress={(c)=>{this._share}}
                              >
                            </Icon.Button>                 
                            <Icon.Button
                              name="thumbs-o-up"
                              color={commentZanColor}
                              backgroundColor="white"
                              size={15}
                              right={10}
                              onPress={()=>this._zan(c)}
                              >
                            </Icon.Button>
                            <Text style={styles.commentLikes}>{c.likeCount}</Text>
                        </View>
                        <Text style={styles.commentContent}>{c.content}</Text>
                        <Text style={styles.commentTime}>{formatFullTime(c.gmtCreate)}</Text>
                    </View>
                </View>
            );
            comments.push(comment);
        }
        return (
            <View style={styles.container}>
                <ScrollView 
                        style={styles.scrollView}
                        onScroll={this._onScroll.bind(this)}
                        scrollEventThrottle={50}>
                    <Bar />

                    <Text numberOfLines={2} style={styles.title}>{data.title}</Text>
                    <View style={styles.viewStyle}>
                        <Text style={styles.time}>{formatDate(data.gmtPublish)}</Text>
                        <Text style={styles.authorName}>{data.author}</Text>
                    </View>
                    {headerView}                   
                    <HTMLView value={data.content || ''} style={styles.htmlStyle} />                    
                    <Text style={{height: 10}}></Text>
                    <View style={styles.comments}>
                        <Text style={styles.commentTitle}>精选留言</Text>
                        {comments}
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
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
        marginLeft: 10
    },
    viewStyle: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        height: 20,
        marginLeft: 10
    },
    time: {
        fontSize: 13,
        color: Colors.gray,
        // margin: 10
    },
    authorName: {
        fontSize: 13,
        color: Colors.gray,
        marginLeft: 10
    },
    img: {
        width: deviceW-20,
        height: imgHeight,
        resizeMode: 'stretch'
    },    
    htmlStyle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white'
    },    
    bottom: {
        flexDirection: 'row'
    },
    subscribeContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.highlight,
        width: deviceW - 20,
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
    otherTextStyle: {
        fontSize: 14,
        color: '#f4cca5',
        textDecorationLine: 'line-through',
        width: 60,
        textAlign: 'center'
    },
    comments: {
        backgroundColor: Colors.white
    },
    commentTitle: {
        textAlign: 'center',
        fontSize: 15,
        color: Colors.gray,
        margin: 10
    },
    comment: {
        flexDirection: 'row'
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        left: 10,
        top: 10
    },
    commentRight: {
        flexDirection: 'column',
        width: deviceW - 80,
        left: 20
    },
    commentRow: {
        flex: 1,
        flexDirection: 'row',
        width: deviceW - 80
    },
    commentName: {
        flex: 1,
        width: deviceW - 120,
        fontSize: 13,
        color: Colors.gray,
        top: 10
    },
    commentLikes: {
        fontSize: 13,
        color: Colors.highlight,
        top: 8,
        right: 20
    },
    commentContent: {
        fontSize: 13,
        color: Colors.black,
        width: deviceW - 95
    },
    commentTime: {
        fontSize: 11,
        color: Colors.gray,
        marginTop: 5,
        marginBottom: 10
    },
    bottom2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height: 50
    },
    iconItem: {
        flexDirection: 'column', 
        width: deviceW/2, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    iconTxt: {
        color: Colors.gray,
        bottom: 2
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
