/**
 * @Description: 纠错
 * @author cluo
 * @date 2020/1/18
*/

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import { trim } from '../../utils/Util';

export default class Recorrect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            content : ''
        };
    }

    _check = () => {
        if (trim(this.state.content) == '') {
            this.refs.toast.show('请输入纠错内容');
            return false;
        }
        return true;
    }

    _send = () => {
        if (this._check()) {
            const { state } = this.props.navigation;
            let params = {
                professionId: global.course.professionId,
                courseId: global.course.courseId || global.course.id,
                questionId: state.params.questionId,
                content: this.state.content
            };
            if (state.params.paperId) params.paperId = state.params.paperId;
            Common.recorrect(params, (result) => {
                if (result.code == 0) {
                    this.refs.toast.show('发送成功');
                    const { goBack } = this.props.navigation;
                    setTimeout(function() {
                        goBack();
                    }, 500);
                } else {
                    this.refs.toast.show(result.msg);
                }
            });
        }
    }

    _close = () => {
        let { goBack } = this.props.navigation;
        goBack();
    }

    render() {
        let { state, goBack } = this.props.navigation;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Bar />
                    <Header title={'纠错'} goBack={()=>{
                        goBack();
                    }} bottomLineColor={'rgba(0, 0, 0)'} />
                    <View style={styles.content}>
                        {
                            state.params.paperName
                                ? <Text style={styles.name}>试卷名称：{state.params.paperName}</Text>
                                : <Text style={styles.name}>科目名称：{global.course.name}</Text>
                        }
                        <Text style={styles.question} numberOfLines={3}>题目：{state.params.question}</Text>
                        <Text style={styles.tip}>纠错内容</Text>
                        <TextInput placeholder="详细的内容......" multiline={true} style={styles.inputStyle} onChangeText={(text)=>this.setState({content: text})}  />
                    </View>
                    <Button text="发送" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._send} />
                    <Button text="关闭" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._close} />
                    <Toast ref="toast" position="center" />
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bg
    },
    content: {
        margin: 10,
    },
    tip: {
        width: '100%',
        fontSize: 13,
        textAlign: 'center',
        color: Colors.gray,
        margin: 10
    },
    name: {
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        height: 30,
        lineHeight: 30,
        color: Colors.title,
        backgroundColor: 'white'
    },
    question: {
        color: Colors.text,
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 1,
        lineHeight: 30,
        backgroundColor: 'white'
    },
    inputStyle: {
        padding: 10,
        height: 250,
        fontSize: 15,
        backgroundColor: 'white'
    },
    btnContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.highlight,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    }
});
