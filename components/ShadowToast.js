/**
 * @Description: 带图片背景遮罩的Toast提示
 * @author cluo
 * @date 2020/2/8
*/
import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import Colors from "../constants/Colors";

const DURATION = {
    LENGTH_LONG: 2000,
    LENGTH_SHORT: 500,
    FOREVER: 0,
};
let {width, height} = Dimensions.get('window');

class ShadowToast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            text: '',
        }
    }

    close() {
        this.setState({
            isShow: false
        });
    }

    show(text, bool=true) {
        this.setState({
            text: text,
            isShow: true
        }, ()=>{
            this.timeout = setTimeout(()=>{
                this.close();
            }, DURATION.LENGTH_LONG);
        });
    }

    render() {
        if (!this.state.isShow) {
            return null;
        }
        return (
            <View style={styles.container}>
                <View style={styles.shadowView}></View>
                <View style={ styles.content }>
                    <Image style={ styles.icon }
                           source={ this.props.source ? this.props.source : require('../images/icon/ok2.png') }/>
                    <Text style={styles.text}>{this.state.text}</Text>
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }
}

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        position: 'absolute',
        zIndex: 10
    },
    shadowView: {
        top: 0,
        left: 0,
        width: width,
        height: height,
        opacity: 0.5,
        backgroundColor: 'black',
        position: 'absolute'
    },
    content: {
        left: width/2 - 100,
        top: height/2 - 65,
        width: 200,
        height: 130,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 5
    },
    icon: {
        width: 50,
        height: 50,
        marginLeft: 75,
        marginTop: 20
    },
    text: {
        color: Colors.title,
        fontSize: 17,
        marginTop: 19,
        width: 200,
        textAlign: 'center'
    },
});
var PropTypes = require('prop-types');
ShadowToast.propTypes = {
    loadingViewClick: PropTypes.func, //.isRequired,
    opacity: PropTypes.number,
    backgroundColor: PropTypes.string
};

export default ShadowToast;