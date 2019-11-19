/**
 * 切换考试科目Modal
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform
} from 'react-native';
import Colors from '../constants/Colors';
import { TabbarSafeBottomMargin } from '../utils/Device';

const { width,height } = Dimensions.get('window');
const itemHeight = 50;
const itemCount = 2;        // 举报/删除、取消
const separatorHeight = 10; // 举报/删除和取消间距
const lineHeight = 1;       // 地图之间间距
const modalHeight = itemHeight*itemCount + separatorHeight;
const ModalBottomMargin = (Platform.OS == 'ios' ? 0 : 20);

export default class SwitchModal extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            
        };
    }

    passMethod = (type) => {
        this.props.onRequestClose()
        setTimeout(()=>{
            this.props.postMessage(type);
        }, 100)        
    }

    render() {        
        return (
            <View style={styles.container}>
                { /* 解决全面屏底部留白问题 */ }
                <View style={styles.space}></View>
                <TouchableWithoutFeedback onPress={()=>this.props.onRequestClose()}>
                    <View style={styles.shadowView}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.modalStyle}>
                    <TouchableOpacity onPress={()=>this.passMethod(1)}>
                        <View style={styles.item}>
                            <Text style={styles.textStyle}>切换科目</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.line}></View>
                    <TouchableOpacity onPress={()=>this.passMethod(2)}>
                        <View style={styles.item}>
                            <Text style={styles.textStyle}>切换专业</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.separator}></View>
                    <TouchableOpacity onPress={()=>this.props.onRequestClose()}>
                        <View style={styles.item}>
                            <Text style={styles.textStyle}>取消</Text>
                        </View>
                    </TouchableOpacity>
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
    mapView: {
        height: itemHeight*2 + 1
    },
    item: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: itemHeight
    },
    textStyle: {
        fontSize: 18,
        // marginTop: 15,
        // marginBottom: 10
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
    space: {
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

