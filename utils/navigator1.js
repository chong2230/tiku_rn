/**
 * Created by shaotingzhou on 2017/4/26.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
var {width,height} = Dimensions.get('window');

export default class Navigator1 extends Component {
    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <TouchableOpacity style={styles.leftStyle} onPress={()=>this.props.leftAction()}>
                    <Text style={styles.leftText}>{this.props.leftText}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.centerText}>{this.props.centerText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightStyle} onPress={()=>this.props.rightAction()}>
                    <Text style={styles.rightText}>{this.props.rightText}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 69,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:'#C1CDCD',
        backgroundColor: 'rgba(52, 52, 52, 0)'
    },
    leftStyle: {
        marginLeft:20,
        width: 50,
        height: 50
    },
    leftText: {
        color:'#565656', 
        fontSize: 20, 
        top: 25
    },
    centerText: {
        fontWeight:'400',
        fontSize:20,
        top: 10,
        left: -25
    },
    rightStyle: {
        marginRight:20
    },
    rightText: {
        color:'#FFC125'
    }
});

