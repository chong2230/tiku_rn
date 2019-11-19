import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';

import ImageButton from './ImageButton';
import Button from './Button';

//获取当前屏幕的大小
let {height,width} =  Dimensions.get('window');

class Header extends Component {

    static propTypes = {
        color: PropTypes.string,
        bgColor: PropTypes.string,
        goBack: PropTypes.func,
        onRight: PropTypes.func,
        leftBtnIsHidden: PropTypes.bool,
        bottomLineColor: PropTypes.string,
        rightText: PropTypes.string,
        rightElement: PropTypes.element
    }

    static defaultProps = {
        color: '#41C364',
        bgColor: 'white',
        leftBtnIsHidden: false,
        rightSource: undefined,
        bottomLineColor: '#E0E0E0'
    }

    render() {
        let specTextStyle;
        if (this.props.bgColor !== 'white') {
            specTextStyle = {
                color: 'white'
            }
        }
        return (
            <View style={[styles.header, {backgroundColor: this.props.bgColor, borderColor: this.props.bottomLineColor}]}>
                <View style={styles.headerCon}>
                    {this._renderLeftButton()}
                    <View style={styles.titleView}><Text style={[styles.title, specTextStyle]}>{this.props.title}</Text></View>
                    {this._renderRightButton()}
                </View>
            </View>
        )
    }

    _renderLeftButton = () => {
        let backImage  = this.props.bgColor === 'white' ?
            require('../images/icon/back.png') : require('../images/icon/back_white.png');
        // headerCon的'space-between'需要占位<View/>
        return (
            <TouchableOpacity onPress={()=>{ this.props.goBack(); }}>
                <View style={styles.left}>
                    {
                        this.props.leftBtnIsHidden ? null :
                            <Image
                                source={backImage}
                                style={styles.leftBtn}
                            />
                    }
                </View>
            </TouchableOpacity>
        );
    }

    _renderRightButton = () => {
        if (this.props.rightSource) {
            return  (
                <TouchableOpacity onPress={()=>{ this.props.onRight && this.props.onRight(); }}>
                    <View style={styles.right}>
                        <Image
                            source={this.props.rightSource}
                            style={styles.rightBtn}
                        />
                    </View>
                </TouchableOpacity>
            )
        }else if (this.props.rightText) {
            let textColor  = this.props.bgColor === 'white' ?  this.props.color : 'white';
            return (
                <View style={styles.right}>
                    <Button
                        containerStyle={{justifyContent: 'center'}}
                        style={[styles.rightBtn, {color: textColor, width: 50, lineHeight: 24, fontSize: 17}]}
                        text={this.props.rightText}
                        onPress={()=>{this.props.onRight && this.props.onRight()}}
                    />
                </View>
            )
        }else if (this.props.rightElement) {
            return this.props.rightElement
        }else {
            return <View style={styles.right} />;
        }
    }
}

const styles = StyleSheet.create({
    header: {
        width: width,
        backgroundColor: "#fff",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#E0E0E0",
        top: 0,
        // zIndex: 10
    },
    headerCon: {
        width: width,
        height: 44,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    left: {
        justifyContent: "center",
        alignItems: "center",
        // marginLeft: 10,
        width: 50,
        height: 44,
    },
    leftBtn: {
        width: 24,
        height: 24,
    },
    right: {
        justifyContent: "center",
        alignItems: "center",
        // marginRight: 10,
        width: 50,
        height: 44,
    },
    rightBtn: {
        width: 24,
        height: 24,
    },
    titleView: {
        width: width - 50 * 2,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        color: '#333333',
        fontWeight:'400',
        alignSelf: 'center',
        textAlign: 'center'
    }
})


export default Header;