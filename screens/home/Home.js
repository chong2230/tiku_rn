import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Image,
  View,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  DeviceEventEmitter,
  Dimensions
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';

import Bar from '../../components/Bar';
import ViewPager from '../../components/ViewPager';
import SwitchModal from '../../components/SwitchModal';
import Alert from '../../components/Alert';
import Toast from '../../components/Toast';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import { TabbarSafeBottomMargin } from '../../utils/Device';
import CircleButton from "../../components/CircleButton";
import MockData from '../../mockdata/mockdata';
import AnalyticsUtil from '../../utils/AnalyticsUtil';

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const bannerImgHeight = (deviceW-20)*410/900;
const bannerHeight = bannerImgHeight + 20;
const itemWidth = deviceW/3;

export default class Home extends Component {

  constructor(props) {
        super(props);

        let dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2
        });
        // 实际的DataSources存放在state中
        this.state = {
            selectedNews: 0,
            showModal: false,
            showSwitchModal: false,
            dataSource: null,
            hotData: [],
            listData: [],
            myData: {},
            curCourse: {}
        }
    }

    componentDidMount() {
        let self = this;
        SplashScreen.hide();
        this._initData();
        this.emitter = DeviceEventEmitter.addListener('refreshHome', (data) => {
            self._initData();
        });
        this.navigationEmitter = DeviceEventEmitter.addListener('navigationStateChange', (data) => {
            self._load();
        });
        AnalyticsUtil.onEvent('ntk_home');
    }

    _initData = () => {
        let hotData = MockData['/home/functions']['data'];
        let myData = MockData['/home/my']['data'];
        Storage.get('hotData').then((data)=>{
            if (data) hotData = JSON.parse(data);
            this.setState({
                hotData: hotData
            });    
        });
        Storage.get('myData').then((data)=>{
            if (data) myData = JSON.parse(data);
            this.setState({
                myData: myData
            });    
        });
        Storage.get('token').then((val)=>{
            if (val) {
                global.token = val;
            }
        });
        Storage.get('course').then((data)=>{
            console.log('course data', data);
            if (data) {
                global.course = data;
                this.setState({
                    curCourse: data
                });
                this._preload();
            } else {
                this.props.navigation.push('Category', { isVisible: false, leftBtnIsHidden: true,
                    chooseCallback:(data)=>{
                        global.course = data;
                        Storage.save('course', data);
                        this.setState({
                            curCourse: data
                        });
                        this._preload();
                    }
                })
            }
        });

    }

    _preload = () => {
        if (Common.env == 'test') {
            // 获取host，用于切换环境
            Storage.get('host').then((val)=>{
                if (val) {
                    Common.httpServer = val;
                    global.host = val;                        
                }
                this._load();
            });    
        } else {
            this._load();
        }
    }

    _load = () => {
        let params = {
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id,
        };
        Common.getBanners(params, (result)=>{
            if (result.code == 0) {
                let mockdata = MockData['/home/slide']['data'];
                let list = result.data || [];
                let len = list.length;
                if (len < 3) {
                    for (let i=0; i<3-len; i++) {
                        list.push(mockdata[i]);
                    }
                }
                this.timer && clearInterval(this.timer);
                var dataSource = new ViewPager.DataSource({
                    pageHasChanged: (p1, p2) => p1 !== p2
                });
                this.setState({
                    dataSource: dataSource.cloneWithPages(list),
                });
            }
        });
        Common.getHomeFunc(params, (result)=>{
            console.log('getHomeFunc ', result);
            if (result.code == 0) {
                this.setState({
                    hotData: result.data
                })
                Storage.save('hotData', JSON.stringify(result.data));
            }
        });
        Common.getHomeMy(params, (result)=>{
            console.log('getHomeMy ', result);
            if (result.code == 0) {
                this.setState({
                    myData: result.data
                })
                Storage.save('myData', JSON.stringify(result.data));
            }
        });
    }

    _showSwitchModal = () => {
        this.setState({
            showModal: true,
            showSwitchModal: true
        });
    }

    _switchSubject = (type) => {
        let course = this.state.curCourse;
        const { navigate } = this.props.navigation;
        if (type == 1) {
            navigate("Exam", { isVisible: false, professionId: course.professionId,
                category: course.category,
                courseId: course.courseId || course.id, // course可能是科目，也可能是课程，优先先取courseId
                course: course,
                chooseCallback:(data)=>{
                    global.course = data;
                    Storage.save('course', data);
                    this.setState({
                        curCourse: data
                    });
                    DeviceEventEmitter.emit('navigationStateChange');
                }
            });  
        } else {
            navigate("Category", { isVisible: false, chooseCallback:(data)=>{
                global.course = data;
                Storage.save('course', data);
                this.setState({
                    curCourse: data
                });
                DeviceEventEmitter.emit('navigationStateChange');
            }});  
        }        
    }

    _renderPage(data, pageID) {
        // console.log('_renderPage ', data);
        return (
            <TouchableWithoutFeedback
                onPress={() => this._onBannerClick(data, pageID)} key={'page-' + data.id}>
                    <Image
                        source={{uri : Common.baseUrl + data.image}}
                        style={styles.page} />
            </TouchableWithoutFeedback>
        );
    }

    _onBannerClick = (data, pageID) => {
        const { navigate } = this.props.navigation;
        if (data.type == 'news') {
            navigate("NewsDetail", {id: data.id, isVisible: true});            
        }
    }

    _renderHeader = () => {
        let headerView;
        if (this.state.dataSource) {
            headerView = <ViewPager
                    dataSource={this.state.dataSource}
                    renderPage={this._renderPage.bind(this)}
                    initialPage={0}
                    isLoop={true}
                    autoPlay={true}/>;
        }
        return (
            <View style={styles.banner}>
                {headerView}
            </View>
        );
    }

    _renderSearch = () => {
        let name = Platform.OS == 'ios' ? 'ios-search' : 'md-search';
        return (
            <TouchableWithoutFeedback onPress={()=>{this._goSearch()}}>
                <View style={styles.searchArea}>                    
                    <Text style={styles.searchIcon}>
                        <Icon
                            name={name}
                            size={18}
                            style={{marginBottom: -3, marginRight: 10, top: 5}}
                            color={Colors.gray}
                        />
                    </Text>                  
                    <Text style={styles.searchInput}>请输入要搜索的试题</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderHotContent = () => {
        let item = this.state.hotData;
        let iconsView = [];
        let names = Platform.OS == 'ios'
            ? ['ios-flash', 'ios-folder', 'ios-paper', 'ios-today', 'ios-bulb', 'ios-ribbon', 'ios-hammer', 'ios-albums']
            : ['md-flash', 'md-folder', 'md-paper', 'md-today', 'md-bulb', 'md-ribbon', 'md-hammer', 'md-albums'];
        for (let i in item) {
            let data = item[i];
            let bgColor = i % 2 == 0 ? Colors.highlight : Colors.special;
            let icon = (
                <CircleButton name={names[i]} key={data.id}
                              containerStyle={{backgroundColor: bgColor}}
                              onPress={()=>{this._goHotContent(data)}} />
            );
            let iconView = (
                <View style={styles.hotView} key={data.id}>
                    { icon }
                    <Text style={styles.name}>{data.name}</Text>
                </View>
            );
            iconsView.push(iconView);
        }
        return (
            <View style={styles.contents}>
                {iconsView}
            </View>
        );
    }

    _goHotContent = (data) => {
        const { navigate } = this.props.navigation;
        navigate("Subject", {id: data.id, title: data.name, isVisible: false}); 
    }

    // 新增学习评估
    _renderMine = () => {
        let myData = this.state.myData;
        let item = myData.contents || [];
        let iconsView = [];
        let names = Platform.OS == 'ios'
            ? ['ios-heart', 'ios-list-box', 'ios-bug', 'ios-book', 'ios-eye']
            : ['md-heart', 'md-list-box', 'md-bug', 'md-book', 'md-eye'];
        for (let i in item) {
            let data = item[i];
            if (data.name == '题库笔记') continue;  // 暂不支持该功能
            let bgColor = i % 2 == 0 ? Colors.highlight : Colors.special;
            let icon = (
                <CircleButton name={names[i]} key={data.id}
                              containerStyle={{backgroundColor: bgColor}}
                              onPress={()=>{this._goMineContent(data)}} />
            );
            let iconView = (
                <View style={styles.mineView} key={data.id}>
                    { icon }
                    <Text style={styles.name}>{data.name}</Text>
                </View>
            );
            iconsView.push(iconView);
        }
        let obj = { title: '我的题库' }
        return (
            <View style={styles.mine}>
                {this._getTitleBar(obj)}                
                <View style={styles.mineContents}>
                    {iconsView}
                </View>
            </View>
        );
    }

    _goMineContent = (data) => {
        if (!global.token && data.name == '学习评估') {
            this._goLogin();
            return;
        }
        const { navigate } = this.props.navigation;
        switch(data.name) {
            case '试题收藏':
                navigate("MyCollect", {id: data.id, course: this.state.curCourse, isVisible: false});
                break;
            case '做题记录':
                navigate("MyRecord", {id: data.id, course: this.state.curCourse, isVisible: false});
                break;
            case '错题库':
                this._getWrongTimuList(data);
                break;
            case '题库笔记':
                break;
            case '学习评估':
                navigate("Statistics", {id: data.id, isVisible: false});
                break;
            default:
                break;
        }
    }

    _goLogin = () => {
        let { navigate } = this.props.navigation;
        navigate('Login', { isVisible: false, title: '密码登录', transition: 'forVertical' });
    }

    _getWrongTimuList = (data) => {
        let { state, navigate } = this.props.navigation;
        let params = {
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id
        };
        // 根据专业、科目和课程ids来获取数据
        if (!global.course.curriculums) {
            let ids = [];
            ids.push(global.course.id);
            params.curriculumIds = ids.join(',');
        }
        Common.getWrongTimuList(params, (result)=>{
            console.log('getTimuList ', result);
            if (result.code == 0) {
                if (result.data && result.data.length == 0) {
                    this.toast.show('还没有错题哦~');
                } else {
                    navigate("WrongTimu", {id: data.id, course: this.state.curCourse,
                        isAnalyse: true, from: 'WrongTimu',
                        list: result.data, isVisible: false});
                }
            } else if (result.code == 2) {
                this.toast.show('需要登录才能使用该功能哦~');
            } else {
                this.toast.show(result.msg);
            }
        });
    }

    _getTitleBar = (item) => {
        return (
            <View style={styles.titleBar}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    }

    _footer = () => {
        return <Text style={{height:65,backgroundColor:'#ECEFF2'}}></Text>;
    }

    _separator = () => {
        return <View style={{height:10,backgroundColor:'#ECEFF2'}}/>;
    }

    alertConfirm = () => {
        console.log('alert confirm');
    }

    onRequestClose = () => {
        this.setState({
            showModal: false,
            showSwitchModal: false
        });
    }

    _goSearch = () => {
        let { navigate } = this.props.navigation;
        navigate('Search', { isVisible: false, title: '搜索', transition: 'forVertical' });
    }

    render() {
        let position = {
            startY: 0,
            endY: 0
        };
        return (
            <View styles={styles.container}>
                <Bar />
                <TouchableWithoutFeedback onPress={()=>{this._showSwitchModal()}}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{this.state.curCourse.name} ▼</Text>
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView style={styles.scrollView}
                            onTouchStart={(e)=>{
                                position.startY = e.nativeEvent.pageY;
                            }}
                            onTouchEnd={(e)=>{
                                position.endY = e.nativeEvent.pageY;
                                // 竖直方向滑动超过100时，不做左右切换
                                if (position.endY - position.startY > 100) {
                                    this._load();
                                }
                            }}
                >
                    {this._renderHeader()}
                    {this._renderSearch()}
                    {this._renderHotContent()}
                    <View style={styles.separator}></View>
                    {this._renderMine()}
                    <View style={{height: 80}}></View>
                </ScrollView>
                <View style={styles.safeBottom}></View>
                {this.state.showModal ? <View style={styles.shadowView}></View> : null}
                {
                    this.state.showModal ?
                    <View style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={this.state.showModal}
                            onRequestClose={() => {this.onRequestClose()}} // android必须实现
                            >                                
                                {
                                    this.state.showSwitchModal ?
                                    <SwitchModal
                                        postMessage = {(type) => this._switchSubject(type)}
                                        onRequestClose = {() => {this.onRequestClose()}} />
                                    : null
                                }
                        </Modal> 
                    </View>: null
                }
                <Alert
                   ref={(ref)=>this.alert = ref}
                   modalWidth={270}
                   modalHeight={120}
                   titleText="确认删除本条内容"
                   titleFontWeight={"bold"}
                   confirm={this.alertConfirm}
               />
                <Toast ref={(ref)=>this.toast = ref} position="center" />
            </View>
        );    
    }
}

Home.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        backgroundColor:'white',
        width: deviceW,
        height: 44
    },
    headerTitle : {
        width: deviceW,
        height: 44,
        lineHeight: 44,
        fontSize: 17,
        color: '#333333',
        fontWeight:'400',
        alignSelf: 'center',
        textAlign: 'center'
    },
    searchArea: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: '#f8f8f8'
    },
    searchIcon: {
        marginTop: 8,
        marginLeft: 10
    },
    searchInput: {
        width: deviceW - 20,
        height: 35,
        lineHeight: 35,
        color: Colors.gray,
        fontSize: 13,
        paddingLeft: 6,
        borderRadius: 10,
        // backgroundColor: '#f8f8f8'
    },
    scrollView: {
        backgroundColor:'white'
    },    
    banner: {
        flex: 1,
        width: deviceW,
        height: bannerHeight,
        backgroundColor: 'white'
    },
    page: {
        flex: 1,
        width: deviceW-20,
        height: bannerImgHeight,
        resizeMode: 'stretch',
        margin: 10,
        borderRadius: 10
    },
    contents: {
        // marginTop: 20,
        backgroundColor: 'white',  
        flexDirection: 'row',
        flexWrap: 'wrap'      
    },
    titleBar: {
        borderBottomColor: '#e2e3e4',
        borderBottomWidth: 0.5,
        margin: 10,
        fontWeight: 'bold',
        flexDirection: 'row'
    },
    title: {
        flexWrap: 'wrap',
        fontSize: 18,
        color: 'black',
        flex: 1,
        marginTop: 8,
        marginLeft: 8,
        marginBottom: 8,
        height: 20,
    },
    hotView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: itemWidth,
        height: 75,
        marginBottom: 10
    },
    name: {
        marginTop: 8,
        width: itemWidth,
        textAlign: 'center'
    },
    mineContents: {
        backgroundColor: 'white',  
        flexDirection: 'row',
        flexWrap: 'wrap'      
    },
    mineView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: itemWidth,
        height: 75,
        // marginTop: 10,
        marginBottom: 10
    },
    separator: {
        backgroundColor: '#f2f2f2',
        height: 8
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
    shadowView: {
        backgroundColor: 'black',
        opacity: 0.4,
        height: deviceH,
        width: deviceW,
        position: 'absolute',
        zIndex: 10
    },
});
