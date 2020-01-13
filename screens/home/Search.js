/**
* 搜索
**/
import React, { PureComponent } from 'react';
import {
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    Text,
    TextInput,
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
import HTMLView from '../../components/HTMLView';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import {TabbarSafeBottomMargin} from "../../utils/Device";
import { trim } from '../../utils/Util';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;
const imgWidth = 91;
const imgHeight = 87;
let pageNumber = 1;
let pageSize = 10;
let hasMore = false;
let isLoading = false;  // 加载更多

export default class Search extends PureComponent{

    // 构造器
    constructor(props){
        super(props);
        this.state = {
            listData : [],
            refreshing: false,
            flatHeight: 0,
            indexText: '',
            hasLoad: false,
            searchTxt: ''
        };
    }

    // 改变value而不需要重新re-render的变量，声明在constructor外面
    currPage= 0;

    // 渲染完成钩子
    componentDidMount() {
        pageNumber = 1;
    }

    _cancel = () => {
        let { goBack } = this.props.navigation;
        goBack();
    }

    _search = () => {
        if (trim(this.state.searchTxt) == '') return;
        if (global.token) {
            pageNumber = 1;
            this._load();
        } else {
            const { navigate, state } = this.props.navigation;
            navigate('Login', { isVisible: false, title: '密码登录', transition: 'forVertical', refresh: (token)=>{
                    if (token != null) {
                        // this._reload();
                    }
                } });
        }

    }

    _load = () => {
        let { state } = this.props.navigation;
        let params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            functionId: state.params.id,
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id,
            q: this.state.searchTxt
        };
        // 根据专业、科目和课程ids来获取数据
        if (!global.course.curriculums) {
            let ids = [];
            ids.push(global.course.id);
            params.curriculumIds = ids.join(',');
        }
        Common.getSearchList(params, (result)=>{
            console.log('getSearchList ', result);
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

    renderNode(node, index, siblings, parent, defaultRenderer) {
        if (node.name == 'em') {
            let specialSyle = htmlStyles.em;//node.attribs.style
            return (
                <Text key={index} style={specialSyle}>
                    {/*{defaultRenderer(node.children, parent)}*/}
                    {node.children[0].data}
                </Text>
            )
        }
    }

    _renderItem = (item) =>{
        let { state } = this.props.navigation;
        let rowData = item.item;
        let textProps = {
            style: htmlStyles.content
        }
        let content = rowData.content;//.replace(/\<em\>/g, '').replace(/\<\/em\>/g, '');
        return(
            <TouchableOpacity onPress={()=>{this._goTimu(rowData)}}>
                <View style={styles.item}>
                    <Text style={styles.paperName}>试卷名称：{rowData.paperName}</Text>
                    <Text numberOfLines={2}>{content}</Text>
                    {/*<HTMLView value={content}*/}
                              {/*renderNode={this.renderNode.bind(this)}*/}
                              {/*style={styles.htmlStyle}*/}
                              {/*stylesheet={htmlStyles}*/}
                              {/*textComponentProps={textProps}*/}
                    {/*/>*/}
                </View>
            </TouchableOpacity>
        );
    }

    _goTimu = (data) => {
        const { navigate } = this.props.navigation;
        navigate("SingleTimu", {id: data.questionId, isVisible: false, isViewMode: true});
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
                {/*<Header title={state.params.title} goBack={()=>{*/}
                    {/*if (state.params.callback instanceof Function) {*/}
                        {/*state.params.callback();*/}
                    {/*}*/}
                    {/*goBack();*/}
                {/*}}></Header>*/}
                <View style={styles.searchArea}>
                    <TextInput placeholder={'请输入要搜索的试题'}
                               onChangeText={(text)=>this.setState({searchTxt: text})}
                               onBlur={()=>{this._search()}}
                               style={styles.searchInput}
                    />
                    <View style={{flex: 1}}></View>
                    <Button text={'取消'} style={styles.searchBtn} onPress={()=>{this._cancel()}} />
                </View>
                <FlatList
                    ref={ ref => this.flatList = ref }
                    data={ this.state.listData }
                    extraData={ this.state }
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

Search.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white'
    },
    searchArea: {
        flexDirection: 'row',
        margin: 10
    },
    searchInput: {
        width: screenWidth - 80,
        height: 35,
        fontSize: 13,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: '#E9EAEC'
    },
    searchBtn: {
        width: 60,
        height: 35,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 35,
        marginLeft: 10,
        marginRight: 10
    },
    item: {
        margin: 10
    },
    paperName: {
        fontSize: 15,
        height: 21,
        lineHeight: 21,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    htmlStyle: {
        width: screenWidth - 30,
        padding: 5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    icon: { 
        marginLeft: 10 
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});

let htmlStyles = StyleSheet.create({
    em: {
        fontSize: 15,
        color:'red',
        height: 21,
        lineHeight: 21,

    },
    content: {
        fontSize: 15,
        color: Colors.default,
        height: 21,
        lineHeight: 21
    }
});