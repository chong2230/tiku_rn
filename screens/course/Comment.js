/**
* 留言
**/
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions
} from 'react-native';

import Bar from '../../components/Bar';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';

export default class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content : ''
        };
    }

    _check = () => {
        if (this.state.content == '') {
            this.refs.toast.show('请输入您的留言');
            return false;
        }
        return true;
    }

    _checkLength = (str) => {
        if (str.length < 6 || str.length.length > 24) return false;
        else return true;
    }

    _send = () => {
        if (this._check()) {
            const { navigate, state } = this.props.navigation;
            console.log(this.state.content);
            Common.publishComment(state.params.id, this.state.content, (result) => {
                if (result.code == 0) {
                    this.refs.toast.show('留言成功');
                    const { navigate, state, goBack } = this.props.navigation;
                    if (state.params.refresh) state.params.refresh(result.data);
                    setTimeout(function() {
                        goBack();
                    }, 500);                    
                } else {
                    this.refs.toast.show(result.msg);
                }
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Bar />
                <TextInput placeholder="留言将由作者筛选后显示，对所有人可见" multiline={true} style={[styles.inputStyle, styles.contents]} onChangeText={(text)=>this.setState({content: text})}  />
                <Button text="留言" style={styles.btn} containerStyle={styles.btnContainer} onPress={this._send} />
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    tip: {
        fontSize: 13,
        textAlign: 'center',
        margin: 10
    },
    contents: {
    	height: 200
    },
    inputStyle: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        fontSize: 15,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
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
