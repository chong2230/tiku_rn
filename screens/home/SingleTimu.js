import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';

import Timu from './Timu';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
import TimuCardModal from './TimuCardModal';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import { TabbarSafeBottomMargin } from '../../utils/Device';
import { isJson } from '../../utils/Util';
import ImageButton from "../../components/ImageButton";

const {width, height} = Dimensions.get('window');

export default class SingleTimu extends Timu {
    constructor(props) {
        super(props);

        this.state = {
            index: 1,
            total: 10,
            list: [],
            info: {},
            askList: [],
            currentAnswers: [],		// 当前题目的回答
            allMyAnswers: [],	// 所有题目的回答
            showAnalyse: [],		// 是否为题目解析
            showModal: false,
            showCardModal: false
        };
    }

    componentDidMount() {
        let { state } = this.props.navigation;
        // 查看单个题目信息
        this._getTimu(state.params.id);
    }

    // 单个题目显示答案和解析，不能选择
    _choose = (key, index) => {

    }

    render() {
        let info = this.state.info;
        return (
            <View style={styles.container}>
                <Bar></Bar>
                <Header title="" goBack={()=>{
                    let { state, goBack } = this.props.navigation;
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
                <ScrollView style={styles.content}>
                    <Text style={styles.type}>{info.type}</Text>
                    {/*<Text style={styles.title}>{info.question}</Text>*/}
                    {this._renderQuestions()}
                    {this._renderAnalysis()}
                </ScrollView>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        margin: 15
    },
    type: {
        fontSize: 15,
        color: Colors.highlight
    },
    title: {
        fontSize: 15,
        color: Colors.default,
        width: width - 20,
        // height: 20,
        lineHeight: 20,
        marginTop: 10,
        marginBottom: 10,
        paddingRight: 10
    },
    questionText: {
        fontSize: 15,
        color: Colors.highlight,
        height: 20,
        marginTop: 5,
        marginBottom: 5
    },
    choiceText: {
        fontSize: 15,
        color: Colors.default,
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 5
    },
    selectChoiceText: {
        color: Colors.special
    },
    input: {
        fontSize: 15,
        color: '#1a1a1a',
        width: width - 130,
        marginRight: 15,
        padding: 3,
        borderColor: '#e2e3e4',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    analyseView: {
        // height: 20,
        marginTop: 10,
        marginBottom: 10
    },
    analyseTip: {
        fontSize: 15,
        color: Colors.default,
        height: 20,
        marginBottom: 10
    },
    analyseAnswer: {
        fontSize: 15,
        height: 20,
        color: Colors.highlight
    },
    analyseContent: {
        width: width - 20,
        fontSize: 15,
        // height: 20,
        lineHeight: 20,
        marginTop: 10,
        paddingRight: 10
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
        width: width,
        borderTopWidth: 0.5,
        borderTopColor: '#e0e0e0',
    },
    button: {
        margin: 20,
        color: Colors.highlight
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
    shadowView: {
        backgroundColor: 'black',
        opacity: 0.4,
        height: height,
        width: width,
        position: 'absolute',
        zIndex: 10
    },
});