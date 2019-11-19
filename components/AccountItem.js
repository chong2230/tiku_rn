/**
 * Created by shaotingzhou on 2017/5/2.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
export default class AccountItem extends Component {
    render() {
        return (
            <TouchableOpacity  onPress={this.props.onPress}>
                <View style={styles.item}>
                    <Image source={this.props.source} style={styles.leftIcon} />
                    <Text style={{fontSize:15,marginLeft: 10}}>{this.props.txt1}</Text>
                    <Text style={{fontSize:13,color:'#CCCCCC'}}>{this.props.txt2}</Text>
                    <Text style={styles.count}>{this.props.count}   </Text>
                    <Image source={require('../images/account/right-arrow.png')} style={styles.rightIcon} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection:'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 0.5,
    },
    leftIcon: {
        width: 20,
        height: 20
    },
    rightIcon: {
        width: 10,
        height: 10,
        position: 'absolute',
        right: 20
    },
    count: {
        color: '#828282',
        position: 'absolute',
        right: 35
    }
});

