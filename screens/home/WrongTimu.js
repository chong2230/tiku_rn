/**
 * 错题库
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';

import Timu from './Timu';
import Colors from '../../constants/Colors';
import { TabbarSafeBottomMargin } from '../../utils/Device';

const {width, height} = Dimensions.get('window');

export default class WrongTimu extends Timu {
    constructor(props) {
        super(props);

        let { state } = this.props.navigation;
        let list = state.params.list || [];
        this.state = {
            index: 1,
            total: list.length,
            list: list,
            info: {},
            askList: [],
            currentAnswers: [],		// 当前题目的回答
            showAnalyse: [],		// 是否为题目解析
            showModal: false,
            showCardModal: false
        };
    }

    componentDidMount() {
        this._load();
    }

    _load = () => {
        this._getTimu();
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
        marginBottom: 10
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
        width: width - 30,
        height: 44,
        // marginRight: 15,
        padding: 3,
        borderColor: '#e2e3e4',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    multiInput: {
        height: 300
    },
    analyseView: {
        height: 20,
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
        fontSize: 15,
        height: 20,
        marginTop: 10
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