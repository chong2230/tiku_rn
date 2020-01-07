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
	Dimensions,
	Platform,
	NativeModules
} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import TimuCardModal from './TimuCardModal';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import { TabbarSafeBottomMargin } from '../../utils/Device';
import { isJson } from '../../utils/Util';
import ImageButton from "../../components/ImageButton";

const { ApiUtilBridgeModule } = NativeModules;

const {width, height} = Dimensions.get('window');

export default class Timu extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		index: 1,
	  		total: 10,
	  		list: [],
	  		info: {},
			askList: [],
	  		currentAnswers: [],		// 当前题目的回答
	  		showAnalyse: [],		// 是否为题目解析
	  		showModal: false,
	  		showCardModal: false,
	  	};
	  	this.showMultiChoiceTip = false;		// 多选题提示
	  	this.showUncertainChoiceTip = false;	// 不定项选择题提示
	  	this.isFetchScantron = false;			// 是否已经获取了答题卡接口，新版接口出来后修改为false
	}

	componentDidMount() {
		this._load();
	}

	_load = () => {
		this._getTimuList();
	}

	_getTimuList = () => {
		let { state } = this.props.navigation;
		let params = {
			paperId: state.params.id,
			type: state.params.type
		};
		Common.getTimuList(params, (result)=>{
			console.log('getTimuList ', result);
			if (result.code == 0) {
				let list = [];
				// 和答题卡接口数据统一
				for (let i=0; i<result.data.length; i++) {
					let d = {
						id: result.data[i]
					}
					list.push(d);
				} 
                let showAnalyse = [];
				if (state.params.isAnalyse) {
					for (let i in result.data) {
						showAnalyse[i] = true;
					}
				}
				this.setState({
					list: list,
					total: result.data.length,
                    showAnalyse: showAnalyse
				}, ()=>{
					this._getTimu();
				});
			} else {
                this.toast.show(result.msg);
			}
		});
	}

	// sign参数签名
	_getTimu = (id, index) => {
		if (!id) id = this._getCurrent();
		let params = { 
			plt: Platform.OS,
            dt: new Date().getTime(),
            ver: DeviceInfo.getVersion(),
            guid: DeviceInfo.getUniqueId(),
            nonce: Math.floor(Math.random() * 100000) + 999999,
			questionId: id 
		};
		// let cloneParams = Object.assign({}, params, {dt: params.dt + '', nonce: params.nonce + ''});
		// if (ApiUtilBridgeModule) {
  //           ApiUtilBridgeModule.getSignature(cloneParams).then((sign)=>{
  //               params.sign = sign;
                // console.log('sign ', params);
                // 防止试卷无题目时报错
				if (id) {
					Common.getTimu(params, (result)=>{
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
		                        // if (result.data.askList.length == 1) info.question = ask.question || '';
							}
							info = Object.assign({}, result.data, info);
							console.log('info ', info);
							this.setState({
								index: index || 1,	// 不传则默认为1
								info: info,
		                        askList: result.data.askList
							});
							this._convertAnswers(result.data.askList);
							// 切换题目时自动滑动到顶部
							if (index) this.scrollView.scrollTo({x:0,y: 0,animated:true});
						} else {
							this.toast.show(result.msg);
						}
					});
				}
    //         })
        // }

	}

	_convertAnswers = (list) => {
		let currentAnswers = [];
		for (let i in list) {
			let data = list[i];
			let myAnswer = data.myAnswer;
            currentAnswers.push(myAnswer);
		}
		this.setState({
            currentAnswers: currentAnswers || []
		});
	}

	_getAnalyse = () => {
		let { state } = this.props.navigation;
		if (!state.params.isAnalyse &&
			(state.params.functionName == '历年真题' || state.params.functionName == '模拟试卷')) {
            this.toast.show('答题时不能查看解析哦~');
			return;
		}
		let showAnalyse = this.state.showAnalyse;
		showAnalyse[this.state.index - 1] = !showAnalyse[this.state.index - 1];
		this.setState({
			showAnalyse: showAnalyse
		})
	}

	_collect = () => {
        let { state } = this.props.navigation;
        if (!state.params.isAnalyse &&
            (state.params.functionName == '历年真题' || state.params.functionName == '模拟试卷')) {
            this.toast.show('答题时不能收藏哦~');
            return;
        }
		let self = this;
		let info = this.state.info;
		let params = {
			professionId: info.professionId,
			courseId: info.courseId,
			paperId: info.paperId,
			questionId: info.id,
			type: info.hasCollect ? 0 : 1
		};
		Common.collectTimu(params, (result)=>{
			if (result.code == 0) {
				info.hasCollect = !info.hasCollect;
				self.setState({
					info: info
				})
			}
		})
	}

	// list数据字段有修改，current只会取第一个 TODO：确认需求，是否要修改为未做的第一题
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

	_choose = (key, index) => {
		// 查看解析时，不能做题
		let { state } = this.props.navigation;
		if (state.params.isAnalyse) return;
		let currentAnswers = this.state.currentAnswers;
		if (this.state.info.type == '单选题' || this.state.info.type == '单项选择题'
			|| this.state.info.type == '判断题') {
            currentAnswers[index] = key;
        } else {
			// 多选题或不定项选择题，如果用户已经选取，则取消；否则进行选取操作
            let answers = currentAnswers[index];
			if (answers) {
				answers = answers.split('');	// 字符串分割为数组
				let i = answers.findIndex((val)=>{return key == val;});
				if (i != -1) answers.splice(i, 1);
				else {
                    answers.push(key);
                    answers.sort();
				}
            } else {
                answers = [];
                answers.push(key);
            }
            currentAnswers[index] = answers.join('');
		}
		console.log(currentAnswers);
        this.setState({
            currentAnswers: currentAnswers,
        });
		this._saveTimu();
	}

	_getPrev = () => {
		if (this.state.index == 1) return;
        clearTimeout(this.nextTimeout);
		let id = this.state.list[this.state.index-2].id;
		this._getTimu(id, this.state.index - 1);
	}

	_getNext = () => {
		if (this.state.index == this.state.total) return;
        clearTimeout(this.nextTimeout);
		let id = this.state.list[this.state.index].id;
		this._getTimu(id, this.state.index + 1);
	}

	// 保存答题记录
	_saveTimu = () => {
		let { state } = this.props.navigation;
		let currentAnswers = this.state.currentAnswers;
		if (currentAnswers.length == 0) return;
		let info = this.state.info;
		let params = {
			functionId: state.params.functionId,
			professionId: info.professionId,
			courseId: info.courseId,
			paperId: info.paperId,
			questionId: info.id,
            "doMode": state.params.doMode || "练习模式"
			// answer: this._getAnswer()
		};
		let qaas = [
            // {
            // 	// 多个问题和答案
            //     askAndAnswers: [
            //         {
            //             askId: 1,
            //             answer: 'A'
            //         },
            //         {
            //             askId: 2,
            //             answer: 'B'
            //         }
            //     ],
            //     questionId: 1
            // }
        ];
        let obj = {};
        obj.askAndAnswers = [];
        obj.questionId = this.state.info.id;
        for (let i in this.state.askList) {
			let ask = this.state.askList[i];
			let askAndAnswer = {};
            askAndAnswer.askId = ask.id;
            askAndAnswer.answer = currentAnswers[i];
            obj.askAndAnswers.push(askAndAnswer);
		}
		qaas.push(obj);
        params.qaas = qaas;
		Common.saveTimu(params, (result)=>{
			if (result.code == 0) {
				let list = Object.assign({}, this.state.list);
				// list[this.state.index - 1].myAnswers = currentAnswers;
				// 如果有多个问题，都做了才算做完
				let done = 1;
				for (let j=0; j<currentAnswers.length; j++) {
					if (!currentAnswers[j]) {
						done = 0;
						break;
                    }
				}
				list[this.state.index - 1].done = done;
				this.setState({
					list: list
				});
                if (this.state.info.type == '单选题'|| this.state.info.type == '单项选择题'
					|| this.state.info.type == '判断题') {
                	clearTimeout(this.nextTimeout);
                	this.nextTimeout = setTimeout(()=>{
                        this._getNext();
					}, 1000);
                }
			}
		})
	}

	_getAnswer = () => {
        return this.state.currentAnswers;
	}

	_showCard = () => {
		this.setState({
			showModal: true,
			showCardModal: true
		})
	}

	// 获取答题卡信息
	_getScantron = () => {
		if (this.isFetchScantron) {
			this._showCard();
		} else {
			let { state } = this.props.navigation;
			let params = {
				paperId: state.params.id,
			};
			Common.getScantron(params, (result)=>{
				console.log('getTimuList ', result);
				if (result.code == 0) {
					this.isFetchScantron = true;
					this.setState({
						list: result.data,
					}, ()=>{
						this._showCard();
					});
				} else {
	                this.toast.show(result.msg);
				}
			});
		}
	}

	onRequestClose = () => {
        this.setState({
            showModal: false,
            showCardModal: false
        });
    }

    _chooseTimu = (index) => {
    	let id = this.state.list[index-1].id;
		this._getTimu(id, index);
    }

    _handlePaper = () => {
    	let info = this.state.info;
		let params = {
			professionId: info.professionId,
			courseId: info.courseId,
			paperId: info.paperId,
			questionId: info.id,
            useTime: 5	// TODO: use real data
		};
		Common.handlePaper(params, (result)=>{
			if (result.code == 0) {
				let { state, navigate } = this.props.navigation;
	            if (state.params.callback instanceof Function) {
                    state.params.callback();
                }
	            navigate('Report', {info: JSON.stringify(result.data), returnKey: state.key, isVisible: false});
			}
		})

    }

    _onChangeText = (text, index) => {
		let currentAnswers = this.state.currentAnswers;
		currentAnswers[index] = text;
        this.setState({
            currentAnswers: currentAnswers
        });
        clearTimeout(this.inputTimeout);
        this.inputTimeout = setTimeout(()=>{
        	this._saveTimu();
		}, 2000);
    }

    // 一道题有多个问题和答案
    _renderQuestions = () => {
        switch (this.state.info.type) {
            case '填空题':
                return this._renderFillBlankQuestions();
            case '简答题':
            case '计算分析题':
            case '综合题':
                return this._renderShortAnswerQuestions();
			default:
				// 单选题、单项选择题、多选题、多项选择题、不定项、不定项题、不定项选择题、判断题
				return this._renderChoiceQuestions();
		}
	}

	// 单选题/多选题/不定项/判断题
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
                        <TouchableOpacity onPress={()=>{this._choose(key, i)}} key={info.id + '_choice_' + i + '_' + key}>
                            <View>
                                <Text style={[styles.choiceText,
                                    this.state.currentAnswers[i] && this.state.currentAnswers[i].indexOf(key) != -1 ?
                                        styles.selectChoiceText : null]}>
                                    {choiceText}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                    choicesView.push(choiceView);
                }
            }
            let questionView = (
                <View style={styles.question} key={info.id + '_choice_' + i}>
                    { this._renderQuestionText(i) }
                    { this._renderAsk(i) }
                    <TouchableOpacity onPress={()=>{}}>
                        <View>{choicesView}</View>
                    </TouchableOpacity>
                </View>
            );
            questionsView.push(questionView);
        }
        return questionsView;
    }

	// 填空题
	_renderFillBlankQuestions = () => {
        let { state } = this.props.navigation;
        let info = this.state.info;
        let questionsView = [];
        for (let i in info.choices) {
            let choice = info.choices[i];
            let choicesView = [];
            let value = this.state.currentAnswers[i];
            let questionView = (
                <View style={styles.question} key={info.id + '_choice_' + i}>
                    { this._renderQuestionText(i) }
                    { this._renderAsk(i) }
                    <TextInput
                        editable={!state.params.isAnalyse ? true : false}
                        onChangeText={(text)=>{this._onChangeText(text, i)}}
						value={value}
                        style={[styles.input]}></TextInput>
                </View>
            );
            questionsView.push(questionView);
        }
        return questionsView;
	}

	// 简答题
	_renderShortAnswerQuestions = () => {
        let { state } = this.props.navigation;
        let info = this.state.info;
        let questionsView = [];
        for (let i in info.choices) {
            let choice = info.choices[i];
            let choicesView = [];
            let value = this.state.currentAnswers[i];
            let questionView = (
                <View style={styles.question} key={info.id + '_choice_' + i}>
					{ this._renderQuestionText(i) }
                    { this._renderAsk(i) }
                    <TextInput
                        editable={!state.params.isAnalyse ? true : false}
                        placeholder={'请输入您的答案'}
						multiline={true}
						value={value}
					    onChangeText={(text)=>{this._onChangeText(text, i)}}
						style={[styles.input, styles.multiInput]}></TextInput>
                </View>
            );
            questionsView.push(questionView);
        }
        return questionsView;
	}

	_renderQuestionText = (index) => {
        let info = this.state.info;
		return info.choices.length > 1 ?
			<Text style={styles.questionText}>问题{parseInt(index)+1}</Text>
			: null;
	}

	// 年份被截取，暂不过滤数字+空格 /^\d*\s/
	_renderAsk = (index) => {
		let ask = this.state.askList[index].ask.replace(/^\d*\./, '')
			.replace(/^\d*、/, '').replace(/^\d*．/, '');
		// 一题多问，问题不显示序号
		return (
            this.state.askList[index].ask ?
                <Text style={styles.title}>{(this.state.askList.length > 1 ? '' : this.state.index + '. ') + ask}</Text>
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

	_renderBottom = () => {
		let collectText = '收藏';
		let collectBtnStyle = { color: Colors.gray };
		if (this.state.info.hasCollect) {
			collectText = '已收藏';
			collectBtnStyle = {
				color: Colors.highlight
			}
		}
		let analyseBtnStyle;
		if (!this.state.showAnalyse[this.state.index-1]) {
			analyseBtnStyle = { color: Colors.gray };
		}
		let prevBtnStyle = this.state.index == 1 ? { color: Colors.gray } : null;
		let nextBtnStyle = this.state.index == this.state.total ? { color: Colors.gray } : null;
		return (
			<View style={styles.bottom}>
				<Button text="查看解析" 
					containerStyle={styles.buttonContainer} 
					style={[styles.button, analyseBtnStyle]} 
					onPress={()=>{this._getAnalyse()}}></Button>
				<Button text={collectText} style={[styles.button, collectBtnStyle]} 
					onPress={()=>{this._collect()}}></Button>
				<Button text="上一题" style={[styles.button, prevBtnStyle]} 
					onPress={()=>{this._getPrev()}}></Button>
				<Button text="下一题" style={[styles.button, nextBtnStyle]} 
					onPress={()=>{this._getNext()}}></Button>
				<Button text={this.state.index + '/' + this.state.total} 
					style={styles.button}
				  	onPress={()=>{this._getScantron()}}></Button>
			</View>
		);
	}

	render() {
		let info = this.state.info;
        let { state } = this.props.navigation;
        let tip = '';
        if (!this.showMultiChoiceTip && (info.type == '多选题' 
        		|| info.type == '多项题' || info.type == '多项选择题')) {
        	setTimeout(()=>{
        		this.showMultiChoiceTip = true;
        	}, 50);
        	tip = '（' + info.type + '需手动切换下一题）';
        } else if (!this.showUncertainChoiceTip && (info.type == '不定项' || info.type == '不定项题' || info.type == '不定项选择题')) {        	
        	setTimeout(()=>{
        		this.showUncertainChoiceTip = true;
        	}, 50);
        	tip = '（' + info.type + '需手动切换下一题）';
        }
        let name = info.name ? info.name.replace(/^\d*\./, '')
			.replace(/^\d*、/, '').replace(/^\d*．/, '').replace(/^\d*\s/, '') : '';

		return (
			<View style={styles.container}>
				<Bar></Bar> 
                <Header title={state.params.name || ''} goBack={()=>{
                	let { state, goBack } = this.props.navigation;
                    if (state.params.callback instanceof Function) {
                        state.params.callback();
                    }
                    goBack();
                }}></Header>
				<ScrollView ref={(ref)=>{this.scrollView = ref;}} style={styles.content}>
					<Text style={styles.type}>
						{info.type}
						{tip == '' ? null : <Text style={{color: Colors.special}}>{' ' + tip}</Text>}
					</Text>
					{ info.name ? <Text style={styles.title}>{this.state.index+ '. ' + name}</Text> : null }
					{this._renderQuestions()}
					{this.state.showAnalyse[this.state.index - 1] ? this._renderAnalysis() : null}
				</ScrollView>
				{this._renderBottom()}
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
                                    this.state.showCardModal ?
                                    <TimuCardModal
                                    	index = {this.state.index}
                                    	list = {this.state.list}
										isAnalyse = {state.params.isAnalyse}
                                    	choose = {(index)=>this._chooseTimu(index)}
                                    	// savePaper = {() => this._savePaper()}
                                        handlePaper = {() => this._handlePaper()}
                                        onRequestClose = {() => {this.onRequestClose()}} />
                                    : null
                                }
                        </Modal> 
                    </View>: null
                }
                <Toast ref={(ref)=>this.toast = ref} position="center" />
			</View>
		);
	}

    componentWillUnmount() {
    	clearTimeout(this.nextTimeout);
        clearTimeout(this.inputTimeout);
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
		fontSize: 16,
		color: Colors.highlight
	},
	title: {
		fontSize: 16,
		color: Colors.default,
		width: width - 20,
		// height: 20,
        lineHeight: 20,
        marginTop: 10,
		marginBottom: 10,
        paddingRight: 10
    },
	questionText: {
		fontSize: 16,
		color: Colors.highlight,
		height: 20,
		marginTop: 5,
		marginBottom: 5
	},
	choiceText: {
		fontSize: 16,
		color: Colors.default,
        lineHeight: 20,
		marginTop: 5,
		marginBottom: 5
	},
	selectChoiceText: {
		color: Colors.special
	},
    input: {
        fontSize: 16,
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
		// height: 20,
		marginTop: 10,
		marginBottom: 10
	},
	analyseTip: {
		fontSize: 16,
		color: Colors.default,
		height: 20,
		marginBottom: 10
	},
	analyseAnswer: {
		fontSize: 16,
		height: 20,
        color: Colors.highlight
	},
	analyseContent: {
		width: width - 20,
		fontSize: 16,
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