/**
* 题库
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
import Alert from '../../components/Alert';
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

export default class Subject extends PureComponent{

    // 构造器
    constructor(props){
        super(props);
        this.state = {
            listData : [],
            member: { level: 0, passed: false },     // 会员信息
            refreshing: false,
            flatHeight: 0,
            indexText: '',
            hasLoad: false
        };
        this.selectData = {};
    }

    // 改变value而不需要重新re-render的变量，声明在constructor外面
    currPage= 0;

    // 渲染完成钩子
    componentDidMount() {
        pageNumber = 1;
        this._load();
    }

    _load = () => {
        let { state } = this.props.navigation;
        let params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            functionId: state.params.id,
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id
        };
        if (state.params.from == 'purchase') params.from = state.params.from; // 已购
        // 根据专业、科目和课程ids来获取数据
        if (!global.course.curriculums) {
            let ids = [];
            ids.push(global.course.id);
            params.curriculumIds = ids.join(',');
        }
        Common.getSubjectList(params, (result)=>{
            console.log('getSubjectList ', result);
            if (result.code == 0 && result.data) {
                this.setState({refreshing: false}); //结束
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
                    listData: data,
                    hasLoad: true
                });
            }
        });
        Common.getUserMember({
            courseId: global.course.courseId || global.course.id
        }, (result)=>{
            if (result.code == 0) {
                if (result.data) {
                    this.setState({
                        member: result.data
                    })
                }
            }
        })
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
        this.state.hasLoad ?
        <View style={{backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../images/empty/empty-bought.png')} resizeMode={'contain'} style={{width: screenWidth, height: emptyHeight, top: 120}} />
            <Text style={{marginTop: 105, marginBottom: 10}}>暂无内容</Text>
        </View> : null
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
        pageNumber = 1;
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
    // 历年真题和模拟试卷不能重新开始，避免知道答案重新开始可以轻松获得100分的问题
    // doModel: 1 练习模式 2 考试模式
    // /**
    //      * 会员等级 level
    //      * 0 普通注册用户
    //      * 1 仅购买试卷（根据试卷的hadPay判断是否可以使用当前试卷的服务）
    //      * 2 按时间范围的服务权益（根据validEnd判断是否可以使用当前科目的所有服务）
    //      * 3 vip（根据考试是否通过标识passed判断是否可以使用当前科目的所有服务）
    //      */
    _renderItem = (item) =>{
        let { state } = this.props.navigation;
        let rowData = item.item;
        let btnText = '开始做题';
        let needBuy = (this.state.member.level == 3 && this.state.member.passed)
            || (this.state.member.level < 2 && rowData.price > 0 && !rowData.hadPay);
        if (needBuy) {// 未购买会员、购买vip已通过考试、未购买试卷
            btnText = '购买';
        } else if (rowData.userStatus == 2) btnText = '继续做题';
        else if (rowData.userStatus == 3) btnText = '重新开始';
        return(
            <View style={styles.item}>
                <View style={styles.top}>
                    <Text style={styles.type}>{rowData.type}</Text>
                    <Text style={styles.title}>{rowData.name}</Text>
                    {
                        rowData.price > 0 ? <Image style={styles.payIcon} source={require('../../images/icon/pay.png')} /> : null
                    }
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
                        !needBuy && rowData.userStatus == 3 ?
                            <Button text={'查看解析'}
                                    style={styles.handleBtn} containerStyle={styles.handleBtnContainer}
                                    onPress={()=>{this._startPractise(rowData, true)}}></Button>
                            : null
                    }
                    {
                        // rowData.userStatus == 3 &&
                        // (state.params.title == '历年真题' || state.params.title == '模拟试卷') ? null :
                            <Button text={btnText}
                                    style={styles.handleBtn} containerStyle={styles.handleBtnContainer}
                                    onPress={()=>{
                                        // 付费试卷，未付费
                                        if (needBuy) {
                                            this._goGoods(rowData);
                                            return;
                                        }
                                        this.selectData = rowData;
                                        let doModels = rowData.doModels ? rowData.doModels.split(',') : 1;
                                        // 开始做题/继续做题
                                        if (rowData.userStatus == 1 || rowData.userStatus == 3) {
                                            // 根据后台返回的做题模式来做题
                                            if (doModels.length == 2) this._chooseMode(rowData);
                                            else this._startPractise(rowData, false, parseInt(doModels[0]));
                                        } else {
                                            this.continueAlert.show();
                                            // this._startPractise(rowData, false);
                                        }
                                    }}></Button>
                    }

                </View>
            </View>
        );
    };

    _chooseMode = () => {
        this.alert.show();
    }

    _startPractise = (data, isAnalyse, doModel=1, type) => {
        // console.log('start ', data);
        if (!type) type = isAnalyse ? 1 : (data.userStatus == 2 ? 3 : 2);   // type: 1 查看解析 2 开始做题 3 继续做题
        const { navigate, state } = this.props.navigation;
        if (global.isAudit || global.token) {
            navigate("Timu", {id: data.id, name: data.name,
                functionName: state.params.title, functionId: state.params.id,
                type: type,
                doModel: doModel,   // 做题模式
                isVisible: false, isAnalyse: isAnalyse, callback: (status)=>{
                    this._reload();
                    // data.userStatus = status;
                    // this.setState({
                    //     listData: this.state.listData
                    // })
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

    _startExam = () => {

    }

    // 进入商品购买列表 TODO: refresh paper, not reload
    _goGoods = (data) => {
        const { navigate, state } = this.props.navigation;
        if (global.isAudit || global.token) {
            navigate("Goods", {
                isVisible: false, paperId: data.id, refresh: (status)=>{
                    this._reload();
                    // data.userStatus = status;
                    // this.setState({
                    //     listData: this.state.listData
                    // })
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
                <Header title={state.params.title} goBack={()=>{
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
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
                />
                <View style={styles.safeBottom}></View>
                <Alert
                    ref={(ref)=>this.alert = ref}
                    modalWidth={270}
                    modalHeight={124}
                    titleText="请选择答题模式"
                    titleFontSize={16}
                    titleFontWeight={"bold"}
                    okText={'练习模式'}
                    cancelText={'考试模式'}
                    confirm={()=>{
                        this._startPractise(this.selectData, false, 1, 2);
                    }}
                    cancel={()=>{
                        this._startPractise(this.selectData, false, 2, 2);
                    }}
                    okFontColor={'#4789F7'}
                />
                <Alert
                    ref={(ref)=>this.continueAlert = ref}
                    modalWidth={270}
                    modalHeight={124}
                    titleText="您有未完成的测试，是否继续"
                    titleFontSize={16}
                    titleFontWeight={"bold"}
                    okText={'继续答题'}
                    cancelText={'重新开始'}
                    confirm={()=>{
                        this._startPractise(this.selectData, false);
                    }}
                    cancel={()=>{
                        let data = this.selectData;
                        let doModels = data.doModels ? data.doModels.split(',') : 1;
                        if (doModels.length == 2) this._chooseMode();
                        else this._startPractise(data, false, parseInt(doModels[0]), 2);
                    }}
                    okFontColor={'#4789F7'}
                />
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

Subject.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: '100%',
        backgroundColor: '#F8F8F8'
    },
    item: {
        alignItems: 'center',
        height: 80,
    },
    payIcon: {
        width: 16,
        height: 20,
        marginTop: 10,
        marginLeft: 10,
        // position: 'absolute'
    },
    top: {
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40
    },
    type: {
        color: Colors.highlight,
        fontSize: 16,
        alignSelf: 'center',
        marginLeft: 10
    },
    title: {
        color: '#1A1A1A',
        marginLeft: 10,
        fontSize: 16,
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
        marginRight: 15,
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