import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  Platform,
  ScrollView,
  ListView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native';

import Bar from '../../components/Bar';
import { MonoText } from '../../components/StyledText';
import ViewPager from '../../components/ViewPager';
import SwitchModal from '../../components/SwitchModal';
import ImageButton from '../../components/ImageButton';
import Alert from '../../components/Alert';
import Toast from '../../components/Toast';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Storage from '../../utils/Storage';
import { TabbarSafeBottomMargin } from '../../utils/Device';
import CircleButton from "../../components/CircleButton";

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const bannerImgHeight = (deviceW-20)*410/900;
const bannerHeight = bannerImgHeight + 20;
// const BANNER_IMGS = [];
const len = 160;
const subjectWidth = 300;
const mallWidth = 100;
const microWidth = 100; // 微课
const hotWidth = 150;
const hotHeight = hotWidth*156/292;

const BANNER_IMGS = [
    '../../images/banner/1.png',
    '../../images/banner/2.png'
];

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
            dataSource: null,//dataSource.cloneWithPages(BANNER_IMGS),
            hotData: [],
            listData: [],
            myData: {},
            curCourse: {
                // professionId: 2,
                // category: '默认',
                // name: '系统分析师'
            }
        }
    }

    componentDidMount() {
        this._initData();
    }

    _initData = () => {
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
                this._load();
            } else {
                this.props.navigation.push('Category', { isVisible: false, leftBtnIsHidden: true,
                    chooseCallback:(data)=>{
                        global.course = data;
                        Storage.save('course', data);
                        this.setState({
                            curCourse: data
                        });
                        this._load();
                    }
                })
            }
        })
    }

    _load = () => {
        let params = {
            professionId: global.course.professionId,
            courseId: global.course.id
        };
        Common.getBanners(params, (result)=>{
            if (result.code == 0) {
                // For test
                // result.data = BANNER_IMGS;
                this.timer && clearInterval(this.timer);
                var dataSource = new ViewPager.DataSource({
                    pageHasChanged: (p1, p2) => p1 !== p2
                });
                this.setState({
                    dataSource: dataSource.cloneWithPages(result.data),
                })
            }
        });
        Common.getHomeFunc((result)=>{
            console.log('getHomeFunc ', result);
            if (result.code == 0) {
                // for (let i in result.data) {
                //     result.data[i].image = '../../images/entrance_'+(i+1)+'.png';
                // }
                this.setState({
                    hotData: result.data
                })
            }
        });
        Common.getHomeMy((result)=>{
            console.log('getHomeMy ', result);
            if (result.code == 0) {
                // let arr = ['my_collect', 'my_course', 'my_data', 'my_library', 'my_mock', 'my_note', 'my_problem'];
                // for (let i in result.data.contents) {
                //     result.data.contents[i].image = '../../images/'+arr[i]+'.png';
                // }
                this.setState({
                    myData: result.data
                })
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
                chooseCallback:(data)=>{
                    global.course = data;
                    Storage.save('course', data);
                    this.setState({
                        curCourse: data
                    });
                }
            });  
        } else {
            navigate("Category", { isVisible: false, chooseCallback:(data)=>{
                global.course = data;
                Storage.save('course', data);
                this.setState({
                    curCourse: data
                });
            }});  
        }        
    }

    _renderPage(data, pageID) {
        // console.log('_renderPage ', data);
        return (
            <TouchableWithoutFeedback
                onPress={() => this._onBannerClick(data, pageID)}>
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
                    initialPage={1}
                    isLoop={true}
                    autoPlay={true}/>;
        }
        return (
            <View style={styles.banner}>
                {headerView}
            </View>
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

    _renderMine = () => {
        let myData = this.state.myData;
        let item = myData.contents || [];
        let iconsView = [];
        let names = Platform.OS == 'ios'
            ? ['ios-heart', 'ios-list-box', 'ios-bug', 'ios-book']
            : ['md-heart', 'md-list-box', 'md-bug', 'md-book'];
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
        if (!global.token) {
            this._goLogin();
            return;
        }
        const { navigate } = this.props.navigation;
        switch(data.name) {
            case '试题收藏':
                navigate("MyCollect", {id: data.id, course: this.state.curCourse, isVisible: false});
                break;
            case '做题记录':
                this._getWrongTimuList();
                // navigate("MyRecord", {id: data.id, course: this.state.curCourse, isVisible: false});
                break;
            case '错题库':
                // navigate("WrongTimu", {id: data.id, course: this.state.curCourse, isVisible: false});
                this._getWrongTimuList(data);
                break;
            case '题库笔记':
                break;
            default:
                break;
        }
        // navigate("Subject", {id: data.id, isVisible: false}); 
    }

    _goLogin = () => {
        let { navigate } = this.props.navigation;
        navigate('Login', { isVisiable: false, title: '密码登录', transition: 'forVertical' });
    }

    _getWrongTimuList = (data) => {
        let { state, navigate } = this.props.navigation;
        let params = {
            professionId: global.course.professionId,
            courseId: global.course.id
        };
        Common.getWrongTimuList(params, (result)=>{
            console.log('getTimuList ', result);
            if (result.code == 0) {
                if (result.data && result.data.length == 0) {
                    this.toast.show('还没有错题哦~');
                } else {
                    navigate("WrongTimu", {id: data.id, course: this.state.curCourse,
                        list: result.data, isVisible: false});
                }
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

    render() {
        return (
            <View styles={styles.container}>
                <Bar />
                <TouchableWithoutFeedback onPress={()=>{this._showSwitchModal()}}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{this.state.curCourse.name} ▼</Text>
                    </View>
                </TouchableWithoutFeedback>                
                <ScrollView style={styles.scrollView}>
                    {this._renderHeader()}
                    {this._renderHotContent()}
                    <View style={styles.separator}></View>
                    {this._renderMine()}
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
        height: 30,
    },
    hotView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceW/4 - 20,
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15
    },
    icon: {
        width: 50,
        height: 50
    },
    name: {
        marginTop: 10,
        width: deviceW/4 - 20,
        textAlign: 'center'
    },
    list: {
        backgroundColor:'#ECEFF2'
    },
    // contents: {
    //     backgroundColor: 'white',
    // },
    viewAll: {
        marginTop: 10,
        marginRight: 10,
        color: '#a4a4a4',
        fontSize: 13
    },
    subjectItem: {
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    subjectTitle: {
        position: 'absolute',
        width: subjectWidth,
        top: 45,
        color: 'white',
        textAlign: 'center',
        fontSize: 16
    },
    subjectImg: {
        width: subjectWidth,
        height: 100,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    subjectMask: {
        width: subjectWidth,
        height: 100,
        backgroundColor: 'black',
        opacity: .6,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: 'absolute',
        top: 0,
        left: 0
    },
    newIcon: {
        width: 19,
        height: 21,
        position: 'absolute',
        top: 10,
        left: 10
    },
    subjectInfo: {
        width: subjectWidth - 20,
        // marginLeft: 10,
        flexDirection: 'row'
    },
    subjectName: {
        flex: 1,
        fontSize: 15
    },
    subjectAuthor: {
        flexDirection: 'row',
        height: 50,
        margin: 10,
        paddingTop: 15,
        borderTopColor: '#e0e0e0',
        borderTopWidth: .5
    },
    subjectCost: {
        marginTop: 10,
        fontSize: 15
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    authorName: {
        fontSize: 13,
        color: 'black',
        marginTop: 10,
        marginLeft: 10
    },
    authorHonor: {
        fontSize: 13,
        color: '#828282',
        marginTop: 10,
        // marginLeft: 10
    },
    courseItem: {
        marginTop: 10,
        flexDirection: 'row'
    },
    courseImg: {
        marginLeft: 10,
        width: 120,
        height: 130,
    },
    courseInfo: {
        // marginLeft: 10
    },
    courseBottom: {
        flexDirection: 'row',
        width: deviceW - 130
    },
    authorInfo: {
        flexDirection: 'row',
    },
    item: {
        flex:1,
        alignItems:'flex-start'
    },
    img: {
        width:len,
        height:len
    },
    itemName: {
        flexWrap: 'wrap',
        // flex: 1,
        fontSize: 15,
        color: 'black',
        marginTop: 8,
        marginLeft: 10,
        height: 30,
    },
    description: {
        fontSize: 13,
        color: '#828282',
        marginLeft: 10
    },
    period: {
        flex: 1,
        fontSize: 13,
        color: '#828282',
        marginTop: 20,
        marginLeft: 10
    },
    cost: {
        fontSize: 12,
        color: Colors.highlight,
        marginLeft: 10,
        marginRight: 10
    },
    playBtn: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: hotHeight/2 - 20,
        left: hotWidth/2 - 20
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
        width: 60,
        height: 80,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10
    },
    separator: {
        backgroundColor: '#f2f2f2',
        height: 10
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
