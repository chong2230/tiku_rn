/**
 * Created by shaotingzhou on 2017/5/8.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    AsyncStorage
} from 'react-native';

export default class BottomInfo extends Component {

    render() {
        const rowData = this.props.rowData;
        return (
            <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../../images/zan.png')} style={{width:20,height:20}} />
                    <Text>{rowData.likeCount}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../../images/comment.png')} style={{width:20,height:20}} />
                    <Text>留言</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:80,
        height:80,
        justifyContent:'center',
        alignItems:'center'
    }
});
