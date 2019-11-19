/**
* 基础Modal
* 实现背景遮罩，点击关闭Modal等功能
**/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Colors from './Colors';
import { TabbarSafeBottomMargin } from '../utils/Device';

const { width,height } = Dimensions.get('window');

export default class BaseModal extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showShadow: false
        };
    }

    componentDidMount() {
        this.showShadow(true);
    }

    passMethod = () => {
    	this.showShadow(false);
        this.props.onRequestClose()
    }

    // 控制背景遮罩的显示和隐藏
    showShadow = (bool) => {
    	let self = this;
        this.shadowTimer = setTimeout(function() {
            self.setState({
                showShadow: bool
            })
        }, 200);
    }

    renderModalView = () => {
    	return null;
    }

    render() {
    	let modalHeight = this.props.modalHeight;
    	let placeHolderHeight = height - modalHeight - (this.props.showSafeBottom ? TabbarSafeBottomMargin : 0);
        return (
            <View style={styles.container}>
            	<TouchableWithoutFeedback onPress={()=>this.passMethod()}>
                    <View style={[styles.shadowView, this.state.showShadow ? styles.showShadowView : null]}>
                    </View>
                </TouchableWithoutFeedback>
            	<Modal
                    animationType=this.props.animationType
                    transparent={true}
                    visible={this.props.showModal}
                    onRequestClose={() => {this.onRequestClose()}} // android必须实现
                    >
                    	<TouchableWithoutFeedback onPress={()=>this.passMethod()}>
		                    <View style={[styles.placeHolderView, placeHolderHeight]}></View>
		                </TouchableWithoutFeedback>
                    	<View style={[styles.modalStyle, {height: modalHeight}]}>
	                    {
	                        this.renderModalView()
	                    }
	                	</View>
                </Modal> 

                
                
                <View style={styles.safeBottom}></View>
            </View>
        );
    }

    componentWillUnmount() {
        this.shadowTimer && clearTimeout(this.shadowTimer);
    }
}

BaseModal.propTypes = {
	animationType: PropTypes.string,
    modalHeight: PropTypes.number,
    showSafeBottom: PropTypes.bool,
    onPress: PropTypes.func,
};

BaseModal.defaultProps = {
	animationType: 'slide',
	modalHeight: height * 0.4,
	showSafeBottom: true
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    shadowView:{
        backgroundColor: 'black',
        opacity: 0,
        height: height,
        width: width,
    },
    showShadowView: {
        opacity: 0.4
    },
    placeHolderView:{
        backgroundColor: 'black',
        opacity: 0,
        width: width
    },
    modalStyle:{
        backgroundColor: 'white',
        width: width
    },
    safeBottom: {
        backgroundColor: 'black',
        height: TabbarSafeBottomMargin
    }
});

