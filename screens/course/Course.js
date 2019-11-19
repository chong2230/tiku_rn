/**
 * Created by cluo on 2017/12/20.
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // Button,
    MenuButton,
    Image,
    Alert,
    View,
    StatusBar,
    ScrollView,
    ListView,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
// import Orientation from 'react-native-orientation';
import * as RNIap from 'react-native-iap';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import ViewPager from '../../components/ViewPager';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import { removeReceipt } from '../../utils/Util';
import News from "../news/News";
import {TabbarSafeBottomMargin} from "../../utils/Device";
// import HomeNews from './homeNews';

const deviceW = Dimensions.get('window').width;
const bannerHeight = deviceW*180/375;
const BANNER_IMGS = [];
const len = 160;
const subjectWidth = 300;
const mallWidth = 100;
const microWidth = 100; // 微课
const hotWidth = 150;
const hotHeight = hotWidth*156/292;

export default class Course extends React.Component {

    // 构造
    constructor(props) {
        super(props);

        let dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2
        });
        this._onItemClick = this._onItemClick.bind(this);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // 实际的DataSources存放在state中
        this.state = {
            selectedNews: 0,
            dataSource: null,//dataSource.cloneWithPages(BANNER_IMGS),
            listData: []
        }
    }

    componentWillMount() {
        let self = this;
        // Orientation.lockToPortrait();
        Storage.get('token').then((val)=>{
            if (val) {
                global.token = val;
            }
        });        
        this._load();               
    }

    /*async*/ componentDidMount() {
        let self = this;
        this.timer = setInterval(() => {
            self._load();
        }, 5000); 

        // 漏单处理
        this.checkLeakList();
    }

    // 漏单处理
    checkLeakList = () => {
        let self = this;
        Storage.get('iap_receipts').then((val)=>{
            // console.log('----------checkLeakList receipts---------- ', val);
            if (val) {
                let receiptsArr = val.split(',');  
                self.checkPurchase(receiptsArr[0]);
            }
        });        
    }

    checkPurchase = (receipt) => {
        let self = this;
        Common.checkPurchase(receipt, (result) => {
            console.log('checkPurchase ', result);
            if (result.code == 0 || result.code == -1) {
                removeReceipt(receipt, self.checkLeakList); // 移除凭证后，继续处理漏单
            } else {
                console.log(result.msg);
            }
        }).catch(error => { 
            console.log(error.toString()); 
        }) 
    }

    _load = () => {
        Common.getBanners((result)=>{
            if (result.code == 0) {
                this.timer && clearInterval(this.timer);
                var dataSource = new ViewPager.DataSource({
                    pageHasChanged: (p1, p2) => p1 !== p2
                });
                this.setState({
                    dataSource: dataSource.cloneWithPages(result.data),
                })
            }
        });
        Common.getHomeList((result)=>{
            if (result.code == 0) {
                this.timer && clearInterval(this.timer);
                this.setState({listData: result.data});
            }            
        });
    }

    _renderPage(data, pageID) {
        return (
            <TouchableWithoutFeedback
                style={styles.banner}
                onPress={() => this._onBannerClick(data, pageID)}>
                    <Image
                        source={{uri : Common.baseUrl + data.image}}
                        style={styles.page} />
            </TouchableWithoutFeedback>
        );
    }

    _onBannerClick = (data, pageID) => {
        this._onItemClick(data.columnId);
    }

    // id: 专栏id
    _onItemClick(id) {
        const { navigate } = this.props.navigation;
        navigate("ColumnDetail", {id: id, isVisible: false});        
    }

    refreshing = () => {
        this._load();
    }

    _loadMore = () => {
        
    }

    _renderItem = (item) => {
        let data = item.item;
        for (let i=0; i<data.contents.length; i++) {
            data.contents[i].key = '' + (i+1);
        }
        // type 对应：1. 新闻资讯类 2. 文章水平展示类（原专题） 3. 文章垂直展示类（原课程）
        switch (data.type) {
            case 1:
                return this._renderNews(data);
            case 2:
                return this._renderHorizontal(data);
            case 3:
                return this._renderVertical(data);
            default:
                return this._renderVertical(data);    
        }
    }

    _getTitleBar = (item) => {
        let btnTxt = "查看全部 >";
        return (
            <View style={styles.titleBar}>
                <Text style={styles.title}>{item.title}</Text>
                <Button text={btnTxt} onPress={()=>this._viewAll(item)} style={styles.viewAll}></Button>
            </View>
        );
    }

    _renderNews = (item) => {
        return null;
        // return (
        //     <View style={styles.contents}>
        //         {this._getTitleBar(item)}
        //         <CourseNews item={item} navigation={this.props.navigation} />
        //     </View>
        // );
    }

    _renderHorizontal = (item) => {
        return (
            <View style={styles.contents}>
                {this._getTitleBar(item)}
                <FlatList 
                    style={styles.list}
                    renderItem={this._renderHorizontalItem}
                    onRefresh={this.refreshing}
                    refreshing={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}                
                    data={item.contents}>
                </FlatList>
            </View>
        );
    }

    _renderHorizontalItem = (item) => {
        let rowData = item.item;
        let price = rowData.price > 0 ? '￠ ' + rowData.price + ' / ' : '';
        let period = rowData.period > 0 ? rowData.period + '期' : '';
        let authorTitle = rowData.authorTitle ? ' | ' + rowData.authorTitle : '';
        return (
            <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData.id)}}>
                <View style={styles.subjectItem}>
                    <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + rowData.coverImage}}
                           style={styles.subjectImg}/>
                    <View style={styles.subjectMask}></View>
                    <Text numberOfLines={2} style={styles.subjectTitle}>{rowData.articleTitle}</Text>
                    {rowData.isNew ? <Image source={require('../../images/discover-icon-new.png')} style={styles.newIcon} /> : null }
                    <View style={styles.subjectInfo}>
                       <Text style={[styles.name, styles.subjectName]}>{rowData.title}</Text>
                       <Text style={[styles.cost, styles.subjectCost]}>{price}{period}</Text> 
                    </View>
                    <Text numberOfLines={2} style={styles.description}>{rowData.subtitle}</Text>
                    <View style={styles.subjectAuthor}>
                        <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + rowData.authorAvatarImage}}
                               style={styles.avatarImage}/>
                       <Text style={styles.authorName}>{rowData.authorName}</Text>
                       <Text style={styles.authorHonor}>{authorTitle}</Text> 
                    </View>
                </View>
                
            </TouchableWithoutFeedback>
        );
    }

    _renderVertical = (item) => {
        return (
            <View style={styles.contents}>
                {this._getTitleBar(item)}
                <FlatList 
                    style={styles.list}
                    renderItem={this._renderVerticalItem}
                    onRefresh={this.refreshing}
                    refreshing={false}                    
                    data={item.contents}>
                </FlatList>
            </View>
        );
    }

    _renderVerticalItem = (item) => {
        let rowData = item.item;
        let price = rowData.price > 0 ? '￠ ' + rowData.price + ' / ' : '';
        let period = rowData.period > 0 ? rowData.period + '期' : '';
        let authorTitle = rowData.authorTitle ? ' | ' + rowData.authorTitle : '';        
        return (
            <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData.id)}}>
                <View style={styles.courseItem}>
                    <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + rowData.image}}
                           style={styles.courseImg}/>
                    <View style={styles.courseInfo}>
                        <Text style={styles.name}>{rowData.title}</Text>                    
                        <Text numberOfLines={2} style={styles.description}>{rowData.subtitle}</Text>
                        <View style={styles.authorInfo}>
                           <Text style={[styles.authorName, {color: '#828282'}]}>{rowData.authorName}</Text>
                           <Text style={styles.authorHonor}>{authorTitle}</Text> 
                        </View>
                        <View style={styles.courseBottom}>
                            <Text style={styles.period}>{period}</Text> 
                            <Text style={[styles.cost, {marginTop: 20}]}>{price}</Text> 
                        </View>
                    </View>
                </View>
                
            </TouchableWithoutFeedback>
        );
    }

    _header = () => {
        let headerView;
        if (this.state.dataSource) {
            headerView = <ViewPager
                    dataSource={this.state.dataSource}
                    renderPage={this._renderPage.bind(this)}
                    initialPage={1}
                    isLoop={true}
                    autoPlay={true}/>;
        }
        return (
            <View style={styles.banner}>
                {headerView}
            </View>
        );
    }

    _footer = () => {
        return <Text style={{height:65,backgroundColor:'#ECEFF2'}}></Text>;
    }

    _separator = () => {
        return <View style={{height:10,backgroundColor:'#ECEFF2'}}/>;
    }

    _viewAll = (item) => {
        const { navigate } = this.props.navigation;
        switch (item.type) {
            case 1:
                navigate("News", {isVisible: true, category: item.category, title: item.title});
                break;
            default:
                navigate("Column", {isVisible: true, category: item.category, title: item.title});
                break;                
        }
    }

    componentWillUnmount() {
      // RNIap.endConnection();
      this.timer && clearInterval(this.timer);
    }

    render() {        
        return (
            <View styles={styles.container}>
                <Bar />
                <Header title="课程" leftBtnIsHidden={true}></Header>
                <FlatList 
                    style={styles.list}
                    ref={(flatList)=>this._flatList = flatList}
                    keyExtractor={(item, index) => {return '' + index}}
                    ListHeaderComponent={this._header.bind(this)}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    onRefresh={this.refreshing}
                    refreshing={false}
                    onEndReachedThreshold={0}
                    onEndReached={
                        this._loadMore
                    }
                    data={this.state.listData}>
                </FlatList>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }
}

Course.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        // flex: 1
        // flexDirection: 'column'
    },
    list: {
        backgroundColor:'#ECEFF2',
    },    
    banner: {
        flex: 1,
        width: deviceW,
        height: bannerHeight,
    },
    page: {
        flex: 1,
        height: bannerHeight,
        resizeMode: 'stretch'
    },
    contents: {
        // marginTop: 20,
        backgroundColor: 'white',  
        // flexDirection: 'column'      
    },
    titleBar: {
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        margin: 5,
        flexDirection: 'row'
    },
    title: {
        flexWrap: 'wrap',
        fontSize: 18,
        color: 'black',
        flex: 1,
        marginTop: 8,
        marginLeft: 8,
        height: 30,
    },
    viewAll: {
        marginTop: 10,
        marginRight: 10,
        color: '#a4a4a4',
        fontSize: 13
    },
    subjectItem: {
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    subjectTitle: {
        position: 'absolute',
        width: subjectWidth,
        top: 45,
        color: 'white',
        textAlign: 'center',
        fontSize: 16
    },
    subjectImg: {
        width: subjectWidth,
        height: 100,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },    
    subjectMask: {
        width: subjectWidth,
        height: 100,
        backgroundColor: 'black',
        opacity: .6,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: 'absolute',
        top: 0,
        left: 0
    },
    newIcon: {
        width: 19,
        height: 21,
        position: 'absolute',
        top: 10,
        left: 10
    },
    subjectInfo: {
        width: subjectWidth - 20,
        // marginLeft: 10,
        flexDirection: 'row'
    },
    subjectName: {
        flex: 1,
        fontSize: 15
    },
    subjectAuthor: {
        flexDirection: 'row',
        height: 50,
        margin: 10,
        paddingTop: 15,
        borderTopColor: '#e0e0e0',
        borderTopWidth: .5
    },
    subjectCost: {
        marginTop: 10,
        fontSize: 15
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    authorName: {
        fontSize: 13,
        color: 'black',
        marginTop: 10,
        marginLeft: 10
    },
    authorHonor: {
        fontSize: 13,
        color: '#828282',
        marginTop: 10,
        // marginLeft: 10
    },
    courseItem: {
        marginTop: 10,
        flexDirection: 'row'
    },
    courseImg: {
        marginLeft: 10,
        width: 120,
        height: 130,
    },
    courseInfo: {
        // marginLeft: 10
    },
    courseBottom: {
        flexDirection: 'row', 
        width: deviceW - 130
    },
    authorInfo: {
        flexDirection: 'row',
    },
    mallBox: {
        width: mallWidth,
        height: mallWidth,
        backgroundColor: 'white',
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 5,
        borderColor: '#e0e0e0',
        borderWidth: 1
    },
    mallImg: {
        width: mallWidth -20,
        height: mallWidth - 20,
        top: 10,
        left: 15
    },
    mallName: {
        width: mallWidth,
        fontSize: 12
    },
    microImg: {
        width: microWidth,
        height: microWidth,
        left: 10
    },
    microBottom: {
        flexDirection: 'row', 
        width: deviceW - microWidth - 10
    },
    hotItem: {
        marginLeft: 10
    },
    hotImg: {
        borderRadius: 8,
        width: hotWidth,
        height: hotHeight
    },
    videoItem: {
        marginLeft: 10
    },
    videoImg: {
        width: hotWidth,
        height: hotHeight
    },
    videoName: {
        width: hotWidth,
        fontSize: 13
    },
    item: {
        flex:1,
        alignItems:'flex-start'
    },
    img: {
        width:len,
        height:len
    },
    name: {
        flexWrap: 'wrap',
        // flex: 1,
        fontSize: 15,
        color: 'black',
        marginTop: 8,
        marginLeft: 10,
        height: 30,
    },
    description: {
        fontSize: 13,
        color: '#828282',
        marginLeft: 10
    },
    period: {
        flex: 1,
        fontSize: 13,
        color: '#828282',
        marginTop: 20,
        marginLeft: 10
    },
    cost: {
        fontSize: 12,
        color: Colors.highlight,
        marginLeft: 10,
        marginRight: 10
    },
    playBtn: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: hotHeight/2 - 20,
        left: hotWidth/2 - 20
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
