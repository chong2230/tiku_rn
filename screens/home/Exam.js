/**
* 考试科目
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
    ImageBackground
} from 'react-native';

import { Ionicons } from 'react-native-vector-icons';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const emptyHeight = screenWidth/screenHeight * 289;

export default class Exam extends PureComponent{

    // 构造器
    constructor(props){
        super(props);
        this.state = {
            sourceData : [],
            refreshing: false,
            flatHeight: 0,
            indexText: '',
        };
    }

    // 渲染完成钩子
    componentDidMount() {
        this._getList();
    }

    _getList = () => {
        let { state } = this.props.navigation;
        let params = {
            professionId: state.params.professionId,
            category: state.params.category
        };
        Common.getExamList(params, (result)=>{
            if (result.code == 0) {
                if (result.data && result.data.length > 0) {
                    this.setState({
                        name: result.data[0].name,
                        sourceData: result.data[0].courses
                    })
                }
            }
        });
    }

    _keyExtractor = (item, index) => index+'';

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height: 1, backgroundColor:'#e6e6e6' }} />
    );

    _renderItem = (item) =>{
        let rowData = item.item;
        return(
        	<TouchableOpacity onPress={()=>{this._choose(rowData)}}>
	            <View style={styles.item}>
					<Text style={styles.name}>{rowData.name}</Text>              
	            </View>
	        </TouchableOpacity>
        );
    };

    _choose = (data) => {
		const { state, goBack } = this.props.navigation;
        state.params.chooseCallback(data);
        goBack();
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
                <Header title="切换科目" goBack={()=>{
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
	            <FlatList style={styles.list}
	                ref={ ref => this.flatList = ref }
	                data={ this.state.sourceData }
	                extraData={ this.state.selected }
	                keyExtractor={ this._keyExtractor }
	                renderItem={ this._renderItem }
	                // 初始加载的条数，不会被卸载
	                initialNumToRender={10}
	                // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
	                onEndReachedThreshold={0.1}
	                // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
	                onEndReached={ this._onEndReached }
	                // ItemSeparatorComponent={ this._renderItemSeparatorComponent }
	                onLayout={this._setFlatListHeight}
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

Exam.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    list: {
        
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 54,
        borderColor: '#e6e6e6',
        borderBottomWidth: 1
    },
    name: {
        flexWrap: 'wrap',
        fontSize: 15,
        color: '#1a1a1a',
        // marginTop: 8,
        marginLeft: 15,
        height: 54,
        lineHeight: 54
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});