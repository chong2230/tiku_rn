/**
 * react-native-easy-toast
 * https://github.com/crazycodeboy/react-native-easy-toast
 * Email:crazycodeboy@gmail.com
 * Blog:http://jiapenghui.com
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Animated,
    Dimensions,
    Text,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native'

import PropTypes from 'prop-types';
const ViewPropTypes = RNViewPropTypes || View.propTypes;
const DURATION = { 
    LENGTH_LONG: 2000,
    LENGTH_SHORT: 500,
    FOREVER: 0,
};

const {height, width} = Dimensions.get('window');

export default class Toast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            text: '',
            opacityValue: new Animated.Value(this.props.opacity),
        }
    }

    show(text, duration, callback) {
        this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_LONG;
        this.callback = callback;
        this.setState({
            isShow: true,
            text: text,
        });

        Animated.timing(
            this.state.opacityValue,
            {
                toValue: this.props.opacity,
                duration: this.props.fadeInDuration,
            }
        ).start(() => {
            this.isShow = true;
            if(duration !== DURATION.FOREVER) this.close();
        });
    }

    close( duration ) {
        let delay = typeof duration === 'undefined' ? this.duration : duration;

        if(delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250;

        if (!this.isShow && !this.state.isShow) return;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0.0,
                    duration: this.props.fadeOutDuration,
                }
            ).start(() => {
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
                if(typeof this.callback === 'function') {
                    this.callback();
                }
            });
        }, delay);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let pos;
        switch (this.props.position) {
            case 'top':
                pos = this.props.positionValue;
                break;
            case 'center':
                pos = height / 2 - 20;
                break;
            case 'bottom':
                pos = height - this.props.positionValue;
                break;
        }

        const view = this.state.isShow ?
            <View
                style={[styles.container, { top: pos }]}
                pointerEvents="none"
            >
                <Animated.View
                    style={[styles.content, { opacity: this.state.opacityValue }, this.props.style]}
                >  
                    { this.props.showIcon ? <Image source={require('../images/icon/toast.png')} style={styles.icon}></Image> : null }
                    { this.props.showIcon ? <View style={styles.separator}></View> : null}                    
                    {React.isValidElement(this.state.text) ? this.state.text : (this.state.text ? <Text style={this.props.textStyle}>{this.state.text}</Text> : null)}
                </Animated.View>
            </View> : null;
        return view;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        elevation: 999,
        alignItems: 'center',
        zIndex: 10000,
    },
    content: {
        flex: 1,
        backgroundColor: 'black',
        borderRadius: 5,
        padding: 10,
        // width: 109,
        // height: 109,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 43,
        height: 32
    },
    text: {
        color: 'white',
        fontSize: 15
    },
    separator: {
        width: 109,
        height: 20
    }
});

Toast.propTypes = {
    style: ViewPropTypes.style,
    position: PropTypes.oneOf([
        'top',
        'center',
        'bottom',
    ]),
    textStyle: Text.propTypes.style,
    positionValue:PropTypes.number,
    fadeInDuration:PropTypes.number,
    fadeOutDuration:PropTypes.number,
    opacity:PropTypes.number,
    showIcon:PropTypes.bool
}

Toast.defaultProps = {
    position: 'bottom',
    textStyle: styles.text,
    positionValue: 120,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 0.58,
    showIcon: false
}
