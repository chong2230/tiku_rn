/**
 *  答题卡Modal
 * 包括收藏、
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform
} from 'react-native';

import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { TabbarSafeBottomMargin } from '../../utils/Device';

const { width,height } = Dimensions.get('window');
const itemHeight = 50;
const itemCount = 8;
const separatorHeight = 12;
const lineHeight = 1;
const modalHeight = itemHeight*itemCount + separatorHeight;
const ModalBottomMargin = (Platform.OS == 'ios' ? 0 : 20);

export default class TimuCardModal extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            
        };
    }

    // _savePaper = () => {
    //     this.props.onRequestClose()
    //     this.props.savePaper();
    // }

    _handlePaper = () => {
        this.props.onRequestClose();
        this.props.handlePaper();
    }

    _renderList = () => {
        let listView = [];
        for (let i in this.props.list) {
            i = parseInt(i);
            let data = this.props.list[i];
            let containerStyle, btnStyle;
            let hasDone = data.done;//data.myAnswers && data.myAnswers.length > 0;
            // if (hasDone) {
            //     for (let j in data.myAnswers) {
            //         if (!data.myAnswers[j].myAnswer) {
            //             hasDone = false;
            //             break;
            //         }
            //     }
            // }
            if (i == this.props.index - 1) {
                containerStyle = { backgroundColor: Colors.special };
                btnStyle = { color: 'white' };
            } else if (hasDone) {
                containerStyle = { backgroundColor: Colors.highlight };
                btnStyle = { color: 'white' };
            } else {
                containerStyle = { 
                    borderColor: Colors.gray,
                    borderWidth: 0.5
                };
            }
            let btn = (
                <Button text={i+1} key={this.props.list[i].id}
                    containerStyle={[styles.circleBtnContainer, containerStyle]} 
                    style={[styles.circleBtn, btnStyle]} 
                    onPress={()=>{
                        this.props.onRequestClose();
                        this.props.choose(i+1)}
                    }></Button>
            );
            listView.push(btn);
        }
        return (
            <ScrollView contentContainerStyle={styles.list}>
                {listView}
            </ScrollView>
        );
    }

    _renderTip = () => {
        return (
            <View style={styles.tipView}>
                <Button text="已做" 
                    containerStyle={[styles.circleBtnContainer, { backgroundColor: Colors.highlight }]} 
                    style={[styles.circleBtn, { color: 'white' }]} ></Button>
                <Button text="当前" 
                    containerStyle={[styles.circleBtnContainer, { backgroundColor: Colors.special }]} 
                    style={[styles.circleBtn, { color: 'white' }]} ></Button>
                <Button text="未做" 
                    containerStyle={[styles.circleBtnContainer, { 
                        borderColor: Colors.gray,
                        borderWidth: 0.5
                    }]} 
                    style={styles.circleBtn} ></Button>
                <View style={styles.spaceView}></View>
                {/*<View style={styles.spaceView}></View>*/}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                { /* 解决全面屏底部留白问题 */ }
                <View style={styles.bottomSpace}></View>
                <TouchableWithoutFeedback onPress={()=>this.props.onRequestClose()}>
                    <View style={styles.shadowView}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.modalStyle}>
                    <Text style={styles.title}>答题卡</Text>
                    {this._renderList()}
                    <View style={styles.space}></View>
                    {this._renderTip()}
                    {
                        !this.props.isAnalyse ?
                            <View style={styles.bottom}>
                                <Button text="交卷" containerStyle={styles.handleBtnContainer}
                                        style={styles.handleBtn}
                                        onPress={()=>{this._handlePaper();}}></Button>
                            </View>
                            : null
                    }
                </View>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    shadowView:{
        backgroundColor: 'black',
        opacity: 0,
        height: height - modalHeight - TabbarSafeBottomMargin - ModalBottomMargin,
        width: width,
    },
    modalStyle: {
        backgroundColor: 'white',
        width: width,
        height: modalHeight
    },
    title: {
        width: width,
        height: 40,
        lineHeight: 40,
        color: Colors.title,
        fontSize: 18,
        textAlign: 'center'
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    circleBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 25,
        margin: 10,
        backgroundColor: 'white'
    },
    circleBtn: {
        color: 'black'
    },
    tipView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    space: {
        flex: 1
    },
    bottom: {
        width: width
    },
    handleBtnContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        width: width - 20,
        height: 40,
        margin: 10,
        backgroundColor: Colors.highlight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    handleBtn: {
        color: 'white',
        fontSize: 16
    },
    line: {
        backgroundColor: '#eceff2',
        width: width - 50,
        height: lineHeight,
        marginLeft: 20,
    },
    separator: {
        backgroundColor: '#eceff2',
        height: separatorHeight
    },
    bottomSpace: {
        backgroundColor: 'white',
        width: width,
        height: 20,
        position: 'absolute',
        bottom: 0
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});

