/**
 * Created by cluo on 2017/12/20.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    FlatList,
    StatusBar,
    TouchableWithoutFeedback,
    Dimensions, DeviceEventEmitter
} from 'react-native';

// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import Bar from '../../components/Bar';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import {formateMinSec, formatDate} from '../../utils/Util';
import { TabbarSafeBottomMargin } from '../../utils/Device';

const deviceW = Dimensions.get('window').width;
// const len = 280;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class News extends Component<{}> {
    
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            headerImg: '',
            listData: [],
            showAudio: false
        };
    }

    componentWillMount() {
        let self = this;
        pageNumber = 1;
        this._load();
        this.navigationEmitter = DeviceEventEmitter.addListener('navigationStateChange', (data) => {
            self._load();
        });
    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            // category: params.category,
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        Common.getNews(param, (result)=>{
            if (result.code == 0) {
                let list = result.data.list || result.data || [];
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
        return (
            <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData)}}>
                <View style={styles.item}>                    
                    <View style={styles.info}>                        
                        <Text numberOfLines={2} style={styles.title}>{rowData.name}</Text>  
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.publisher}>{rowData.publisher}</Text>
                            <Text style={styles.createTime}>{rowData.publishTime}</Text>
                        </View>                                                                  
                    </View>   
                    <Image source={require('../../images/icon_right.png')} style={styles.rightIcon} />              
                </View>
                
            </TouchableWithoutFeedback>
        );
    }

    _onItemClick(data) {
        console.log('news onItemClick');
        const { navigate } = this.props.navigation;
        navigate("NewsDetail", { id: data.id, type: data.type, isVisible: true });
    }

    _fetchDetail = () => {
        console.log('fetch detail');
    }

    _handle = () => {
        console.log('handle');
    }

    _header = () => {
        let headerView;
        if (this.state.headerImg) {
            headerView = <Image source={{uri: Common.baseUrl + this.state.headerImg}} style={styles.headerImg} />;
        } else {
            headerView = <Image source={require("../../images/news-header.jpg")} style={styles.headerImg} />;
        }
        return (
            <View>
                {headerView}
            </View>
        );
    }

    _footer = () => {
        return <Text style={{height:5,backgroundColor:'#ECEFF2'}}></Text>;
    }

    _separator = () => {
        return <View style={styles.separator} />;
    }

    _onRefresh = () => {
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
                {/*<Bar />*/}
                <FlatList 
                    style={styles.list}
                    ref={(flatList)=>this._flatList = flatList}
                    keyExtractor={(item, index) => {return item.id.toString();}}
                    ListHeaderComponent={this._header}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    onRefresh={this._onRefresh}
                    refreshing={false}
                    // progressViewOffset={50}
                    onEndReachedThreshold={0.2}
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

News.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor:'#6B6E80'
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
    list: {
        backgroundColor:'white'
    },
    headerImg: {
        width: deviceW,
        height: 200,
        justifyContent:'center',
        alignItems:'center'
    },
    separator: {
        height: 5,
        backgroundColor:'#ECEFF2'
    },
    item: {
        height: 60,
        flexDirection: 'row'
    },
    info: {
        marginTop: 10,
        flexWrap: 'wrap',
    },
    title: {
        width: deviceW - 40,
        flexWrap: 'wrap',
        fontSize: 15,
        color: 'black',
        marginLeft: 10,
        marginBottom: 5,
        height: 20
    },
    publisher: {
        fontSize: 13,
        color: '#828282',
        marginLeft: 10
    },
    createTime: {
        fontSize: 13,
        color: '#828282',
        marginLeft: 10
    },    
    rightIcon: {
        width: 10,
        height: 10,
        position: 'absolute',
        top: 22,
        right: 20
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
