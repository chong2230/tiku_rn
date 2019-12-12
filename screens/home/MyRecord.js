/**
 * 做题记录
 **/
import React, { PureComponent } from 'react';
import {
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    Text,
    View,
    Animated,
    Easing,
    ImageBackground,
    Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;
const imgWidth = 91;
const imgHeight = 87;
let pageNumber = 1;
let pageSize = 10;
let hasMore = false;
let isLoading = false;  // 加载更多

export default class MyRecord extends PureComponent{

    // 构造器
    constructor(props){
        super(props);
        this.state = {
            listData : [],
            refreshing: false,
            flatHeight: 0,
            indexText: '',
            hasLoad: false
        };
    }

    // 改变value而不需要重新re-render的变量，声明在constructor外面
    currPage= 0;

    // 渲染完成钩子
    componentDidMount() {
        this._load();
    }

    _load = () => {
        const { params } = this.props.navigation.state;
        let param = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id
        }
        Common.getMyRecord(params, (result)=>{
            console.log('getMyRecord ', result);
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
                    hasLoad: true // 控制加载前的第一次渲染，不显示显示空内容
                });
            }
        });
    }

    /**
     * 此函数用于为给定的item生成一个不重复的Key。
     * Key的作用是使React能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。
     * 若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标
     *
     * @param item
     * @param index
     * @private
     */
    _keyExtractor = (item, index) => index+'';

    // 空布局
    _renderEmptyView = () => (
        <View style={{backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../images/empty/empty-bought.png')} resizeMode={'contain'} style={{width: screenWidth, height: emptyHeight, top: 120}} />
            <Text style={{marginTop: 105, marginBottom: 10}}>暂无记录</Text>
        </View>
    );

    // Footer布局
    _renderFooter = () => {
        let len = this.state.listData.length;
        return (
            <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center', height: len<1?0:40}}>
                <Image source={require('../../images/i_loading.gif')} resizeMode={'contain'} style={{width: 20, height: 20, marginRight: 5 }} />
                <Text>正在加载...</Text>
            </View>
        )
    };

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height: 1, backgroundColor:'#e6e6e6' }} />
    );

    // 下拉刷新
    _renderRefresh = () => {
        this.setState({refreshing: true}); //开始刷新
        this.currPage = 1;
        this._load();
    };

    // 上拉加载更多
    _onEndReached = () => {
        this._loadMore();
    };

    _loadMore = () => {
        if (hasMore) {
            isLoading = true;
            pageNumber++;
            this._load();
        }
    }

    _reload = () => {
        pageNumber = 1;
        this._load();
    }

    // userStatus: 1 未做过 2 已做过 3 已做完
    _renderItem = (item) =>{
        let { state } = this.props.navigation;
        let rowData = item.item;
        let btnText = '开始做题';
        if (rowData.userStatus == 2) btnText = '继续做题';
        else if (rowData.userStatus == 3) btnText = '重新开始';
        return(
            <View style={styles.item}>
                <View style={styles.top}>
                    {/*<Text style={styles.type}>{rowData.type}</Text>*/}
                    <Text style={styles.type}>{rowData.functionName}</Text>
                    <Text style={styles.title}>{rowData.name}</Text>
                </View>
                <View style={styles.bottom}>
                    <Icon
                        name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                        size={18}
                        style={styles.icon}
                    />
                    <Text style={styles.level}>{rowData.level}</Text>
                    <View style={{flex: 1}}></View>
                    {
                        rowData.userStatus == 3 ?
                            <Button text={'查看解析'}
                                    style={styles.handleBtn} containerStyle={styles.handleBtnContainer}
                                    onPress={()=>{this._startPractise(rowData, true)}}></Button>
                            : null
                    }
                    {
                        rowData.userStatus == 3 &&
                        (rowData.functionName == '历年真题' || rowData.functionName == '模拟试卷') ? null :
                            <Button text={btnText}
                                    style={styles.handleBtn} containerStyle={styles.handleBtnContainer}
                                    onPress={()=>{this._startPractise(rowData)}}></Button>
                    }
                </View>
            </View>
        );
    };

    _startPractise = (data, isAnalyse) => {
        console.log('start ', data);
        const { navigate, state } = this.props.navigation;
        if (global.token) {
            navigate("Timu", {id: data.id, functionName: state.params.title, functionId: state.params.functionId,
                type: isAnalyse ? 1 : 2,
                isVisible: false, isAnalyse: isAnalyse, callback: ()=>{
                    this._reload();
                }
            });
        } else {
            navigate('Login', { isVisible: false, title: '密码登录', transition: 'forVertical', refresh: (token)=>{
                    if (token != null) {
                        this._reload();
                    }
                } });
        }
    }

    _setFlatListHeight = (e) => {
        let height = e.nativeEvent.layout.height;
        if (this.state.flatHeight < height) {
            this.setState({flatHeight: height})
        }
    };


    render() {
        let { state, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Bar></Bar>
                <Header title="做题记录" goBack={()=>{
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
                {
                    this.state.hasLoad ?
                        <FlatList
                            ref={ ref => this.flatList = ref }
                            data={ this.state.listData }
                            extraData={ this.state.selected }
                            keyExtractor={ this._keyExtractor }
                            renderItem={ this._renderItem }
                            // 初始加载的条数，不会被卸载
                            initialNumToRender={10}
                            // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                            onEndReachedThreshold={0.1}
                            // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
                            onEndReached={ this._onEndReached }
                            //ListHeaderComponent={ this._renderHeader }
                            // ListFooterComponent={ this._renderFooter }
                            ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                            ListEmptyComponent={ this._renderEmptyView }
                            onLayout={this._setFlatListHeight}
                            refreshing={ this.state.refreshing }
                            onRefresh={ this._renderRefresh }
                            // 是一个可选的优化，用于避免动态测量内容；+50是加上Header的高度
                            //getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index + 50, index } )}
                        /> : null
                }
                <View style={styles.safeBottom}></View>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'black'}}
                    position='center'
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
            </View>
        );
    }
}

MyRecord.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    item: {
        alignItems: 'center',
        height: 80,
    },
    top: {
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40
    },
    type: {
        color: Colors.highlight,
        fontSize: 15,
        alignSelf: 'center',
        marginLeft: 10
    },
    title: {
        color: '#1A1A1A',
        marginLeft: 10,
        fontSize: 15,
        alignSelf: 'center'
    },
    bottom: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center'
    },
    icon: {
        marginLeft: 10
    },
    level: {
        color: '#1A1A1A',
        marginLeft: 10,
        fontSize: 13
    },
    handleBtnContainer: {
        borderRadius: 15,
        borderColor: Colors.special,
        borderWidth: 1,
        marginRight: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 25,
    },
    handleBtn: {
        alignSelf: 'center',
        color: Colors.special
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});