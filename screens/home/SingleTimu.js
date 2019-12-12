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

export default class SingleTimu extends Component {
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

    _getTimu = (id, index) => {
        if (!id) id = this._getCurrent();
        // 防止试卷无题目时报错
        if (id) {
            Common.getTimu({ questionId: id }, (result)=>{
                if (result.code == 0) {
                    let info = {
                        question: "",
                        choices: [],
                        answers: [],
                        answersImg: [],
                        analysis: [],
                        analysisImg: []

                    };
                    for (let i in result.data.askList) {
                        let ask = result.data.askList[i];
                        let choice = {};
                        if (ask.choiceA) choice['a'] = ask.choiceA;
                        if (ask.choiceB) choice['b'] = ask.choiceB;
                        if (ask.choiceC) choice['c'] = ask.choiceC;
                        if (ask.choiceD) choice['d'] = ask.choiceD;
                        if (ask.choiceE) choice['e'] = ask.choiceE;
                        info.choices.push(choice);
                        info.answers.push(ask.answer);
                        info.answersImg.push(ask.answerImg);
                        info.analysis.push(ask.analysis);
                        info.analysisImg.push(ask.analysisImg);
                        if (result.data.askList.length == 1) info.question = ask.question || '';
                    }
                    info = Object.assign({}, result.data, info);
                    console.log('info ', info);
                    this.setState({
                        info: info,
                        askList: result.data.askList
                    });
                    this._convertAnswers();
                }
            });
        }
    }

    _convertAnswers = () => {
        let info = this.state.info;
        let allMyAnswers = [];
        let currentAnswers = [];
        for (let i in this.state.list) {
            let data = this.state.list[i];
            myAnswers = data.myAnswers;
            // for (let j in myAnswers) {
            // 	if (info.type == '单选题' || info.type == '多选题' || info.type == '不定项') {
            //        myAnswers[j] = myAnswers.split(',');
            // 	}
            // }
            allMyAnswers.push(myAnswers);
            if (data.id == info.id) currentAnswers = myAnswers;
        }
        this.setState({
            currentAnswers: currentAnswers,
            allMyAnswers: allMyAnswers
        });
    }

    _getAnalyse = () => {
        let showAnalyse = this.state.showAnalyse;
        showAnalyse[this.state.index - 1] = !showAnalyse[this.state.index - 1];
        this.setState({
            showAnalyse: showAnalyse
        })
    }

    _getCurrent = () => {
        let list = this.state.list;
        if (list && list.length > 0) {
            let current = list[0];
            for (let i in list) {
                if (!list[i].myAnswer) current = list[i];
                this.setState({
                    index: parseInt(i)+1
                });
                return current.id;
            }
        }
        return 0;
    }

    _getAnswer = () => {
        switch (this.state.info.type) {
            case '单选题':
                return this.state.currentAnswers;
            case '多选题':	// 将数组转化为字符串，用','号分隔
            case '不定项':
                // for (let i in this.state.currentAnswers) {
                //    this.state.currentAnswers[i] = this.state.currentAnswers[i].join(',');
                // }
                return this.state.currentAnswers;
            case '判断题':
                break;
            case '填空题':
                break;
            case '简答题':
            case '计算分析题':
            case '综合题':
                break;
            default:
                break;
        }
    }

    // 一道题有多个问题和答案
    _renderQuestions = () => {
        switch (this.state.info.type) {
            case '单选题':
            case '单项选择题':
            case '多选题':
            case '单项选择题':
            case '不定项':
            case '不定项选择题':
            case '判断题':
                return this._renderChoiceQuestions();
                break;
            case '填空题':
                return this._renderFillBlankQuestions();
                break;
            case '简答题':
            case '计算分析题':
            case '综合题':
                return this._renderShortAnswerQuestions();
                break;
            default:
                break;
        }
    }

    // 单选题/多选题/不定项
    _renderChoiceQuestions = () => {
        let info = this.state.info;
        let questionsView = [];
        for (let i in info.choices) {
            let choice = info.choices[i];
            let choicesView = [];
            for (let key in choice) {
                if (key) {
                    let choiceText = choice[key];
                    if (choiceText.indexOf(key.toUpperCase() + '.') != 0
                        && choiceText.indexOf(key.toUpperCase() + '、') != 0
                        && choiceText.indexOf(key.toUpperCase() + ' ') != 0
                        && choiceText.indexOf(key.toUpperCase() + '．') != 0) {
                        choiceText = key.toUpperCase() + '. ' + choice[key];
                    }
                    let choiceView = (
                        <View key={info.id + '_choice_' + i + '_' + key}>
                            <Text style={[styles.choiceText,
                                (info.answers[i] == key) ?
                                    styles.selectChoiceText : null]}>
                                {choiceText}
                            </Text>
                        </View>
                    );
                    choicesView.push(choiceView);
                }
            }
            let questionView = (
                <View style={styles.question} key={info.id + '_choice_' + i}>
                    {/*<Text style={styles.questionText}>问题{parseInt(i)+1}</Text>*/}
                    {
                        this._renderAsk(i)
                    }
                    <View>{choicesView}</View>
                </View>
            );
            questionsView.push(questionView);
        }
        return questionsView;
    }

    // 填空题
    _renderFillBlankQuestions = () => {
        let info = this.state.info;
        let questionsView = [];
        for (let i in info.choices) {
            let choice = info.choices[i];
            let choicesView = [];
            let questionView = (
                <View style={styles.question} key={info.id + '_choice_' + i}>
                    {/*<Text style={styles.questionText}>问题{parseInt(i)+1}</Text>*/}
                    {
                        this._renderAsk(i)
                    }
                    <TextInput
                        onChangeText={(text)=>{this._onChangeText(text, index)}}
                        style={[styles.input]}></TextInput>
                </View>
            );
            questionsView.push(questionView);
        }
        return questionsView;
    }

    // 简答题
    _renderShortAnswerQuestions = () => {
        let info = this.state.info;
        let questionsView = [];
        for (let i in info.choices) {
            let choice = info.choices[i];
            let choicesView = [];
            let value = this.state.currentAnswers[i];
            let questionView = (
                <View style={styles.question} key={info.id + '_choice_' + i}>
                    {/*<Text style={styles.questionText}>问题{parseInt(i)+1}</Text>*/}
                    {
                        this._renderAsk(i)
                    }
                    <TextInput
                        multiline={true}
                        onChangeText={(text)=>{this._onChangeText(text)}}
                        style={[styles.input]}></TextInput>
                </View>
            );
            questionsView.push(questionView);
        }
        return questionsView;
    }

    _renderAsk = (index) => {
        return (
            this.state.askList[index].ask ?
                <Text style={styles.title}>{this.state.askList[index].ask.replace(/^\d*\./, '')}</Text>
                : null
        );
    }

    // 解析
    _renderAnalysis = () => {
        let info = this.state.info;
        let answer = info.answers;
        if (answer && answer instanceof Array) answer = answer.join('    ');
        let analysis = isJson(info.analysis) ? JSON.parse(info.analysis) : info.analysis;
        let analysisView = [];
        if (analysis && analysis instanceof Array) {
            for (let i in analysis) {
                analysisView.push(<Text style={styles.analyseContent} key={'analysis-'+i}>{analysis[i].replace(/^\d*\./, '')}</Text>)
            }
        }
        // 适配答案有一图和多图的情况
        let answerImgView = [];
        if (info.answerImg && info.answerImg instanceof Array) {
            for (let i in info.answerImg) {
                answerImgView.push(
                    <Image source={{uri: Common.baseUrl + info.answerImg[i]}} style={styles.answerImg} key={'answerImg-'+i}></Image>
                );
            }
        } else if (typeof info.answerImg == 'string') {
            answerImgView = <Image source={{uri: Common.baseUrl + info.answerImg}} style={styles.answerImg}></Image>;
        }
        // 适配解析有一图和多图的情况
        let analysisImgView = [];
        if (info.analysisImg && info.analysisImg instanceof Array) {
            for (let i in info.analysisImg) {
                analysisImgView.push(
                    <Image source={{uri: Common.baseUrl + info.analysisImg[i]}} style={styles.analysisImg} key={'analysisImg-'+i}></Image>
                );
            }
        } else if (typeof info.analysisImg == 'string') {
            analysisImgView = <Image source={{uri: Common.baseUrl + info.analysisImg}} style={styles.analysisImg}></Image>;
        }
        let analyseView = (
            <View style={styles.analyseView}>
                <Text style={styles.analyseTip}>答案与解析</Text>
                <Text style={styles.analyseAnswer}>参考答案：{answer}</Text>
                {answerImgView}
                {analysisView}
                {analysisImgView}
            </View>
        );
        return analyseView;
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