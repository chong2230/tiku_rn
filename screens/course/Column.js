/**
 * Created by cluo on 2017/12/20.
 */
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
    Dimensions
} from 'react-native';

// import Orientation from 'react-native-orientation';

import Bar from '../../components/Bar';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const emptyHeight = deviceW/deviceH * 289;
const emptyOffset = 120;
const len = 240;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class Column extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            headerImg: '',
            listData: []
        };
    }

    componentWillMount() {
        // Orientation.lockToPortrait();
        pageNumber = 1;
        this._load();
    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            category: params.category,
            pageNumber: pageNumber,
            pageSize: pageSize,
            from: params.from
        }
        Common.getColumnList(param, (result)=>{
            if (result.code == 0) {
                let list = result.data.list || [];
                hasMore = list.length == pageSize;
                let data = this.state.listData;
                if (isLoading) {
                    for (let i in list) {
                        data.push(list[i]);
                    }
                    isLoading = false;
                } else {
                    data = list;                    
                }
                this.setState({
                    headerImg: result.data.headerImg,
                    listData: data
                });
            }            
        })
    }

    _renderItem = (item) => {
        let rowData = item.item;
        let price = rowData.price > 0 ? '￠ ' + rowData.price + ' / ' : '';
        let period = rowData.period > 0 ? rowData.period + '期' : '';
        let orderNumTxt = rowData.price > 0 ? rowData.orderNum + "人购买" : '';
        return (
            <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData.id)}}>
                <View style={styles.item}>                    
                    <View style={styles.info}>
                        <View style={styles.author}>
                            <View style={styles.authorAvatar}>
                                <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + rowData.authorAvatarImage}}
                                    style={styles.avatarImage}/>
                            </View>
                            <View style={styles.authorInfo}>
                               <Text style={styles.authorName}>{rowData.authorName}</Text>
                               <Text style={styles.authorHonor}>{rowData.authorTitle}</Text> 
                            </View>
                        </View>
                        <Text style={styles.name}>{rowData.title}</Text>                    
                        <Text numberOfLines={2} style={styles.description}>{rowData.subTitle}</Text>
                        
                        <View style={styles.saleInfo}>
                            <Text style={styles.cost}>{price}{period}</Text> 
                            <Text style={styles.subCount}>{orderNumTxt}</Text> 
                            <Text style={styles.updateFrequency}>{rowData.updateTag}</Text> 
                        </View>
                    </View>
                    <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + rowData.image}}
                           style={styles.img}/>
                </View>
                
            </TouchableWithoutFeedback>
        );
    }

    _onItemClick(id, name) {
        const { navigate } = this.props.navigation;
        navigate("ColumnDetail", {id: id, isVisible: false});
    }

    _header = () => {
        let header = null;
        if (this.state.headerImg) {
            header = (
                <View>
                    <Image source={{uri: Common.baseUrl + this.state.headerImg}} style={styles.headerImg} />
                </View>
            );
        }
        return header;
    }

    // 空布局 from='purchase'，为已购
    _renderEmptyView = () => {
        const { params } = this.props.navigation.state;
        let emptyLabel = params.from == 'purchase' ? '暂无购买' : '空空如也';
        return <View style={{height: this.state.flatHeight, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../images/empty/empty-bought.png')} resizeMode={'contain'} style={{width: deviceW, height: emptyHeight, top: 120}} />
            <Text style={{marginTop: 105, marginBottom: 10}}>{emptyLabel}</Text>
        </View>
    }

    _footer = () => {
        return <Text style={{height:25,backgroundColor:'white'}}></Text>;
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
                <Bar />
                <FlatList 
                    style={styles.list}
                    ref={(flatList)=>this._flatList = flatList}
                    keyExtractor={(item, index) => {return item.id.toString();}}
                    ListHeaderComponent={this._header}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    ListEmptyComponent={ this._renderEmptyView }
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
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F8F8F8'
    },
    list: {
        backgroundColor: 'white'
    },
    separator: {
        height: 5,
        backgroundColor:'#ECEFF2'
    },
    item: {
        flexDirection: 'row',
        position: 'relative'
    },
    info: {
        margin: 10,
        flexWrap: 'wrap',
    },
    img: {
        width: 91,
        height: 87,
        marginTop: 17.5,
        backgroundColor: '#f5f5f5',
        right: 20,
        position: 'absolute'
    },
    name: {
        width: len,
        flexWrap: 'wrap',
        fontSize: 15,
        color: 'black',
        marginTop: 8,
        marginLeft: 10,
        height: 20
    },
    description: {
        fontSize: 12,
        color: '#828282',
        marginLeft: 10
    },
    author: {
        width: len,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
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
    saleInfo: {
        width: deviceW,
        flexDirection: 'row',
        marginTop: 10
    },
    cost: {
        color: Colors.highlight,
        fontSize: 15,
        marginLeft: 10
    },
    subCount: {
        fontSize: 12,
        color: '#828282',
        marginLeft: 60,
        marginTop: 3
    },
    updateFrequency: {
        fontSize: 12,
        color: '#828282',
        right: 30,
        marginTop: 3,
        position: 'absolute'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
