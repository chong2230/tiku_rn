/**
* 我的留言
*/
import React, { PureComponent } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
    StatusBar,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';

import Bar from '../../components/Bar';
import Common from '../../utils/Common';
import Colors from '../../constants/Colors';
import { formatFullTime } from '../../utils/Util';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;
const emptyOffset = 120;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class Message extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            listData: []
        }
    }

    componentDidMount() {
        pageNumber = 1;
        this._load();
    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        Common.getMyMessages(param, (result)=>{
            if (result.code == 0) {
                let list = result.data || [];
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
                    listData: data
                });
            }            
        });        
    }

    _renderItem = (item) => {
        let rowData = item.item;
        return (
                <View style={styles.item}>  
                    <View style={styles.top}> 
                        <Text style={styles.gmtCreate}>{formatFullTime(rowData.gmtCreate)}</Text>
                        <Text style={styles.zan}>  赞 {rowData.likeCount}</Text>
                    </View>
                    <Text style={styles.content}>{rowData.content}</Text>
                    <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData.articleId)}}>
                        <View style={styles.article}>
                            <Text numberOfLines={1} style={styles.articleTitle}>{rowData.articleTitle}</Text>
                            <Image source={require('../../images/account/right-arrow.png')} style={styles.rightIcon} />
                        </View>
                    </TouchableWithoutFeedback>                    
                </View>
                
            
        );
    }

    _onItemClick = (id) => {
        const { navigate } = this.props.navigation;
        navigate("Article", { columnId: 1, id: id});
    }

    // 空布局
    _renderEmptyView = () => {
        return <View style={{height: this.state.flatHeight, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../images/empty/empty-message.png')} resizeMode={'contain'} style={{width: screenWidth, height: emptyHeight, top: 120}} />
            <Text style={{marginTop: 105, marginBottom: 10}}>暂无留言</Text>
        </View>
    }

    _footer = () => {
        return (
            <View style={styles.footer}></View>
        );
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
        return(
        <View style={styles.container}>
            <Bar />
            {/* 栏目条 */}
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
        backgroundColor: '#F8F8F8',
        position: 'relative'
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    top: {
        flexDirection: 'row'
    },
    gmtCreate: {
        color: Colors.gray
    },
    zan: {
        color: Colors.gray
    },
    content : {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 15
    },
    article: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#f6f6f6',
        height: 25
    },
    articleTitle: {
        fontSize: 12,
        color: Colors.gray,
        height: 25,
        lineHeight: 25
    },
    rightIcon: {
        width: 10,
        height: 10,
        position: 'absolute',
        right: 20
    },
    separator: {
        backgroundColor: '#ECEFF2',
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
