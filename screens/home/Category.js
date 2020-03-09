/**
* 参加的考试，分类列表（专业列表）
**/

import React, { Component } from 'react';
import {
    FlatList,
    TouchableWithoutFeedback,
    Dimensions,
    StyleSheet,
    Image,
    Text,
    View,
    Animated,
    Easing,
    ImageBackground
} from 'react-native';

import { Ionicons } from 'react-native-vector-icons';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Alert from '../../components/Alert';
import Toast from '../../components/Toast';
import {TabbarSafeBottomMargin} from "../../utils/Device";
import Storage from "../../utils/Storage";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;

export default class Category extends Component{

    // 构造器
    constructor(props){
        super(props);
        this.state = {
            sourceData : [],
            refreshing: false,
            flatHeight: 0,
            indexText: '',
            chooseObj: {}
        };
        this.chooseData = {};
    }

    componentDidMount() {
        this._getList();
    }

    _getList = () => {
        let params = {};
        Common.getCategoryList(params, (result)=>{
            if (result.code == 0) {
                this.setState({
                    sourceData: result.data
                })
            }
        });
    }

    _keyExtractor = (item, index) => index+'';

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height: 10, backgroundColor:'#e6e6e6' }} />
    );

    _renderItem = (item) =>{
        let rowData = item.item;
        if (this.state.chooseObj[rowData.id]) {
            let subViews = [];
            if (rowData.courseCategory) {
                let len = rowData.courseCategory.length;
                for (let i in rowData.courseCategory) {
                    let subData = rowData.courseCategory[i];
                    let contentViews = [];
                    for (let j in subData.courses) {
                        let cont = subData.courses[j];
                        let courseBtn = (
                            <Button text={cont.name} containerStyle={styles.btnContainer} style={styles.btn} key={'button-' + cont.id}
                                onPress={()=>{this._choose(cont)}}></Button>
                        );
                        contentViews.push(courseBtn);
                    }
                    let subItem = (
                        <View style={len > 1 ? styles.subItem : null} key={subData.name}>
                            {len > 1 ? <Text style={styles.subName}>{subData.name}</Text> : null}
                            <View style={styles.contents}>
                                {contentViews}
                            </View>
                        </View>
                    );
                    subViews.push(subItem);
                }
            }
            return (
                <View style={styles.item} key={rowData.id}>
                    <TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData)}}>
                        <View style={styles.item}>
                            <Text style={styles.title}>{rowData.name}</Text>
                            {subViews}             
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        } else {
            return(
            	<TouchableWithoutFeedback onPress={()=>{this._onItemClick(rowData)}} key={rowData.id}>
    	            <View style={styles.item}>
    					<Text style={styles.title}>{rowData.name}</Text>
    	            </View>
    	        </TouchableWithoutFeedback>
            );
        }
    };

    _onItemClick = (data) => {
        let obj = this.state.chooseObj;
        if (obj[data.id]) {
            obj[data.id] = null;
        } else {
            obj[data.id] = data;
        }
        this.setState({
            chooseObj: obj
        });
    }

    _choose = (data) => {
        console.log('choose ', data);
        this.chooseData = data;
        // 课程多于一个时，弹框提示是否选择课程
        if (data.curriculums && data.curriculums.length > 1) {
            this.alert.show();
        } else {
            this._chooseCategory();
        }
    }

    _chooseExam = () => {
        let course = this.chooseData;
        const { navigate, state } = this.props.navigation;
        navigate("Exam", { isVisible: false, professionId: course.professionId,
            category: course.category,
            course: course,
            courseId: course.id,
            returnKey: state.key,
            chooseCallback:(data)=>{
                state.params.chooseCallback(data);
            }
        });
    }

    _chooseCategory = () => {
        const {state, goBack} = this.props.navigation;
        state.params.chooseCallback(this.chooseData);
        goBack();
    }

    _setFlatListHeight = (e) => {
        let height = e.nativeEvent.layout.height;
        if (this.state.flatHeight < height) {
            this.setState({flatHeight: height})
        }
    };

    _onRefresh = () => {
        this._getList();
    }

    render() {
        let { state, goBack } = this.props.navigation;        
        return (
	        <View style={styles.container}>
                <Bar></Bar> 
                <Header title="切换专业" leftBtnIsHidden={state.params.leftBtnIsHidden} goBack={()=>{
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
	            <FlatList
	                ref={ ref => this.flatList = ref }
	                data={ this.state.sourceData }
	                extraData={ this.state.selected }
	                keyExtractor={ this._keyExtractor }
	                renderItem={ this._renderItem }
	                // 初始加载的条数，不会被卸载
	                initialNumToRender={10}
                    onRefresh={this._onRefresh}
                    refreshing={false}
	                // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
	                onEndReachedThreshold={0.1}
	                // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
	                onEndReached={ this._onEndReached }
	                ItemSeparatorComponent={ this._renderItemSeparatorComponent }
	                onLayout={this._setFlatListHeight}
	                // 是一个可选的优化，用于避免动态测量内容；+50是加上Header的高度
	                //getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index + 50, index } )}
                    extraData={this.state}
	            />
                <View style={styles.safeBottom}></View>
                <Alert
                    ref={(ref)=>this.alert = ref}
                    modalWidth={270}
                    modalHeight={124}
                    titleText="是否去选择课程？"
                    titleFontSize={16}
                    titleFontWeight={"bold"}
                    cancelText={'跳过'}
                    cancel={this._chooseCategory}
                    okText={'选择'}
                    confirm={this._chooseExam}
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

Category.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    item: {
        // flexDirection: 'row',
        alignItems: 'center',
        // height: 54,
        borderColor: '#e6e6e6',
        borderBottomWidth: 1
    },
    title: {
        fontSize: 16,
        color: Colors.title,
        marginLeft: 30,
        width: screenWidth,
        height: 54,
        lineHeight: 54,
        textAlign: 'left'
    },
    name: {
        flexWrap: 'wrap',
        fontSize: 15,
        color: '#1a1a1a',
        marginLeft: 30,
        width: screenWidth,
        height: 54,
        lineHeight: 54,
        textAlign: 'left',
    },
    subItem: {
        borderTopColor: '#ececec',
        borderTopWidth: 1
    },
    subName: {
        // flexWrap: 'wrap',
        fontSize: 15,
        color: '#1a1a1a',
        paddingLeft: 15,
        width: screenWidth,
        height: 44,
        lineHeight: 44,
        // textAlign: 'left',
    },
    contents: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: screenWidth,
    },
    btnContainer: {
        width: screenWidth/2 - 30,
        height: 30,
        // padding: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 10
    },
    btn: {
        fontSize: 13,
        textAlign: 'center'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});