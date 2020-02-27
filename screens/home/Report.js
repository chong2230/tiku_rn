/**
 * 成绩单
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
    StatusBar,
    Dimensions,
    Platform,
    DeviceEventEmitter, NativeModules
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';

const { width, height } = Dimensions.get('window');

export default class Report extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            token: null,
            info: this.params,
        };
        let { state } = this.props.navigation;
        this.info = JSON.parse(state.params.info);
    }

    componentDidMount() {
        let self = this;

    }

    _renderTopInfo = () => {
        return (
            <View style={styles.info}>
                <View style={styles.infoItems}>
                    {this._renderInfoItem('您的得分', this.info.score, 0)}
                </View>
            </View>
        );
    }

    _renderCenterInfo = () => {
        let info = this.info || {};
            let infoViews = [];
            let index = 1;
            infoViews.push(this._renderInfoItem('正确题数', info.rightNum, index++));
            infoViews.push(<View style={styles.line} key={index++}></View>);
            infoViews.push(this._renderInfoItem('错误题数', info.wrongNum, index++));
            infoViews.push(<View style={styles.line} key={index++}></View>);
            infoViews.push(this._renderInfoItem('未做题数', info.unDoNum, index++));
            infoViews.push(<View style={styles.line} key={index++}></View>);
            infoViews.push(this._renderInfoItem('试卷总分', info.totalScore, index++));
            // infoViews.push(<View style={styles.line} key={index++}></View>);
            // infoViews.push(this._renderInfoItem('答题时间', info.costTime, index++));
            // infoViews.push(<View style={styles.line} key={index++}></View>);
            // infoViews.push(this._renderInfoItem('平均得分', info.avgScore, index++));
            return (
                <View style={styles.info}>
                    <View style={styles.infoItems}>{infoViews}</View>

                </View>
            );
    }

    _renderBottomInfo = () => {
        let info = this.info;
        let infoViews = [];
        let index = 6;
        infoViews.push(this._renderInfoItem('试卷总分', info.totalScore, index++));
        infoViews.push(<View style={styles.line} key={index++}></View>);
        infoViews.push(this._renderInfoItem('答题时间', info.costTime, index++));
        infoViews.push(<View style={styles.line} key={index++}></View>);
        infoViews.push(this._renderInfoItem('平均得分', info.avgScore, index++));
        return (
            <View style={styles.info}>
                <View style={styles.infoItems}>{infoViews}</View>

            </View>
        );
    }

    _renderInfoItem = (name, count, index) => {
        if (!count) count = 0;
        let specialStyle = null;
        switch (index) {
            case 0:
                specialStyle = { color: Colors.special, fontWeight: 'bold', fontSize: 20 };
                break;
            case 1:
                specialStyle = { color: Colors.highlight };
                break;
            case 3:
                specialStyle = { color: Colors.special };
                break;
            case 5:            
                specialStyle = { color: '#666678' };
                break;
            case 7:
                specialStyle = { color: Colors.gray };
                break;
        }
        return (
            <TouchableWithoutFeedback  key={'info_touch_' + index} onPress={()=>{this._onItemClick(index, count)}}>
                <View style={styles.infoItem} key={'info_' + index}>
                    <Text style={[styles.infoText, specialStyle]}>{name}</Text>
                    <Text style={[styles.infoCount, specialStyle]}>{count}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onItemClick = (index, count) => {
        if (count == 0) return;
        console.log(index);
        let rIndex = (index + 1) / 2;
        if (rIndex > 3) return;
        let { state, navigate } = this.props.navigation;
        let data = JSON.parse(state.params.info);
        console.log('_onItemClick ', data);
        navigate("DoneTimu", {id: data.id, paperId: state.params.paperId, name: data.name,
            functionName: '', functionId: data.functionId,
            type: rIndex,    // 区分正确、错误、未做题目
            isVisible: false, 
            isAnalyse: true
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Bar></Bar>
                <Header title="评估报告" goBack={()=>{
                    let { state, goBack } = this.props.navigation;
                    goBack(state.params.returnKey);
                }}></Header>
                <ScrollView style={styles.scrollView}>
                    {this._renderTopInfo()}
                    <View style={styles.separator}></View>
                    {this._renderCenterInfo()}
                    {/*{this._renderBottomInfo()}*/}
                </ScrollView>
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    scrollView: {

    },
    info: {
        paddingBottom: 15,
        backgroundColor: 'white'
    },
    infoItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 24
    },
    infoItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 87,
        height: 36
    },
    infoCount: {
        color: '#2A2A30',
        fontSize: 15,
        marginTop: 10,
    },
    infoText: {
        color: '#666678',
        fontSize: 15
    },
    line: {
        width: 1,
        height: 18,
        backgroundColor: '#DFDFDF'
    },
    separator: {
        backgroundColor: '#f2f2f2',
        height: 10
    }
});
