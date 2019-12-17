/**
 * 我的收藏
 **/
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
import Header from '../../components/Header';
import Common from '../../utils/Common';
import Colors from '../../constants/Colors';
import { TabbarSafeBottomMargin } from '../../utils/Device';
import { formatFullTime } from '../../utils/Util';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;
const emptyOffset = 120;
let pageNumber = 1;
let pageSize = 10;
let hasMore = false;
let isLoading = false;  // 加载更多

export default class MyCollect extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            listData: [],
            hasLoad: false
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
            pageSize: pageSize,
            professionId: params.course.professionId,
            courseId: params.course.id
        }
        Common.getMyCollect(param, (result)=>{
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
                    listData: data,
                    hasLoad: true
                });
            }
        });
    }

    _renderItem = (item) => {
        let rowData = item.item;
        let question = rowData.askList && rowData.askList.length > 0 ? rowData.askList[0].ask.replace(/^\d*\./, '') : '';
        return (
            <TouchableOpacity onPress={()=>{this._onItemClick(rowData)}}>
                <View style={styles.item}>
                    <Text style={styles.type}>{rowData.type}</Text>
                    <Text numberOfLines={2} style={styles.title}>{question}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _onItemClick = (data) => {
        const { navigate } = this.props.navigation;
        navigate("SingleTimu", {id: data.id, isVisible: false, isViewMode: true});
    }

    // 空布局
    _renderEmptyView = () => {
        return this.state.hasLoad ? <View style={{height: this.state.flatHeight, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../images/empty/empty-bought.png')} resizeMode={'contain'} style={{width: screenWidth, height: emptyHeight, top: 120}} />
            <Text style={{marginTop: 105, marginBottom: 10}}>暂无收藏</Text>
        </View> : null
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
                <Bar></Bar>
                <Header title="试题收藏" goBack={()=>{
                    let { state, goBack } = this.props.navigation;
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
                <View style={styles.container}>
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
    type: {
        fontSize: 15,
        color: Colors.highlight
    },
    title: {
        fontSize: 15,
        color: Colors.default,
        width: screenWidth - 20,
        lineHeight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    separator: {
        backgroundColor: '#ECEFF2',
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});