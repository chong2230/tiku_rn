/**
* 我的礼券
*/
import React, { PureComponent } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
    FlatList,
    StatusBar,
    Platform
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;
const emptyOffset = 120;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class Ticket extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            listData: [],
            selected: 0
        }
    }

    componentDidMount() {
        pageNumber = 1;
        this._load();

    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            type: 1,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        Common.getMyTickets(param, (result)=>{
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
        let expiredStyle = {};
        let expiredText = null
        if (rowData.expired) {
            expiredStyle = [styles.expiredStyle];
            expiredText = <Text style={[styles.expired, expiredStyle]}>已过期</Text>;
        }         
        let chooseStyle = {}
        if (rowData.id == this.state.selected) {
            chooseStyle = {
                opacity: .8
            }
        }
        return (
            <TouchableOpacity onPress={()=>this._chooseTicket(rowData)}>
            <View style={[styles.item, chooseStyle]}>                    
                <View style={styles.top}>                        
                    <Text style={[styles.name, expiredStyle]}>{rowData.title}</Text>                    
                    <Text style={[styles.price, expiredStyle]}>{rowData.price}余额</Text>
                </View>
                <Text numberOfLines={2} style={[styles.desc, expiredStyle]}>{rowData.content}</Text>
                <View style={styles.bottom}>
                    <Text style={[styles.time, expiredStyle]}>使用时间：{rowData.startDate} ~ {rowData.endDate}</Text> 
                    {expiredText}
                </View>
            </View>      
            </TouchableOpacity>
        );
    }

    _chooseTicket = (data) => {
        const { state, goBack } = this.props.navigation;
        if (state.params.type != 'choose') return;
        this.setState({
            selected: data.id
        });
        if (state.params.callback) state.params.callback(data);
        goBack();
    }

    // 空布局
    _renderEmptyView = () => {
        return <View style={{height: this.state.flatHeight, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../images/empty/empty-bought.png')} resizeMode={'contain'} style={{width: screenWidth, height: emptyHeight, top: 120}} />
            <Text style={{marginTop: 105, marginBottom: 10}}>暂无礼券</Text>
        </View>
    }

    _footer = () => {
        const { params } = this.props.navigation.state;
        let historyBtn;
        if (params.type != 'choose') {
            historyBtn = <Button text="查看历史礼券" style={styles.historyBtn} containerStyle={styles.historyBtnContainer} onPress={this._goHistory} />;
        }
        return (
            <View style={styles.footer}>
                {historyBtn}
            </View>
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

    _goHistory = () => {
        const { navigate } = this.props.navigation;
        navigate('HistoryTicket', { isVisible: false, title: '历史礼券'});
    }

    render() {
        let { state, goBack } = this.props.navigation;
        return(
        <View style={styles.container}>
            <Bar />
            <Header title={state.params.title || '我的礼券'} goBack={()=>{
                if (state.params.callback instanceof Function) {
                    state.params.callback();
                }
                goBack();
            }}></Header>
            <FlatList
                    style={styles.list}
                    ref={(flatList)=>this._flatList = flatList}
                    keyExtractor={(item, index) => {return item.id.toString();}}
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
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 5,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 18,
        margin: 10
    },
    price: {
        fontSize: 18,
        right: 10,
        top: 10
    },
    desc: {
        fontSize: 13,
        marginLeft: 10
    },
    time: {
        fontSize: 13,
        margin: 10
    },
    expiredStyle: {
        color: Colors.gray,
        opacity: .6
    },
    expired: {
        right: 10
    },
    bottom: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    separator: {
        backgroundColor: '#ECEFF2',
        // height: 10
    },
    footer: {
        flex: 1,
        width: screenWidth,
        height: 30,
        flexDirection: 'row',
        // marginTop: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    historyBtnContainer: {
        flex: 1
    },
    historyBtn: {
        fontSize: 15,
        color: '#ea642e',
        textAlign: 'center'
    },
});
