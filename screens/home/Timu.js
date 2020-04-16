import React, { Component } from 'react';
import {
	Text,
    TextInput,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
    TouchableWithoutFeedback,
	Modal,
	StyleSheet,
	Dimensions,
	Platform,
	NativeModules
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import ImageViewer from 'react-native-image-zoom-viewer';
import CameraRoll from "@react-native-community/cameraroll";

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import TimuCardModal from './TimuCardModal';
import HTMLView from '../../components/HTMLView';
import Button from '../../components/Button';
import CameraButton from '../../components/CameraButton';
import Toast from '../../components/Toast';
import Alert from '../../components/Alert';
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
			viewImages: [],
	  		showModal: false,
	  		showCardModal: false,
            showImageModal: false
	  	};
	  	this.showMultiChoiceTip = false;		// 多选题提示
	  	this.showUncertainChoiceTip = false;	// 不定项选择题提示
	  	this.isFetchScantron = false;			// 是否已经获取了答题卡接口，新版接口出来后修改为false
	  	this.hasChoosed = true;//false;
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
			professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id,
			paperId: state.params.id,
			type: state.params.type,    // 区分查看解析和重新做题
			doModel: state.params.doModel || 1
		};
		Common.getTimuList(params, (result)=>{
			// console.log('getTimuList ', result);
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
					this._showLoading(true);
					Common.getTimu(params, (result)=>{
						this._showLoading(false);
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
		                        if (ask.answerImg) info.answersImg.push(ask.answerImg); // '/img/avatar/gB3rKrYQ.JPG,/img/avatar/VgDwOt5l.PNG'
		                        info.analysis.push(ask.analysis);
		                        info.analysisImg.push(ask.analysisImg);
		                        // if (result.data.askList.length == 1) info.question = ask.question || '';
							}
							info = Object.assign({}, result.data, info);
							// console.log('info ', info);
							this.setState({
								index: index || 1,	// 不传则默认为1
								info: info,
		                        askList: result.data.askList
							});
							this._convertAnswers(result.data.askList);
							// 切换题目时自动滑动到顶部
							if (index) {
								setTimeout(()=>{
									this.scrollView.scrollTo({x:0,y: 0,animated:false})
								}, 10);
                            }
						} else {
							this.toast.show(result.msg);
						}
					});
				}
    //         })
        // }

	}

	_showLoading = (bool=true)=>{
		global.mLoadingComponentRef && global.mLoadingComponentRef.setState({ showLoading: bool });
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

	// doModel: 1 练习模式 2 考试模式
	// 考试模式时历年真题、模拟试卷不能查看解析
	_getAnalyse = () => {
		let { state } = this.props.navigation;
		if (!state.params.isAnalyse && state.params.doModel == 2 /*&&
			(state.params.functionName == '历年真题' || state.params.functionName == '模拟试卷')*/) {
            this.toast.show('考试模式时不能查看解析哦~');
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
        // if (!state.params.isAnalyse && state.params.doModel == 2 &&
        //     (state.params.functionName == '历年真题' || state.params.functionName == '模拟试卷')) {
        //     this.toast.show('答题时不能收藏哦~');
        //     return;
        // }
		let self = this;
		let info = this.state.info;
		let params = {
			professionId: info.professionId,
			courseId: info.courseId,
			paperId: info.paperId,
			questionId: info.id,
			type: info.collected ? 0 : 1
		};
		Common.collectTimu(params, (result)=>{
			if (result.code == 0) {
				info.collected = !info.collected;
				self.setState({
					info: info
				})
			} else {
				this.toast.show(result.msg);
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
		// console.log(currentAnswers);
        this.setState({
            currentAnswers: currentAnswers,
        });
		this._saveTimu();
	}

	_getPrev = (isSlip) => {
		if (this.state.index == 1) {
			if (isSlip) this.toast.show('已是第一题哦~');
			return;
		}
        this._clear();
		let id = this.state.list[this.state.index-2].id;
		this._getTimu(id, this.state.index - 1);
	}

	_getNext = (isSlip) => {
		if (this.state.index == this.state.total) {
			if (isSlip) this.toast.show('已是最后一题哦~');
			return;
		}
        this._clear();
		let id = this.state.list[this.state.index].id;
		this._getTimu(id, this.state.index + 1);
	}

    _goRecorrect = () => {
        let { navigate, state } = this.props.navigation;
        let info = this.state.info;
        let question;
        if (this.state.askList.length > 1) {
            let name = info.name ? info.name.replace(/^\d*\./, '')
                .replace(/^\d*、/, '').replace(/^\d*．/, '').replace(/^\d*\s/, '') : '';
            question = info.name ? this.state.index+ '. ' + name : '';
		} else {
            let ask = this.state.askList[0].ask.replace(/^\d*\./, '')
                .replace(/^\d*、/, '').replace(/^\d*．/, '');
            question = this.state.index + '. ' + ask;
		}
        navigate('Recorrect', {paperName: state.params.name || '', question: question,
            questionId: info.id,
			paperId: state.params.from == 'WrongTimu' ? '' : state.params.id, isVisible: false});
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
            // doMode: state.params.doMode || 1
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
            if (info.answersImg[i]) askAndAnswer.answerImg = info.answersImg[i];
            obj.askAndAnswers.push(askAndAnswer);
		}
		qaas.push(obj);
        params.qaas = qaas;
		Common.saveTimu(params, (result)=>{
			if (result.code == 0) {
				this.hasChoosed = true;
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
			} else if (result.code == 2) {
				this._goLogin();

			} else {
				this.toast.show(result.msg);
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
				// console.log('getTimuList ', result);
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
            showCardModal: false,
            showImageModal: false
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
                    state.params.callback(3);
                }
	            navigate('Report', {info: JSON.stringify(result.data), 
	            	paperId: info.paperId, returnKey: state.key, isVisible: false});
			} else {
				this.toast.show(result.msg);
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

    onFileUpload = (resp, index) => {
		if (resp.code == 0) {
			let info = this.state.info;
			// 对题目的某个问题添加图片
            if (info.answersImg[index]) {
            	info.answersImg[index] += ',' + resp.data;
            } else {
            	info.answersImg[index] = resp.data;
			}
			this.setState({
				info: info
			}, ()=>{
                this._saveTimu();
			});
		} else {
			this.toast.show(resp.msg);
		}
	}

    _goViewImage = (index) => {
        let info = this.state.info;
        if (info.answersImg[index]) {
        	let imgs = info.answersImg[index].split(',');
        	let viewImages = [];
        	for (let i in imgs) {
                let obj = {};
                obj.url = Common.baseUrl + imgs[i];
        		viewImages.push(obj);
			}
        	this.setState({
                viewImages: viewImages,
				showModal: true,
                showImageModal: true
			})
        }
	}

    savePhoto(url) {
		console.log('savePhoto ', url);
        let promise = CameraRoll.saveToCameraRoll(url);
        promise.then(function (result) {
            alert("已保存到系统相册")
        }).catch(function (error) {
            alert('保存失败！\n' + error);
        });
    }

    _goLogin = () => {
        const { navigate } = this.props.navigation;
        navigate('Login', { isVisible: false, title: '密码登录', transition: 'forVertical', refresh: (token)=>{
                if (token != null) {
                    // this._load();
                }
            }});
    }

    // 一道题有多个问题和答案
    _renderQuestions = () => {
        switch (this.state.info.type) {
            case '填空题':
                return this._renderFillBlankQuestions();
            case '简答题':
            case '计算分析题':
            case '计算题':
            case '综合题':
            case '案例题':
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
            // 适配一个问题多张图片
            let imgsView = [];
            if (info.answersImg[i]) {
                let imgs = info.answersImg[i].split(',');
                for (let j in imgs) {
                    let imgView =
						<TouchableWithoutFeedback onPress={()=>{this._goViewImage(i)}} key={'image-'+j}>
							<Image source={{uri: Common.baseUrl + imgs[j]}} style={styles.image} />
						</TouchableWithoutFeedback>;
                    imgsView.push(imgView);
                }
            }
            if (imgsView.length < 3) {
                let addBtn = <CameraButton style={styles.cameraBtn} key={'image-add'}
                                           source={require('../../images/account/add_icon.png')}
                                           iconStyle={styles.image}
                                           onFileUpload={(resp)=>{
                                               this.onFileUpload(resp, i);
                                           }} />
                imgsView.push(addBtn);
			}
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
					<View style={styles.imgsView}>
                    { imgsView }
					</View>
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
		let content = (this.state.askList.length > 1 ? '' : this.state.index + '. ') + ask;
        let textProps = {
            style: styles.commentHtmlTextStyle
        }
		// 一题多问，问题不显示序号
		return (
            this.state.askList[index].ask ?
                <HTMLView value={content} style={styles.htmlStyle} textComponentProps={textProps} />
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
		if (this.state.info.collected) {
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
                {/*<Button text="纠错"*/}
                        {/*containerStyle={styles.buttonContainer}*/}
                        {/*style={styles.recorrectButton}*/}
                        {/*onPress={()=>{this._goRecorrect()}}></Button>*/}
				<Button text="上一题" style={[styles.button, prevBtnStyle]} 
					onPress={()=>{this._getPrev()}}></Button>
				<Button text="下一题" style={[styles.button, nextBtnStyle]} 
					onPress={()=>{this._getNext()}}></Button>
				<Button text={this.getCurrentTotalLabel()}
					style={styles.button}
				  	onPress={()=>{this._getScantron()}}></Button>
			</View>
		);
	}

	getCurrentTotalLabel = () => {
		return '交卷 ' + this.state.index + '/' + this.state.total;
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
		let position = {
            startX: 0,
            startY: 0,            
            endX: 0,
            endY: 0
        };
		return (
			<View style={styles.container}>
				<Bar></Bar> 
                <Header title={state.params.name || ''}
						rightText={'纠错'}
                        onRight={this._goRecorrect}
						goBack={()=>{
							let { state, goBack } = this.props.navigation;
							if (this.hasChoosed && state.params.callback instanceof Function) {
								state.params.callback(2);
							}
							goBack();
                		}}
						></Header>
				<ScrollView ref={(ref)=>{this.scrollView = ref;}} 
						style={styles.content}
						onTouchStart={(e)=>{
							position.startX = e.nativeEvent.pageX;
							position.startY = e.nativeEvent.pageY;
						}}
						onTouchEnd={(e)=>{
							position.endX = e.nativeEvent.pageX;
							position.endY = e.nativeEvent.pageY;
							// 竖直方向滑动超过100时，不做左右切换
							if (Math.abs(position.endY - position.startY) > 100) {
								e.preventDefault();
								return;
                            } else if (position.endX - position.startX > 50) {
								this._getPrev(true);
							} else if (position.endX - position.startX < -50) {
								this._getNext(true);
							}
						}}
						>
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
							{
								this.state.showImageModal ?
                                    <ImageViewer imageUrls={this.state.viewImages}
                                                 menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
                                                 onChange={(index) => { }} // 图片切换时触发
                                                 onClick={() => { // 图片单击事件
                                                     this.onRequestClose()
                                                 }}
                                                 onSave={(url) => { this.savePhoto(url) }}
									/>
									: null
							}
                        </Modal> 
                    </View>: null
                }
                {/*<Alert*/}
                    {/*ref={(ref)=>this.alert = ref}*/}
                    {/*modalWidth={270}*/}
                    {/*modalHeight={124}*/}
                    {/*titleText="您确定退出练习吗"*/}
                    {/*titleFontSize={16}*/}
                    {/*titleFontWeight={"bold"}*/}
                    {/*okText={'确定'}*/}
                    {/*cancelText={'取消'}*/}
                    {/*confirm={()=>{*/}
                        {/**/}
                    {/*}}*/}
                    {/*okFontColor={'#4789F7'}*/}
                {/*/>*/}
                <Toast ref={(ref)=>this.toast = ref} position="center" />
			</View>
		);
	}

	_clear = () => {
        clearTimeout(this.nextTimeout);
        clearTimeout(this.inputTimeout);
	}

    componentWillUnmount() {
    	this._clear();
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
    htmlStyle: {
        flex: 1,
        flexDirection: 'column',
        // padding: 10,
        marginVertical: 10,
        backgroundColor: 'white'
    },
    commentHtmlTextStyle: {
        fontSize: 16,
        color: Colors.default,
        lineHeight: 20
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
    recorrectButton: {
        margin: 20,
        color: Colors.gray
	},
    imgsView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 79,
        height: 79,
		marginTop: 10,
		marginLeft: 10,
        borderRadius: 4,
        right: 0
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