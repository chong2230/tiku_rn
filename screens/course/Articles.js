import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    StatusBar,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Common from '../../utils/Common';
import Colors from '../../components/Colors';
import { formatDate } from '../../utils/Util';
import Toast from '../../components/Toast';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;
const imgHeight = deviceW*640/1142;
const len = 160;
const basePx = 375;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

function px2dp(px) {
  return px *  deviceW / basePx
}

export default class Articles extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            order: 'DESC',
            listData: []
        };
    }

    componentWillMount() {
        pageNumber = 1;
        this._load();
        
    }

    _load = (order) => {
        if (!order) order = this.state.order;
        const { params } = this.props.navigation.state;
        let param = {
            order: order,
            columnId: params.columnId,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        Common.getArticles(param, (result)=>{
            if (result.code == 0) {
                let data = result.data || [];
                let list = data;
                // 兼容性写法，返回数据是数组时，取数组内容；否则取list的内容
                if (!Array.isArray(data)) {
                    list = data.list;     
                }
                hasMore = list.length == pageSize;
                
                let listData = this.state.listData;
                if (isLoading) {
                    for (let i in list) {
                        listData.push(list[i]);
                    }
                    isLoading = false;
                } else {
                    listData = list;                    
                }
                this.setState({
                    order: order,
                    listData: listData,
                    count: data.total || listData.length,
                });
            }
        });
    }

    delHtmlTag = (str) => {
        return str.replace(/\&nbsp;/g, " ").replace(/<[^>]+>/g,"");//去掉所有的html标记
    }

    _renderItem = (item) => {
        const { params } = this.props.navigation.state;
        let rowData = item.item;
        let headerImg, trialImg;
        if (rowData.image) {
            headerImg = <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + rowData.image}}
                    style={styles.img}/>;
        }
        if (params.hadSub || params.price == 0) {

        } else if (rowData.couldPreview) {
            trialImg = <Image resizeMode={'stretch'} source={require('../../images/article-trial.png')}
                    style={styles.trialImg}/>;
        } else {
            trialImg = <Image resizeMode={'stretch'} source={require('../../images/lock.png')}
                    style={styles.lockImg}/>;
        }
        return (
            <View style={styles.content}>
                <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData)}}>
                    <View style={styles.item}>
                        <Text style={styles.title}>{rowData.title}</Text>
                        <View style={styles.viewStyle}>
                            <Icon name="eye" size={px2dp(15)} color={rowData.had_viewed?Colors.gray:Colors.highlight} />
                            <Text style={styles.time}>{formatDate(rowData.gmtPublish)}</Text>
                        </View>
                        {trialImg}
                        {headerImg}
                        <Text numberOfLines={2} style={styles.summary}>{this.delHtmlTag(rowData.summary)}</Text>
                        <View style={styles.read}>
                            <Text style={styles.readLabel}>阅读全文</Text>
                            <Text style={styles.rightArrow}>&gt;</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    _onItemClick(data) {
        const { navigate, state } = this.props.navigation;
        if (!state.params.hadSub && !data.couldPreview) {
            this.refs.toast.show('订阅后才能阅读哦~');
        } else {
            navigate("Article", { columnId: state.params.columnId, id: data.id});    
        }        
    }

    _onSortClick = () => {
        let order;
        if (this.state.order == 'DESC') order = 'ASC';
        else order = 'DESC';
        this._load(order);
    }

    _header = () => {
        let orderTxt = this.state.order == 'DESC' ? '倒序' : '升序';
        let iconName = this.state.order == 'DESC' ? 'arrow-circle-o-down' : 'arrow-circle-o-up';
        return (
            <View style={styles.headerStyle}>
                <Bar />
                <TouchableOpacity style={styles.sort} onPress={this._onSortClick}>
                    <Icon name={iconName} size={px2dp(15)} color={Colors.gray} />
                    <Text style={styles.order}>{orderTxt}</Text>
                </TouchableOpacity>
                <Text style={styles.count}>|  已更新{this.state.count}篇</Text>
            </View>
        );
    }

    _footer = () => {
        return <Text style={{height:5,backgroundColor:'#ECEFF2'}}></Text>;
    }

    _separator = () => {
        return <View style={styles.separator} />;
    }

    refreshing = () => {
        pageNumber = 1;
        this._load();
    }

    _loadMore = () => {
        if (hasMore) {
            isLoading = true;
            pageNumber++;
            this._load();
        }
    }

    render() {        
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.list}
                    ref={(flatList)=>this._flatList = flatList}
                    keyExtractor={(item, index) => {return item.id.toString();}}
                    ListHeaderComponent={this._header}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    onRefresh={this.refreshing}
                    refreshing={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={
                        this._loadMore
                    }
                    data={this.state.listData}>
                </FlatList>
                <View style={styles.safeBottom}></View>
                <Toast ref="toast" position="center" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
    list: {
        flex:1,
        backgroundColor: 'white'
    },
    headerStyle: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        marginTop: 10,
        marginLeft: 10
    },
    sort: {
        flexDirection: 'row'
    },
    item: {
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'column',
        margin: 10
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10
    },
    viewStyle: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    time: {
        fontSize: 13,
        color: Colors.gray,
        margin: 10,
    },
    trialImg: {
        width: 24,
        height: 49,
        top: 10,
        right: 5,
        position: 'absolute'
    },
    lockImg: {
        width: 40,
        height: 40,
        top: 0,
        right: 0,
        position: 'absolute'
    },
    img: {
        width: deviceW-20,
        height: imgHeight,
        resizeMode: 'stretch'
    },
    summary: {
        color: Colors.gray,
        marginTop: 10
    },
    read: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    readLabel: {
        flex: 1,
        color: Colors.black
    },
    rightArrow: {
        right: 10,
        color: Colors.gray
    },
    order: {
        color: Colors.gray,
        marginLeft: 10
    },
    count: {        
        color: Colors.gray,
        marginLeft: 10
    },
    separator: {
        height: 5,
        backgroundColor:'#ECEFF2'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
