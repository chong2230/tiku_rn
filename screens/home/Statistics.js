/**
 * @Description: 评估报告
 * @author cluo
 * @date 2020/2/22
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
import DisplayItem from "../../components/DisplayItem";

const { width, height } = Dimensions.get('window');

export default class Statistics extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            accuracyRate: '80%',       // 正确率
            examTimes: '10',          // 练习次数
            doneQuestionNums: '100',   // 答题总数
            totalStudyTime: '2天5小时',     // 答题总时间
            evaluationTimes: '2020-2-23',    // 评估时间
        };
    }

    componentDidMount() {
        let self = this;
        let params = {
            // professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id
        }
        Common.getStatistics(params, (result)=>{
            if (result.code == 0) {
                let data = result.data;
                this.setState({
                    accuracyRate: data.accuracy,
                    examTimes: data.examTimes,
                    doneQuestionNums: data.doneQuestionNums,
                    totalStudyTime: data.practiceTotalTimeStr,
                    evaluationTimes: data.ds
                })
            }
        })
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
                    <DisplayItem txt1={'考试科目：'} txt3={global.course.name} />
                    <DisplayItem txt1={'正确率：'} txt3={this.state.accuracyRate} />
                    <DisplayItem txt1={'练习次数：'} txt3={this.state.examTimes} />
                    <DisplayItem txt1={'答题总数：'} txt3={this.state.doneQuestionNums} />
                    <DisplayItem txt1={'学习总时间：'} txt3={this.state.totalStudyTime} />
                    <DisplayItem txt1={'评估时间：'} txt3={this.state.evaluationTimes} />
                </ScrollView>
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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